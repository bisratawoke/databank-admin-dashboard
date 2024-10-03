/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Tag,
  Select,
} from "antd";
import { createReport } from "../actions/createReport";
import { useRouter } from "next/navigation";
import styles from "../styles/ReportListTable.module.css";

import AddButton from "../../components/ui/AddButton";
import { UpdateSubCategory } from "../../organization/actions/updateSubcategory";
const { Option } = Select;

export default function ReportListTable({
  reports: data,
  subCategories,
}: {
  reports: Array<Record<string, unknown>>;
  subCategories: Array<any>;
}) {
  const router = useRouter();
  const [reports, setReports] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const anVal = { ...values };
        delete values.type;
        const newReport = {
          ...values,
          start_date: values.start_date?.format("YYYY-MM-DD"),
          end_date: values.end_date?.format("YYYY-MM-DD"),
          fields: [],
          data: [],
        };

        try {
          const res: any = await createReport(newReport);

          if (res.status === 201 || res.status === 200) {
            const result = res.body;

            alert(JSON.parse(anVal.type));
            console.log(res.body);
            console.log(JSON.parse(anVal.type));
            const subCat = JSON.parse(anVal.type);

            const { status } = await UpdateSubCategory({
              payload: {
                name: subCat.name,
                report: [
                  ...subCat.report.map((report: any) => report._id),
                  result._id,
                ],
              },
              subCategoryId: subCat._id,
            });

            if (status == 200) {
              message.success("Report added successfully!");

              setReports((prevReports) => [
                ...prevReports,
                { ...result, key: result._id },
              ]);

              form.resetFields();
              setIsModalVisible(false);
            } else {
              alert(status);
              // console.log(body);
            }
          } else {
            message.error("Failed to add the report.");
          }
        } catch (error) {
          console.error("Error creating report:", error);
          message.error("An error occurred while creating the report.");
        }
      })
      .catch((errorInfo) => {
        console.log("Form Validation Failed:", errorInfo);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Fields",
      dataIndex: "fields",
      key: "fields",
      render: (fields: any) => (
        <>
          {fields?.map((field: any) => (
            <Tag color="blue" key={field._id}>
              {field.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
  ];

  const dataWithButton = [
    ...(reports || []),
    {
      key: "addButtonRow",
      name: <AddButton action={showModal} />,
    },
  ];

  return (
    <>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataWithButton}
        bordered
        size="small"
        rowClassName={(record, index) =>
          index % 2 === 0 ? styles.evenRow : styles.oddRow
        }
        onRow={(record) => ({
          onClick: () => {
            if (record.key !== "addButtonRow") {
              router.push(`/dashboard/template/reports/${record._id}`);
            }
          },
        })}
        pagination={false}
      />

      <Modal
        title="Add New Report"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleClose}
        okText="Create Report"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter report name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input placeholder="Enter report description" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: "Please select the start date" },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              rules={[
                { required: true, message: "Please select the end date" },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select placeholder="Select report type">
              {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
              {subCategories.map((type: any) => (
                <Option key={type._id} value={JSON.stringify(type)}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
