/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

  // Get unique department names and category names for the filters
  const departmentNameFilters = [
    ...new Set(departments.map((dept) => dept.name)),
  ].map((name) => ({
    text: name,
    value: name,
  }));

  const categoryFilters = categories.map((category) => ({
    text: category.name,
    value: category._id,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: departmentNameFilters, // Apply filters for department names
      onFilter: (value, record) => record.name == value, // Filtering function for names
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: categoryFilters, // Apply filters for categories
      onFilter: (value, record) =>
        record.category.some((cat: category) => cat._id === value), // Filtering function for categories
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
          const updatedDepartments = departments.map((dept) =>
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
    } catch (error) {}
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
      category: [],
    },
  ];

  return (
    <>
      <Table
        dataSource={dataWithButton}
        columns={columns}
        size={"small"}
        bordered
        rowKey="_id"
        pagination={false}
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

          <Form.Item name="category" label="Categories">
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
    </>
  );
}
