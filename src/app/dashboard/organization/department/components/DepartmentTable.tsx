/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { category, department } from "../../types";
import { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select, message } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { CreateDepartment } from "../../actions/createDepartment";
import { UpdateDepartment } from "../../actions/updateDepartment";

interface DepartmentTableProps {
  data: department[];
  categories: category[];
}

export default function DepartmentTable({
  data,
  categories,
}: DepartmentTableProps) {
  const [departments, setDepartments] = useState<department[]>(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [currentDeptId, setCurrentDepId] = useState<any>(null);

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
            <Tag key={category._id}>{category.name}</Tag>
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
        const { body, status } = await UpdateDepartment({
          payload: values,
          depId: currentDeptId,
        });

        if (status === 200) {
          const updatedDepartments = departments.map((dept: any) =>
            dept._id === currentDeptId
              ? {
                  ...dept,
                  name: values.name,
                  category: categories.filter((cat) =>
                    values.category.includes(cat._id)
                  ),
                }
              : dept
          );
          setDepartments(updatedDepartments);
          message.success("Department updated successfully!");
        } else {
          message.error("Failed to update department.");
        }
      } else {
        const { status, body } = await CreateDepartment(values);

        if (status === 201) {
          const newDepartment: department | any = {
            _id: body._id,
            name: body.name,
            category: categories.filter((cat) =>
              body.category.includes(cat._id)
            ),
            __v: body.__v,
          };
          setDepartments((current) => [...current, newDepartment]);
          message.success("Department created successfully!");
        } else {
          message.error("Failed to create department.");
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
    ...(departments || []),
    {
      key: "addButtonRow",
      name: <AddButton action={showModal} />,
      category: [], // Empty category for the add button row
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
        bordered // Add borders
        className="custom-table" // Add custom class for extra styling
        onRow={(record: any) => ({
          onClick: (e) => {
            if (record.key !== "addButtonRow") {
              setIsEditing(true);
              setCurrentDepId(record._id);
              form.setFieldsValue({
                name: record.name,
                category: record.category.map((cat: category) => cat._id),
              });
              showModal();
            }
          },
        })}
      />

      <Modal
        title={isEditing ? "Edit Department" : "Add Department"}
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
            <Select mode="multiple" placeholder="Select categories">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
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
