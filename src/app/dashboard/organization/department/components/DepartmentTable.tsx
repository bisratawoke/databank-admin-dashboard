/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { category, department } from "../../types";
import { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { CreateDepartment } from "../../actions/createDepartment";

export default function DepartmentTable({
  data,
  categories, // Pass the list of categories as a prop
}: {
  data: department[];
  categories: category[];
}) {
  const [departments, setDepartments] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (categories: category[]) => {
        if (categories && categories.length > 0) {
          return categories.map((category: category) => (
            <Tag key={category.name}>{category.name}</Tag>
          ));
        }
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log("Form values: ", values);
        const { status, body } = await CreateDepartment(values);
        console.log(status);
        console.log(body);

        if (status == 201) {
          const newDepartment = {
            name: body.name,
            category: categories.filter(
              (category: any) => category._id in body.category
            ),
          };
          console.log(newDepartment);
          setDepartments((current) => [...current, newDepartment]);
        }
        // Here you can add code to handle the department creation

        // Close the modal
        setIsModalVisible(false);
        form.resetFields(); // Reset the form fields
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const dataWithButton = [
    ...(departments || []),
    {
      key: "addButtonRow",
      name: <AddButton action={showModal} />,
    },
  ];

  return (
    <>
      <Table
        dataSource={dataWithButton}
        columns={columns}
        rowKey="_id" // Replace with a unique identifier if available
        pagination={false} // Optional: Disable pagination if you want to display all records
      />

      <Modal
        title="Add Department"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Department Name"
            rules={[
              { required: true, message: "Please enter department name" },
            ]}
          >
            <Input placeholder="Enter department name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Categories"
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
            ]}
          >
            <Select
              mode="multiple" // Enable multiple selection
              placeholder="Select categories"
            >
              {categories.map((cat) => (
                <Select.Option key={cat.name} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
