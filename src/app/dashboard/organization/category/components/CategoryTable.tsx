/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { category, subcategory } from "../../types";
import { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { CreateCategory } from "../../actions/createCategory";

export default function CategoryTable({
  data,
  subcategories, // Pass the list of categories as a prop
}: {
  data: category[];
  subcategories: subcategory[];
}) {
  const [category, setCategory] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (subcategory: subcategory[]) => {
        if (subcategory && subcategory.length > 0) {
          return subcategory.map((category: subcategory) => (
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
        const { body, status } = await CreateCategory(values);
        console.log(body);
        console.log(status);
        if (status == 201) {
          const newCategory = {
            ...body,
            subcategory: subcategories.filter((subcategory) =>
              body.subcategory.includes(subcategory._id)
            ),
          };
          setCategory((prev) => [...prev, newCategory]);
        }

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
    ...(category || []),
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
        title="Add Category"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="subcategory"
            label="Sub Category"
            rules={[
              {
                required: true,
                message: "Please select at least one subcategory",
              },
            ]}
          >
            <Select
              mode="multiple" // Enable multiple selection
              placeholder="Select categories"
            >
              {subcategories.map((subcat) => (
                <Select.Option key={subcat.name} value={subcat._id}>
                  {subcat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
