/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Table, Modal, Form, Input, DatePicker, message, Tag } from "antd";
import { createReport } from "../actions/createReport";
import { useRouter } from "next/navigation";
import styles from "../styles/ReportListTable.module.css"; // CSS module for custom styles

import AddButton from "../../components/ui/AddButton";

export default function ReportListTable({
  reports: data,
}: {
  reports: Array<Record<string, unknown>>;
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
            message.success("Report added successfully!");

            const result = res.body;
            setReports((prevReports) => [
              ...prevReports,
              { ...result, key: result._id },
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
        pagination={{ pageSize: 5 }} // Add pagination with 5 records per page
        bordered // Add borders around the table
        size="middle" // Set the table size
        rowClassName={(record, index) =>
          index % 2 === 0 ? styles.evenRow : styles.oddRow
        } // Add custom row styling
        onRow={(record) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              router.push(`/dashboard/template/reports/${record._id}`);
            }
          },
        })}
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

          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[
              { required: true, message: "Please select the start date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

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
