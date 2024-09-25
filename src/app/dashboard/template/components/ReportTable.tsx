"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { reportsWithFields } from "../types"; // Assuming you have this type defined

const { Option } = Select;

export default function ReportTable({
  report: data,
}: {
  report: reportsWithFields;
}) {
  const [reports, setReports] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Function to handle adding a new report
  const handleAddReport = () => {
    setIsModalVisible(true);
  };

  // Function to handle form submission
  const handleFormSubmit = (values: any) => {
    console.log("Submitted values:", values);
    // Add the new report to the state if needed
    // setReports(prev => [...prev, values]);

    // Reset form and close modal
    form.resetFields();
    setIsModalVisible(false);
    message.success("Report added successfully!");
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
    ...(reports.fields?.length > 0 ? reports.fields : []),
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

          {/* Type Field */}
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please enter the type" }]}
          >
            <Input placeholder="Enter report type" />
          </Form.Item>

          {/* Filtered Field */}
          <Form.Item
            label="Filtered"
            name="filtered"
            rules={[
              { required: true, message: "Please select filtered option" },
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
