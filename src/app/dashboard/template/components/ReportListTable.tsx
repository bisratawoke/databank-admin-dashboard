/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Tag,
  Select,
  Button,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
// import Highlighter from "react-highlight-words";
import { createReport } from "../actions/createReport";
import { useRouter } from "next/navigation";
import styles from "../styles/ReportListTable.module.css";

import AddButton from "../../components/ui/AddButton";
import { UpdateSubCategory } from "../../organization/actions/updateSubcategory";
import RequestInitialApproval from "../actions/requestInitalApproval";
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

  // State and ref for the name column search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<Input | null>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  // Helper function to add search props to a column
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (selectedKeys: React.Key[]) => void;
      selectedKeys: React.Key[];
      confirm: () => void;
      clearFilters: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false,
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(
          () => searchInput.current && searchInput.current.select(),
          100
        );
      }
    },
    render: (text: string) => <span>{text}</span>,
    // searchedColumn === dataIndex ? (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //     searchWords={[searchText]}
    //     autoEscape
    //     textToHighlight={text ? text.toString() : ""}
    //   />
    // ) : (
    //   text
    // ),
  });

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

              await RequestInitialApproval(result._id);

              setReports((prevReports) => [
                ...prevReports,
                { ...result, key: result._id },
              ]);

              form.resetFields();
              setIsModalVisible(false);
            } else {
              // handle error if needed
            }
          } else {
            message.error("Failed to add the report.");
          }
        } catch (error) {
          console.error("Error creating report:", error);
          message.error("An error occurred while creating the report.");
        }
      })
      .catch((errorInfo) => {});
  };

  // Updated columns with filtering for "Name" and "Status"
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (data: any) => (
        <>
          {data?.slice(0, 20).map((item: any) => (
            <Tag color="green" key={item._id}>
              {item.value}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "pending", value: "pending" },
        { text: "approved", value: "approved" },
        { text: "rejected", value: "rejected" },
        { text: "approved", value: "approved" },
        // Add more statuses if needed
      ],
      onFilter: (value: string, record: any) => record.status === value,
      render: (status: string) => (
        <Tag color={status === "pending" ? "orange" : "green"}>{status}</Tag>
      ),
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
          {/* Existing Fields */}
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

          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: "Please select the start date" },
              ]}
              style={{ flexGrow: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              rules={[
                { required: true, message: "Please select the end date" },
              ]}
              style={{ flexGrow: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item
            label="Sub-category"
            name="type"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select placeholder="Select report subcategory">
              {subCategories.map((type: any) => (
                <Option key={type._id} value={JSON.stringify(type)}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* New Fields */}
          <Form.Item
            label="Data Quality Limitations"
            name="data_quality_limitations"
          >
            <Input.TextArea placeholder="Enter limitations of the dataset" />
          </Form.Item>

          <Form.Item label="Time Coverage" name="time_coverage">
            <Input placeholder="Enter time coverage (e.g., '2020-2023')" />
          </Form.Item>

          <Form.Item label="Update Frequency" name="update_frequency">
            <Input placeholder="Enter update frequency (e.g., 'Annually')" />
          </Form.Item>

          <Form.Item label="Access Restrictions" name="access_restrictions">
            <Input placeholder="Enter access restrictions (if any)" />
          </Form.Item>

          <Form.Item label="Licenses/Terms of Use" name="licenses_terms_of_use">
            <Input.TextArea placeholder="Enter licensing or terms of use" />
          </Form.Item>

          <Form.Item label="Contact Information" name="contact_information">
            <Input placeholder="Enter contact information" />
          </Form.Item>

          <Form.Item label="File Formats" name="file_formats_available">
            <Select mode="multiple" placeholder="Select file formats">
              <Option value="CSV">CSV</Option>
              <Option value="Excel">Excel</Option>
              <Option value="JSON">JSON</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Data Provider" name="data_provider">
            <Input.TextArea placeholder="Enter data provider details" />
          </Form.Item>

          <Form.Item
            label="Data Source And Collection"
            name="data_source_and_collection"
          >
            <Input.TextArea placeholder="Enter data source" />
          </Form.Item>
          <Form.Item
            label="Data Geographical Coverage"
            name="data_geo_coverage"
          >
            <Input.TextArea placeholder="Enter Geographical Coverage" />
          </Form.Item>

          <Form.Item
            label="Data Collection Method"
            name="data_collection_method"
          >
            <Input.TextArea placeholder="Enter Collection Method" />
          </Form.Item>

          <Form.Item
            label="Data Processing and Adjustment"
            name="data_processing_adjustment"
          >
            <Input.TextArea placeholder="Enter Processing Adjustment" />
          </Form.Item>

          <Form.Item
            label="Data Structure Information"
            name="data_structure_information"
          >
            <Input.TextArea placeholder="Enter data structure details" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
