/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select, message } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { CreateUser } from "../actions/createUsers";
import { UpdateUser } from "../actions/updateUser";
import deactivateUser from "../actions/deativateUser";
import activateUser from "../actions/activateUser";
import deleteUser from "../actions/deleteUser";
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
  departments: Array<any>;
}

export default function UserTable({
  data,
  roles,
  departments,
}: UserTableProps) {
  console.log("========= in user table =================");
  console.log(data);
  const [users, setUsers] = useState<User[]>(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  const roleFilters = users
    ? [...new Set(users.flatMap((user) => user.roles))].map((role) => ({
        text: role,
        value: role,
      }))
    : [];

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
    {
      title: "Actions",
      key: "actions",
      render: (_, record: User) =>
        record.key !== "addButtonRow" &&
        record.email != "admin@admin.com" && (
          <>
            <>
              {record.isActive == true ? (
                <a
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log("Deactivate user:", record);
                    const { body, status } = await deactivateUser(record._id);
                    if (status == 200)
                      message.success("successfully deactivated user");
                    setUsers((users) =>
                      users.map((user) => {
                        if (user._id == record._id) {
                          return body;
                        }
                        return user;
                      })
                    );
                  }}
                  style={{ marginRight: 8 }}
                >
                  deactivate
                </a>
              ) : (
                <a
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log("activate user:", record);
                    const { body, status } = await activateUser(record._id);
                    if (status == 200)
                      message.success("successfully deactivated user");
                    setUsers((users) =>
                      users.map((user) => {
                        if (user._id == record._id) {
                          return body;
                        }
                        return user;
                      })
                    );
                  }}
                  style={{ marginRight: 8 }}
                >
                  activate
                </a>
              )}
            </>

            <a
              onClick={async (e) => {
                e.stopPropagation();

                await deleteUser(record._id);
                setUsers((users) =>
                  users.filter((user) => user._id != record._id)
                );
                console.log("Delete user:", record);
              }}
              style={{ color: "red" }}
            >
              Delete
            </a>
          </>
        ),
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
              console.log("==== in update modal =======");
              console.log(record.department);
              console.log(
                departments.filter((dep) => dep._id == record.department)
              );
              form.setFieldsValue({
                ...record,
                department: record.department.name,
                // department: departments.filter(
                //   (dep) => dep._id == record.department
                // )[0],
              });

              // form.setFieldsValue({
              //   name: record.name,
              //   category: record.category.map((cat: category) => cat._id),
              // });
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

          {!isEditing && (
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

          <Form.Item name="department" label="Departments">
            <Select placeholder="Select departments">
              {departments.map((department) => (
                <Select.Option key={department._id} value={department._id}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
