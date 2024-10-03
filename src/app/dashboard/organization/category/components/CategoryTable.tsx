/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { category, subcategory } from "../../types";
import { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select, message } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { CreateCategory } from "../../actions/createCategory";
import { UpdateCategory } from "../../actions/updateCategory";

interface CategoryTableProps {
  data: category[];
  subcategories: subcategory[];
}

export default function CategoryTable({
  data,
  subcategories,
}: CategoryTableProps) {
  const [categories, setCategories] = useState<category[]>(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [currentCategoryId, setCurrentCategoryId] = useState<any>(null);

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
          return subcategory.map((subcat: subcategory) => (
            <Tag key={subcat._id}>{subcat.name}</Tag>
          ));
        }
        return null;
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing) {
        const { body, status } = await UpdateCategory({
          payload: values,
          categoryId: currentCategoryId,
        });

        console.log(status);
        console.log(body);
        if (status === 200) {
          const updatedCategories: any = categories.map((cat) =>
            cat._id === currentCategoryId
              ? {
                  ...cat,
                  name: values.name,
                  subcategory: subcategories.filter((subcat) =>
                    values.subcategory.includes(subcat._id)
                  ),
                }
              : cat
          );
          setCategories(updatedCategories);
          message.success("Category updated successfully!");
        } else {
          message.error("Failed to update category.");
        }
      } else {
        const { status, body } = await CreateCategory(values);

        if (status === 201) {
          const newCategory: any = {
            _id: body._id,
            name: body.name,
            subcategory: subcategories.filter((subcat) =>
              body.subcategory.includes(subcat._id)
            ),
          };
          setCategories((current) => [...current, newCategory]);
          message.success("Category created successfully!");
        } else {
          message.error("Failed to create category.");
        }
      }

      setIsModalVisible(false);
      form.resetFields();
      setIsEditing(false);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsEditing(false);
  };

  const dataWithButton = [
    ...(categories || []),
    {
      key: "addButtonRow",
      name: <AddButton action={showModal} />,
      subcategory: [], // Empty subcategory for the add button row
    },
  ];

  return (
    <>
      <Table
        dataSource={dataWithButton}
        columns={columns}
        rowKey="_id"
        pagination={false}
        size={"small"}
        className="custom-table"
        onRow={(record: any) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              setIsEditing(true);
              setCurrentCategoryId(record._id);
              form.setFieldsValue({
                name: record.name,
                subcategory: record.subcategory.map(
                  (subcat: subcategory) => subcat._id
                ),
              });
              showModal();
            }
          },
        })}
        bordered
      />

      <Modal
        title={isEditing ? "Edit Category" : "Add Category"}
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
            label="Sub Categories"
            rules={[
              {
                required: true,
                message: "Please select at least one subcategory",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Select subcategories">
              {subcategories.map((subcat) => (
                <Select.Option key={subcat._id} value={subcat._id}>
                  {subcat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .custom-table :global(.ant-table-thead > tr > th),
        .custom-table :global(.ant-table-tbody > tr > td) {
          border-color: #cccccc !important; /* Set border color */
        }

        .custom-table :global(.ant-table-row) {
          height: 100px; !important /* Reduce row height for more compact look */
        }

        .custom-table :global(.ant-table-tbody > tr:hover) {
          background-color: #f0f0f0 !important; /* Optional: Add a hover effect */
        }
      `}</style>
    </>
  );
}
