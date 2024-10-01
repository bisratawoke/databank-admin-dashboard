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
import DeleteButton from "../../components/ui/DeleteButton";
import AddButton from "../../components/ui/AddButton";
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
          message.success("Report added successfully!");
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
              <DeleteButton
                action={async (e) => {
                  e.stopPropagation();
                  const result = await deleteField(record._id);
                  if (result.status == 200) {
                    message.info("Successfully deleted record");
                    setFields((fields) =>
                      fields.filter((field: any) => field._id != record._id)
                    );
                  } else {
                    message.error("Error deleting record");
                  }
                }}
              />
            </Space>
          ) : (
            <></>
          )}
        </>
      ),
    },
  ];

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
