/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Tag,
  Select,
} from "antd";
import { createReport } from "../actions/createReport";
import { useRouter } from "next/navigation";
import styles from "../styles/ReportListTable.module.css";

import AddButton from "../../components/ui/AddButton";
import { UpdateSubCategory } from "../../organization/actions/updateSubcategory";
import RequestInitialApproval from "../actions/requestInitalApproval";
const { Option } = Select;

export default function ReportListTable({
  reports: data,
  subCategories,
}: {
  reports: Array<Record<string, unknown>>;
  subCategories: Array<any>;
}) {
  const router = useRouter();
  const [reports, setReports] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const anVal = { ...values };
        delete values.type;
        const newReport = {
          ...values,
          start_date: values.start_date?.format("YYYY-MM-DD"),
          end_date: values.end_date?.format("YYYY-MM-DD"),
          fields: [],
          data: [],
        };

        try {
          const res: any = await createReport(newReport);

          if (res.status === 201 || res.status === 200) {
            const result = res.body;

            const subCat = JSON.parse(anVal.type);

            const { status } = await UpdateSubCategory({
              payload: {
                name: subCat.name,
                report: [
                  ...subCat.report.map((report: any) => report._id),
                  result._id,
                ],
              },
              subCategoryId: subCat._id,
            });

            if (status == 200) {
              message.success("Report added successfully!");

              await RequestInitialApproval(result._id);
              setReports((prevReports) => [
                ...prevReports,
                { ...result, key: result._id },
              ]);

              form.resetFields();
              setIsModalVisible(false);
            } else {
              // console.log(body);
            }
          } else {
            message.error("Failed to add the report.");
          }
        } catch (error) {
          console.error("Error creating report:", error);
          message.error("An error occurred while creating the report.");
        }
      })
      .catch((errorInfo) => {
        console.log("Form Validation Failed:", errorInfo);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Fields",
      dataIndex: "fields",
      key: "fields",
      render: (fields: any) => (
        <>
          {fields?.map((field: any) => (
            <Tag color="blue" key={field._id}>
              {field.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (data: any) => (
        <>
          {data?.slice(0, 20).map((item: any) => (
            <Tag color="green" key={item._id}>
              {item.value}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },

    // {
    //   title: "Author",
    //   dataIndex: "author",
    //   key: "author",
    // },
    // {
    //   title: "Data Quality Limitations",
    //   dataIndex: "data_quality_limitations",
    //   key: "data_quality_limitations",
    // },
    // {
    //   title: "Time Coverage",
    //   dataIndex: "time_coverage",
    //   key: "time_coverage",
    // },
    // {
    //   title: "Update Frequency",
    //   dataIndex: "update_frequency",
    //   key: "update_frequency",
    // },
    // {
    //   title: "Access Restrictions",
    //   dataIndex: "access_restrictions",
    //   key: "access_restrictions",
    // },
    // {
    //   title: "Payment Amount",
    //   dataIndex: "payment_amount",
    //   key: "payment_amount",
    //   render: (amount: number) => (amount ? `$${amount}` : "N/A"),
    // },
    // {
    //   title: "Licenses/Terms of Use",
    //   dataIndex: "licenses_terms_of_use",
    //   key: "licenses_terms_of_use",
    // },
    // {
    //   title: "Contact Information",
    //   dataIndex: "contact_information",
    //   key: "contact_information",
    // },
    // {
    //   title: "File Formats",
    //   dataIndex: "file_formats_available",
    //   key: "file_formats_available",
    //   render: (formats: string[]) => formats?.join(", ") || "N/A",
    // },
    // {
    //   title: "API Access",
    //   dataIndex: "api_access",
    //   key: "api_access",
    //   render: (access: boolean) => (access ? "Enabled" : "Disabled"),
    // },
    // {
    //   title: "Data Structure Information",
    //   dataIndex: "data_structure_information",
    //   key: "data_structure_information",
    // },
  ];

  const dataWithButton = [
    ...(reports || []),
    {
      key: "addButtonRow",
      name: <AddButton action={showModal} />,
    },
  ];

  return (
    <>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataWithButton}
        bordered
        size="small"
        rowClassName={(record, index) =>
          index % 2 === 0 ? styles.evenRow : styles.oddRow
        }
        onRow={(record) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              router.push(`/dashboard/template/reports/${record._id}`);
            }
          },
        })}
        pagination={false}
      />

      <Modal
        title="Add New Report"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleClose}
        okText="Create Report"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          {/* Existing Fields */}
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
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input placeholder="Enter report description" />
          </Form.Item>

          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: "Please select the start date" },
              ]}
              style={{ flexGrow: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              rules={[
                { required: true, message: "Please select the end date" },
              ]}
              style={{ flexGrow: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item
            label="Sub-category"
            name="type"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select placeholder="Select report subcategory">
              {subCategories.map((type: any) => (
                <Option key={type._id} value={JSON.stringify(type)}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* New Fields */}
          <Form.Item
            label="Data Quality Limitations"
            name="data_quality_limitations"
          >
            <Input.TextArea placeholder="Enter limitations of the dataset" />
          </Form.Item>

          <Form.Item label="Time Coverage" name="time_coverage">
            <Input placeholder="Enter time coverage (e.g., '2020-2023')" />
          </Form.Item>

          <Form.Item label="Update Frequency" name="update_frequency">
            <Input placeholder="Enter update frequency (e.g., 'Annually')" />
          </Form.Item>

          <Form.Item label="Access Restrictions" name="access_restrictions">
            <Input placeholder="Enter access restrictions (if any)" />
          </Form.Item>

          {/* <Form.Item label="Payment Amount" name="payment_amount">
            <Input type="number" placeholder="Enter payment amount" />
          </Form.Item> */}

          <Form.Item label="Licenses/Terms of Use" name="licenses_terms_of_use">
            <Input.TextArea placeholder="Enter licensing or terms of use" />
          </Form.Item>

          <Form.Item label="Contact Information" name="contact_information">
            <Input placeholder="Enter contact information" />
          </Form.Item>

          <Form.Item label="File Formats" name="file_formats_available">
            <Select mode="multiple" placeholder="Select file formats">
              <Option value="CSV">CSV</Option>
              <Option value="Excel">Excel</Option>
              <Option value="JSON">JSON</Option>
            </Select>
          </Form.Item>
          {/* 
          <Form.Item
            label="API Access"
            name="api_access"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item> */}

          <Form.Item
            label="Data Structure Information"
            name="data_structure_information"
          >
            <Input.TextArea placeholder="Enter data structure details" />
          </Form.Item>
        </Form>

        {/* <Form form={form} layout="vertical">
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
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input placeholder="Enter report description" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: "Please select the start date" },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              rules={[
                { required: true, message: "Please select the end date" },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item
            label="Sub-category"
            name="type"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select placeholder="Select report subcategory">
              {subCategories.map((type: any) => (
                <Option key={type._id} value={JSON.stringify(type)}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form> */}
      </Modal>
    </>
  );
}
