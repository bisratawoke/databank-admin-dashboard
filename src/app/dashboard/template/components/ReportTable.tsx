/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Space,
} from "antd";
import { reportsWithFields, fieldType } from "../types";
import { createField } from "../actions/createField";
import { addFieldToReport } from "../actions/addFieldToReport";
import { updateField } from "../actions/updateField";
import { deleteField } from "../actions/deleteField";
import updateReport from "../actions/updateReport";
import DeleteButton from "../../components/ui/DeleteButton";
import AddButton from "../../components/ui/AddButton";
import { hasRelatedData } from "../actions/hasRelatedDataFields";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
const { Option } = Select;

export default function ReportTable({
  report: data,
  fieldTypes,
  reportId,
}: {
  report: reportsWithFields;
  fieldTypes: fieldType[];
  reportId: string;
}) {
  const [fields, setFields] = useState(data.fields);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<any>(null);

  const handleAddReport = () => {
    setEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values: any) => {
    if (!editing) {
      const { result, status } = await createField({
        ...values,
        type: JSON.parse(values.type)["_id"],
      });

      if (status === 201) {
        setFields((prevFields) => [
          ...prevFields,
          { ...result, type: JSON.parse(values.type) },
        ]);
        const { status: addFieldToReportStatus } = await addFieldToReport({
          reportId,
          field: result._id,
        });

        if (addFieldToReportStatus == 200) {
          form.resetFields();
          setIsModalVisible(false);
          message.success("Report Field added successfully !!");
        } else {
          message.error("Failed to add report. Please try again.");
        }
      } else {
        message.error("Failed to add report. Please try again.");
      }
    } else {
      const { status } = await updateField(selectedFieldId, {
        ...values,
        type: JSON.parse(values.type)["_id"],
      });

      if (status == 200) {
        setFields((prevFields) =>
          prevFields.map((field: any) => {
            if (field._id == selectedFieldId) {
              return {
                ...values,
                _id: selectedFieldId,
                type: JSON.parse(values.type),
              };
            } else return field;
          })
        );
        setIsModalVisible(false);
        message.success("Report fields updated successfully");
      } else {
        message.error("Failed to update report fields");
      }
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Default value",
      dataIndex: "defaultValue",
      key: "defaultValue",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Required",
      dataIndex: "required",
      key: "required",
      render: (filtered: boolean) =>
        filtered == true ? (
          <Tag color="green">Yes</Tag>
        ) : filtered == false ? (
          <Tag color="magenta">No</Tag>
        ) : (
          ""
        ),
    },
    {
      title: "Filtered",
      dataIndex: "filtered",
      key: "filtered",
      render: (filtered: boolean) =>
        filtered == true ? (
          <Tag color="green">Yes</Tag>
        ) : filtered == false ? (
          <Tag color="magenta">No</Tag>
        ) : (
          ""
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <>
          {record.key !== "addButtonRow" ? (
            <Space size="middle">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: "Are you sure you want to delete this record?",
                    content: "This action cannot be undone.",
                    okText: "Yes",
                    cancelText: "No",
                    onOk: async () => {
                      await deleteFields(record._id);
                    },
                  });
                }}
              >
                Delete
              </Button>
            </Space>
          ) : (
            <></>
          )}
        </>
      ),
    },
  ];

  const deleteFields = async (id: string) => {
    try {
      const { body: hasRelations } = await hasRelatedData(id);
      if (hasRelations) {
        message.error(
          "Cannot delete fields because there are data records that depend on it."
        );
        return;
      }
      const result = await deleteField(id);
      if (result.status == 200) {
        message.info("Successfully deleted record");
        setFields((fields) => fields.filter((field: any) => field._id != id));
      } else {
        message.error("Error deleting record");
      }
    } catch (error) {}
  };

  const dataWithAddButton = [
    ...(fields?.length > 0
      ? fields.map((field) => ({
          ...field,
          type: field.type.name,
        }))
      : []),
    {
      key: "addButtonRow",
      name: <AddButton action={handleAddReport} />,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataWithAddButton}
        pagination={false}
        rowKey="key"
        size="small"
        bordered
        onRow={(record: any) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              const currentField: any = fields.filter(
                (field: any) => field._id == record._id
              )[0];
              setSelectedFieldId(currentField["_id"]);
              setIsModalVisible(true);
              form.setFieldsValue({
                ...record,
                type: JSON.stringify(currentField["type"]),
              });

              setEditing(true);
            }
          },
        })}
      />

      <Modal
        title="Add New Field"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter report name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select placeholder="Select report type">
              {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
              {fieldTypes.map((type: any) => (
                <Option key={type._id} value={JSON.stringify(type)}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Required"
            name="required"
            rules={[
              { required: true, message: "Please select a required option" },
            ]}
          >
            <Select placeholder="Select required option">
              <Option value={true}>
                <span style={{ color: "green" }}>Yes</span>
              </Option>
              <Option value={false}>
                <span style={{ color: "red" }}>No</span>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Filtered"
            name="filtered"
            rules={[
              { required: true, message: "Please select a filtered option" },
            ]}
          >
            <Select placeholder="Select filtered option">
              <Option value={true}>
                <span style={{ color: "green" }}>Yes</span>
              </Option>
              <Option value={false}>
                <span style={{ color: "red" }}>No</span>
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Default Value"
            name="defaultValue"
            rules={[{ required: true, message: "Please enter default value" }]}
          >
            <Input placeholder="Enter default value" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,
//   Tag,
//   Space,
// } from "antd";
// import { reportsWithFields, fieldType } from "../types";
// import { createField } from "../actions/createField";
// import { addFieldToReport } from "../actions/addFieldToReport";
// import { updateField } from "../actions/updateField";
// import { deleteField } from "../actions/deleteField";
// import updateReport from "../actions/updateReport";
// import DeleteButton from "../../components/ui/DeleteButton";
// import AddButton from "../../components/ui/AddButton";
// import { hasRelatedData } from "../actions/hasRelatedDataFields";
// import { FaRegArrowAltCircleDown } from "react-icons/fa";
// const { Option } = Select;

// export default function ReportTable({
//   report: data,
//   fieldTypes,
//   reportId,
// }: {
//   report: reportsWithFields;
//   fieldTypes: fieldType[];
//   reportId: string;
// }) {
//   // Fields for managing the fields table modal (for adding/updating fields)
//   const [fields, setFields] = useState(data.fields);
//   const [isFieldModalVisible, setIsFieldModalVisible] = useState(false);
//   const [fieldForm] = Form.useForm();
//   const [editingField, setEditingField] = useState(false);
//   const [selectedFieldId, setSelectedFieldId] = useState<any>(null);

//   // States for the report update modal
//   const [isReportModalVisible, setIsReportModalVisible] = useState(false);
//   const [reportForm] = Form.useForm();

//   // Handler for opening the field modal for a new field
//   const handleAddReportField = () => {
//     setEditingField(false);
//     fieldForm.resetFields();
//     setIsFieldModalVisible(true);
//   };

//   // Submit handler for field add/update
//   const handleFieldFormSubmit = async (values: any) => {
//     if (!editingField) {
//       const { result, status } = await createField({
//         ...values,
//         type: JSON.parse(values.type)["_id"],
//       });

//       if (status === 201) {
//         setFields((prevFields) => [
//           ...prevFields,
//           { ...result, type: JSON.parse(values.type) },
//         ]);
//         const { status: addFieldToReportStatus } = await addFieldToReport({
//           reportId,
//           field: result._id,
//         });
//         if (addFieldToReportStatus === 200) {
//           fieldForm.resetFields();
//           setIsFieldModalVisible(false);
//           message.success("Report Field added successfully!");
//         } else {
//           message.error("Failed to add report field. Please try again.");
//         }
//       } else {
//         message.error("Failed to add report field. Please try again.");
//       }
//     } else {
//       const { status } = await updateField(selectedFieldId, {
//         ...values,
//         type: JSON.parse(values.type)["_id"],
//       });
//       if (status === 200) {
//         setFields((prevFields) =>
//           prevFields.map((field: any) => {
//             if (field._id === selectedFieldId) {
//               return {
//                 ...values,
//                 _id: selectedFieldId,
//                 type: JSON.parse(values.type),
//               };
//             } else return field;
//           })
//         );
//         setIsFieldModalVisible(false);
//         message.success("Report field updated successfully");
//       } else {
//         message.error("Failed to update report field");
//       }
//     }
//   };

//   // Handler to open the report update modal.
//   const handleShowUpdateReport = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     // Pre-populate the report form with current report values.
//     // Adjust these keys based on your actual report shape.
//     reportForm.setFieldsValue({
//       name: data.name,
//       description: data.description,
//     });
//     setIsReportModalVisible(true);
//   };

//   // Handler for submitting the report update form.
//   const handleReportFormSubmit = async (values: any) => {
//     const { status } = await updateReport({ reportId, payload: values });
//     if (status === 200) {
//       message.success("Report updated successfully");
//       setIsReportModalVisible(false);
//     } else {
//       message.error("Failed to update report");
//     }
//   };

//   // Table columns for report fields.
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Default value",
//       dataIndex: "defaultValue",
//       key: "defaultValue",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//     },
//     {
//       title: "Required",
//       dataIndex: "required",
//       key: "required",
//       render: (required: boolean) =>
//         required === true ? (
//           <Tag color="green">Yes</Tag>
//         ) : required === false ? (
//           <Tag color="magenta">No</Tag>
//         ) : (
//           ""
//         ),
//     },
//     {
//       title: "Filtered",
//       dataIndex: "filtered",
//       key: "filtered",
//       render: (filtered: boolean) =>
//         filtered === true ? (
//           <Tag color="green">Yes</Tag>
//         ) : filtered === false ? (
//           <Tag color="magenta">No</Tag>
//         ) : (
//           ""
//         ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_: any, record: any) => (
//         <>
//           {record.key !== "addButtonRow" && (
//             <Space size="middle">
//               <Button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   Modal.confirm({
//                     title: "Are you sure you want to delete this record?",
//                     content: "This action cannot be undone.",
//                     okText: "Yes",
//                     cancelText: "No",
//                     onOk: async () => {
//                       await deleteFieldHandler(record._id);
//                     },
//                   });
//                 }}
//               >
//                 Delete
//               </Button>
//               {/* This button now could be used to update the field itself */}
//               <Button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   const currentField: any = fields.find(
//                     (field: any) => field._id === record._id
//                   );
//                   setSelectedFieldId(currentField._id);
//                   fieldForm.setFieldsValue({
//                     ...record,
//                     type: JSON.stringify(currentField.type),
//                   });
//                   setEditingField(true);
//                   setIsFieldModalVisible(true);
//                 }}
//               >
//                 Update Field
//               </Button>
//             </Space>
//           )}
//         </>
//       ),
//     },
//   ];

//   const deleteFieldHandler = async (id: string) => {
//     try {
//       const { body: hasRelations } = await hasRelatedData(id);
//       if (hasRelations) {
//         message.error(
//           "Cannot delete fields because there are data records that depend on it."
//         );
//         return;
//       }
//       const result = await deleteField(id);
//       if (result.status === 200) {
//         message.info("Successfully deleted record");
//         setFields((fields) => fields.filter((field: any) => field._id !== id));
//       } else {
//         message.error("Error deleting record");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const dataWithAddButton = [
//     ...(fields?.length > 0
//       ? fields.map((field) => ({
//           ...field,
//           type: field.type.name,
//         }))
//       : []),
//     {
//       key: "addButtonRow",
//       name: <AddButton action={handleAddReportField} />,
//     },
//   ];

//   return (
//     <>
//       {/* Report Update Button */}
//       <Button
//         type="primary"
//         style={{ marginBottom: 16 }}
//         onClick={handleShowUpdateReport}
//       >
//         Update Report
//       </Button>

//       {/* Table showing report fields */}
//       <Table
//         columns={columns}
//         dataSource={dataWithAddButton}
//         pagination={false}
//         rowKey="key"
//         size="small"
//         bordered
//         onRow={(record: any) => ({
//           onClick: () => {
//             if (record.key !== "addButtonRow") {
//               const currentField: any = fields.find(
//                 (field: any) => field._id === record._id
//               );
//               setSelectedFieldId(currentField._id);
//               fieldForm.setFieldsValue({
//                 ...record,
//                 type: JSON.stringify(currentField.type),
//               });
//               setEditingField(true);
//               setIsFieldModalVisible(true);
//             }
//           },
//         })}
//       />

//       {/* Modal for adding/updating fields */}
//       <Modal
//         title={editingField ? "Update Field" : "Add New Field"}
//         visible={isFieldModalVisible}
//         onCancel={() => setIsFieldModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={fieldForm}
//           layout="vertical"
//           onFinish={handleFieldFormSubmit}
//         >
//           <Form.Item
//             label="Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter the name" }]}
//           >
//             <Input placeholder="Enter field name" />
//           </Form.Item>
//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[{ required: true, message: "Please enter description" }]}
//           >
//             <Input placeholder="Enter description" />
//           </Form.Item>
//           <Form.Item
//             label="Type"
//             name="type"
//             rules={[{ required: true, message: "Please select a type" }]}
//           >
//             <Select placeholder="Select field type">
//               {fieldTypes.map((type: any) => (
//                 <Option key={type._id} value={JSON.stringify(type)}>
//                   {type.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item
//             label="Required"
//             name="required"
//             rules={[
//               { required: true, message: "Please select a required option" },
//             ]}
//           >
//             <Select placeholder="Select required option">
//               <Option value={true}>
//                 <span style={{ color: "green" }}>Yes</span>
//               </Option>
//               <Option value={false}>
//                 <span style={{ color: "red" }}>No</span>
//               </Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             label="Filtered"
//             name="filtered"
//             rules={[
//               { required: true, message: "Please select a filtered option" },
//             ]}
//           >
//             <Select placeholder="Select filtered option">
//               <Option value={true}>
//                 <span style={{ color: "green" }}>Yes</span>
//               </Option>
//               <Option value={false}>
//                 <span style={{ color: "red" }}>No</span>
//               </Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             label="Default Value"
//             name="defaultValue"
//             rules={[{ required: true, message: "Please enter default value" }]}
//           >
//             <Input placeholder="Enter default value" />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal for updating the report */}
//       <Modal
//         title="Update Report"
//         visible={isReportModalVisible}
//         onCancel={() => setIsReportModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={reportForm}
//           layout="vertical"
//           onFinish={handleReportFormSubmit}
//         >
//           <Form.Item
//             label="Report Name"
//             name="name"
//             rules={[
//               { required: true, message: "Please enter the report name" },
//             ]}
//           >
//             <Input placeholder="Enter report name" />
//           </Form.Item>
//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[{ required: true, message: "Please enter description" }]}
//           >
//             <Input placeholder="Enter description" />
//           </Form.Item>
//           {/* Add any additional report-level fields as needed */}
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Update Report
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// }
