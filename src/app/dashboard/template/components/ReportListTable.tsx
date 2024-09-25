"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message } from "antd";
import { createReport } from "../actions/createReport"; // Import the server action
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

export default function ReportListTable({
  reports: data,
}: {
  reports: Array<Record<string, unknown>>;
}) {
  const router = useRouter(); // Initialize the router
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
        const newReport = {
          ...values,
          start_date: values.start_date?.format("YYYY-MM-DD"),
          end_date: values.end_date?.format("YYYY-MM-DD"),
          fields: [],
          data: [],
        };

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const res: any = await createReport(newReport);

          if (res.status === 201 || res.status === 200) {
            message.success("Report added successfully!");

            const result = res.body;
            setReports((prevReports) => [
              ...prevReports,
              { ...result, key: result._id }, // Assuming id is the same as the key here
            ]);

            form.resetFields();
            setIsModalVisible(false);
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

  // Define columns for the table
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
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
  ];

  // Add the Add button row as the last row
  const dataWithButton = [
    ...(reports || []),
    {
      key: "addButtonRow",
      name: (
        <Button type="primary" onClick={showModal}>
          Add
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Render the table */}
      <Table
        columns={columns}
        dataSource={dataWithButton}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              // Navigate to the detail page of the report with the corresponding id
              router.push(`/dashboard/template/reports/${record._id}`);
            }
          },
        })}
      />

      {/* Modal with Form */}
      <Modal
        title="Add New Report"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleClose}
      >
        <Form form={form} layout="vertical">
          {/* Name Field */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter report name" />
          </Form.Item>

          {/* Description Field */}
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input placeholder="Enter report description" />
          </Form.Item>

          {/* Start Date Field */}
          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[
              { required: true, message: "Please select the start date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* End Date Field */}
          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: "Please select the end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
