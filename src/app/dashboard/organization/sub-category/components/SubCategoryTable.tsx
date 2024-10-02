/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { subcategory } from "../../types";
import { useState } from "react";
import { Table, Tag, Modal, Form, Input, Select } from "antd";
import AddButton from "@/app/dashboard/components/ui/AddButton";
import { report } from "@/app/dashboard/reports/types";
import { CreateSubCategory } from "../../actions/createSubCategory";

export default function SubCategoryTable({
  data,
  reports, // Pass the list of categories as a prop
}: {
  data: subcategory[];
  reports: report[];
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
      title: "Report",
      dataIndex: "report",
      key: "report",
      render: (report: report[]) => {
        if (report && report.length > 0) {
          return report.map((report: report) => (
            <Tag key={report.name}>{report.name}</Tag>
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
        const { body, status } = await CreateSubCategory(values);
        console.log(reports);
        console.log(body);

        if (status == 201) {
          const newSubcat = {
            ...body,
            report: reports.filter((report: any) =>
              body.report.includes(report._id)
            ),
          };
          console.log(newSubcat);
          setCategory((prev) => [...prev, newSubcat]);
        }

        // const { status, body } = await CreateDepartment(values);
        // console.log(status);
        // console.log(body);

        // if (status == 201) {
        //   const newDepartment = {
        //     name: body.name,
        //     subcategory: subcategories.filter(
        //       (category: any) => category._id in body.category
        //     ),
        //   };
        //   console.log(newDepartment);
        //   setCategory((current) => [...current, newDepartment]);
        // }
        // // Here you can add code to handle the department creation

        // Close the modal
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
        title="Add Sub-Category"
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
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item name="report" label="Report">
            <Select
              mode="multiple" // Enable multiple selection
              placeholder="Select Reports"
            >
              {reports.map((report) => (
                <Select.Option key={report.name} value={report._id}>
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
