/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select, message } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { CreateUser } from "../actions/createUsers";
import { UpdateUser } from "../actions/updateUser";
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  button?: React.ReactNode;
}

interface UserTableProps {
  data: User[];
  roles: Array<any>;
}

export default function UserTable({ data, roles }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  const roleFilters = [...new Set(users.flatMap((user) => user.roles))].map(
    (role) => ({
      text: role,
      value: role,
    })
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record: User) =>
        record.key == "addButtonRow" ? (
          <>{record.button}</>
        ) : (
          `${record.firstName} ${record.lastName}`
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      filters: roleFilters,
      onFilter: (value, record) => record.roles.includes(value as string),
      render: (roles: string[]) =>
        roles.map((role) => <Tag key={role}>{role}</Tag>),
    },
    {
      title: "Verified",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      render: (isEmailVerified: boolean | string) => (
        <>
          {isEmailVerified == "last" ? (
            ""
          ) : (
            <Tag color={isEmailVerified ? "green" : "red"}>
              {isEmailVerified ? "Yes" : "No"}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean | string) => (
        <>
          {isActive == "last" ? (
            ""
          ) : (
            <Tag color={isActive ? "green" : "red"}>
              {isActive ? "Yes" : "No"}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin: string | null) =>
        lastLogin == "last"
          ? ""
          : lastLogin
          ? new Date(lastLogin).toLocaleString()
          : "N/A",
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        // Update logic here
        const result = await UpdateUser({ data: values, id: currentUserId });
        console.log(result);
        if (result.status == 200) {
          const updatedUsers = users.map((user) =>
            user._id === currentUserId ? { ...user, ...values } : user
          );
          setUsers(updatedUsers);
          message.success("User updated successfully!");
        }
      } else {
        const result = await CreateUser(values);
        console.log(result);
        if (result.status == 201) {
          setUsers((users) => [...users, result.body]);
          message.success("User added successfully!");
        } else {
          message.error(result.body.message);
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
    ...(users || []),
    {
      key: "addButtonRow",
      firstName: "",
      button: <AddButton action={showModal} />,
      roles: [],
      lastLogin: "last",
      isActive: "last",
      isEmailVerified: "last",
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
        onRow={(record: User) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              setIsEditing(true);
              setCurrentUserId(record._id);
              form.setFieldsValue(record);
              showModal();
            }
          },
        })}
      />

      <Modal
        title={isEditing ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          {!isEditing == true && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input placeholder="Enter password" />
            </Form.Item>
          )}
          <Form.Item name="roles" label="Roles">
            <Select mode="multiple" placeholder="Select roles">
              {roles.map((role) => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 
          <Form.Item name="roles" label="Roles">
            <Select mode="multiple" placeholder="Select roles">
              {roleFilters.map((role) => (
                <Select.Option key={role.value} value={role.value}>
                  {role.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          {/* <Form.Item name="isActive" label="Active">
            <Select>
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
}
