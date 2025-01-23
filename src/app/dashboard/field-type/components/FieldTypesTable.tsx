"use client";
import { Table, Modal, Form, Input, Button, message, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FieldType } from "../type";
import { MouseEvent, useState } from "react";
import AddButton from "../../components/ui/AddButton";
import { createFieldType } from "../actions/createFieldType";
import { UpdateFieldType } from "../actions/updateFieldType";
import DeleteButton from "../../components/ui/DeleteButton";
import deleteFieldType from "../actions/deleteFieldType";

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

  const getColumnSearchProps = (dataIndex: keyof FieldType) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: FieldType) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: keyof FieldType
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void, confirm: () => void) => {
    clearFilters();
    confirm();
  };

  const handleDeleteFieldType = async (fieldTypeId: string) => {
    try {
      const { body, status } = await deleteFieldType({ fieldTypeId });

      setFieldTypes((types) => types.filter((type) => type._id != body._id));

      message.success("Successfully deleted field type");
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Example Value",
      dataIndex: "exampleValue",
      key: "exampleValue",
      ...getColumnSearchProps("exampleValue"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (record: Record<string, any>) => {
        return (
          <DeleteButton
            action={async (e) => {
              e.stopPropagation();

              if (selectedRecordId)
                await handleDeleteFieldType(selectedRecordId);
            }}
          />
        );
      },
    },
  ];

  const showModal = () => {
    if (isEditing == false) form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      if (isEditing) {
        setIsEditing(false);
        if (selectedRecordId) {
          const { status, body } = await UpdateFieldType({
            fieldId: selectedRecordId,
            body: values,
          });
          if (status != 200) {
            message.error("Error updating record");
          } else {
            message.success("Record updated successfully");
            setIsModalVisible(false);
            form.resetFields();
            setFieldTypes([
              ...fieldTypes.map((field) =>
                field._id == selectedRecordId ? body : field
              ),
            ]);
          }
        } else message.error("Error creating new record");
      } else {
        const { body, status } = await createFieldType(values);
        if (status == 201) {
          setFieldTypes([...fieldTypes, body]);
          form.resetFields();
          setIsModalVisible(false);
          message.success("Successfully created new record!");
        } else if (
          status == 400 &&
          body.message == "Field type already exists"
        ) {
          message.error(body.message);
        } else {
          message.error("Error creating new record");
        }
      }
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
            form.setFieldsValue({
              name: "",
              description: "",
              exampleValue: "",
            });
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
        pagination={false}
        bordered
        size="small"
        onRow={(record) => ({
          onClick: (e) => {
            e.stopPropagation();
            setSelectedRecordId(record._id);
            if (record.key !== "addButtonRow") {
              showModal();
              setIsEditing(true);
              form.setFieldsValue({
                ...record,
                name: record.name,
                description: record.description || "",
                exampleValue: record.exampleValue || "",
              });
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
