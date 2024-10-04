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
  categories, // Pass the list of categories as a prop
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
        console.log("============ in editing mode =================");
        console.log(values);

        const { body, status } = await UpdateDepartment({
          payload: values,
          depId: currentDeptId,
        });

        if (status === 200) {
          // Find the updated department and replace it in the state
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
          setDepartments(updatedDepartments); // Update the state with the new department data
          message.success("Department updated successfully!");
        } else {
          message.error("Failed to update department.");
        }
      } else {
        console.log("Form values: ", values);
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

      // Close the modal, reset the form, and reset the editing state
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
        size={"small"}
        bordered
        rowKey="_id" // Ensure each department has a unique _id
        pagination={false} // Optional: Disable pagination if you want to display all records
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
            <Select
              mode="multiple" // Enable multiple selection
              placeholder="Select categories"
            >
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
