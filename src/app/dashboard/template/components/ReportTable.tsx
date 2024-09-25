"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { reportsWithFields, fieldType, fields } from "../types"; // Ensure fields type is imported
import { createField } from "../actions/createField";
import { addFieldToReport } from "../actions/addFieldToReport";

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

  // Function to handle adding a new report
  const handleAddReport = () => {
    setIsModalVisible(true);
  };

  // Function to handle form submission
  const handleFormSubmit = async (values: fields) => {
    console.log("Submitted values:", values);

    // Call the createField function
    const { result, status } = await createField(values);

    if (status === 201) {
      // Update the fields state with the new field
      setFields((prevFields) => [...prevFields, result]); // Assuming result contains the new field data
      const { result: addFieldToReportResult, status: addFieldToReportStatus } =
        await addFieldToReport({
          reportId,
          field: result._id,
        });
      console.log(addFieldToReportResult);
      console.log(addFieldToReportStatus);

      if (addFieldToReportStatus == 200) {
        form.resetFields();
        setIsModalVisible(false);
        message.success("Report added successfully!");
      } else {
        message.error("Failed to add report. Please try again.");
      }
      // Reset form and close modal
    } else {
      message.error("Failed to add report. Please try again.");
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Filtered",
      dataIndex: "filtered",
      key: "filtered",
      render: (filtered: boolean) => (filtered ? "Yes" : "No"), // Render Yes/No based on boolean
    },
  ];

  // Add the "Add Row" button as the last row
  const dataWithAddButton = [
    ...(fields?.length > 0 ? fields : []),
    {
      key: "addButtonRow",
      name: (
        <Button type="primary" onClick={handleAddReport}>
          Add Row
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Render the table */}
      <Table
        columns={columns}
        dataSource={dataWithAddButton}
        pagination={false}
        rowKey="key"
      />

      {/* Modal with Form */}
      <Modal
        title="Add New Report"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {/* Name Field */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter report name" />
          </Form.Item>

          {/* Type Field as Select */}
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select placeholder="Select report type">
              {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
              {fieldTypes.map((type: any) => (
                <Option key={type._id} value={type._id}>
                  {type.name}{" "}
                  {/* Assuming each field type has a 'name' property */}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Filtered Field */}
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
