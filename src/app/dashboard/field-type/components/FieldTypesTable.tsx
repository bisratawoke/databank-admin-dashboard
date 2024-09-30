"use client";
import { Table, Modal, Form, Input, Button, message } from "antd";
import { FieldType } from "../type";
import { useState } from "react";
import AddButton from "../../components/ui/AddButton";
import { createFieldType } from "../actions/createFieldType";

export default function FieldTypesTables({
  fieldTypes: data,
}: {
  fieldTypes: FieldType[];
}) {
  const [fieldTypes, setFieldTypes] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
      title: "Example Value",
      dataIndex: "exampleValue",
      key: "exampleValue",
    },
  ];

  const showModal = () => {
    alert(isEditing);
    if (isEditing == false) form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (isEditing) {
          console.log(selectedRecordId);
          console.log(values);
          setIsEditing(false);
        } else {
          const { body, status } = await createFieldType(values);

          if (status == 201) {
            setFieldTypes([...fieldTypes, body]);
            form.resetFields();
            setIsModalVisible(false);
            message.success("Successfully created new record!");
          } else {
            message.error("Error creating new record");
          }
        }
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const dataWithButton = [
    ...(fieldTypes || []),
    {
      key: "addButtonRow",
      name: (
        <AddButton
          action={() => {
            setIsEditing(false);
            showModal();
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataWithButton}
        pagination={{ pageSize: 10 }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRow={(record: any) => ({
          onClick: (e) => {
            e.stopPropagation();
            if (record.name !== "addButtonRow") {
              form.setFieldsValue({
                ...record,
                description: record.description || "",
                exampleValue: record.exampleValue || "",
              });
              setSelectedRecordId(record._id);
              setIsEditing(true);
              showModal();
            }
          },
        })}
      />

      <Modal
        title="Add Field Type"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Example Value" name="exampleValue">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
