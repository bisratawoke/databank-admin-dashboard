/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { subcategory } from "../../types";
import { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select, message } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { report } from "@/app/dashboard/reports/types";
import { CreateSubCategory } from "../../actions/createSubCategory";
import { UpdateSubCategory } from "../../actions/updateSubcategory"; // You need to implement this function similarly to UpdateCategory.

export default function SubCategoryTable({
  data,
  reports, // Pass the list of reports as a prop
}: {
  data: subcategory[];
  reports: report[];
}) {
  const [subcategories, setSubcategories] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track edit mode
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState<any>(null); // To store the subcategory being edited
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Report",
      dataIndex: "report",
      key: "report",
      render: (report: report[]) => {
        if (report && report.length > 0) {
          return report.map((rep: report) => (
            <Tag key={rep._id}>{rep.name}</Tag>
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
        // Update existing subcategory
        const { body, status } = await UpdateSubCategory({
          payload: values,
          subCategoryId: currentSubCategoryId,
        });

        if (status === 200) {
          const updatedSubcategories: any = subcategories.map((subcat) =>
            subcat._id === currentSubCategoryId
              ? {
                  ...subcat,
                  name: values.name,
                  report: reports.filter((rep) =>
                    values.report.includes(rep._id)
                  ),
                }
              : subcat
          );
          setSubcategories(updatedSubcategories);
          message.success("Subcategory updated successfully!");
        } else {
          message.error("Failed to update subcategory.");
        }
      } else {
        // Create new subcategory
        const { status, body } = await CreateSubCategory(values);
        if (status === 201) {
          const newSubcategory: any = {
            _id: body._id,
            name: body.name,
            report: reports.filter((rep) => body.report.includes(rep._id)),
          };
          setSubcategories((prev) => [...prev, newSubcategory]);
          message.success("Subcategory created successfully!");
        } else {
          message.error("Failed to create subcategory.");
        }
      }

      // Close modal and reset form
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
    ...(subcategories || []),
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
        rowKey="_id"
        pagination={false}
        onRow={(record: any) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              setIsEditing(true);
              setCurrentSubCategoryId(record._id);
              form.setFieldsValue({
                name: record.name,
                report: record.report.map((rep: report) => rep._id),
              });
              showModal();
            }
          },
        })}
      />

      <Modal
        title={isEditing ? "Edit Subcategory" : "Add Subcategory"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Subcategory Name"
            rules={[
              { required: true, message: "Please enter subcategory name" },
            ]}
          >
            <Input placeholder="Enter subcategory name" />
          </Form.Item>

          <Form.Item name="report" label="Report">
            <Select mode="multiple" placeholder="Select Reports">
              {reports.map((report) => (
                <Select.Option key={report._id} value={report._id}>
                  {report.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
