import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Tag, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { fetchReports } from "../actions/fetchReports";
import { report } from "../types";
import * as XLSX from "xlsx";

const ReportsTable: React.FC<{
  onReportSelect: (reportId: string) => void;
}> = ({ onReportSelect }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<report | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    async function getReports() {
      try {
        setLoading(true);
        const data = await fetchReports();
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getReports();
  }, []);

  const showReportDetails = (record: any) => {
    if (record.data && record.data.length > 0) {
      setSelectedReport(record);
      setIsModalVisible(true);
    } else {
      onReportSelect(record);
    }
  };

  const handleExport = (format: "csv" | "excel") => {
    if (!selectedReport) return;

    const data = transformData(selectedReport.data, selectedReport.fields);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    if (format === "csv") {
      XLSX.writeFile(wb, `${selectedReport.name}.csv`);
    } else {
      XLSX.writeFile(wb, `${selectedReport.name}.xlsx`);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      render: (text: any, record: any, index: number) => index + 1,
    },
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
      title: "Date Range",
      key: "dateRange",
      render: (text: any, record: any) => (
        <span>
          {new Date(record.start_date).toLocaleDateString()} -{" "}
          {new Date(record.end_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Fields",
      dataIndex: "fields",
      key: "fields",
      render: (fields: any[]) => (
        <>
          {fields.map((field) => (
            <Tag key={field._id} color="blue">
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
      render: (data: any[]) => (
        <>
          {data.map((item) => (
            <Tag key={item._id} color="green">
              {item.value}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  const transformData = (data: any[], fields: any[]) => {
    const fieldMap = new Map(fields.map((f) => [f._id, f.name]));
    const transformedData: { [key: string]: any }[] = [];

    // Group data by unique combinations
    const groupedData = data.reduce((acc, item) => {
      const fieldName = fieldMap.get(item.field);
      if (!fieldName) return acc;

      // Find an existing group that matches this item
      const existingGroup = acc.find((group: any) =>
        Object.entries(group).every(([key, value]) =>
          key === fieldName ? value === item.value : true
        )
      );

      if (existingGroup) {
        existingGroup[fieldName] = item.value;
      } else {
        acc.push({ [fieldName]: item.value });
      }

      return acc;
    }, [] as { [key: string]: any }[]);

    // Ensure all fields are present in each group
    groupedData.forEach((group: any, index: any) => {
      const completeGroup: { [key: string]: any } = { key: index };
      fields.forEach((field) => {
        completeGroup[field.name] = group[field.name] || "";
      });
      transformedData.push(completeGroup);
    });

    return transformedData;
  };

  const getModalColumns = () => {
    if (!selectedReport) return [];

    return selectedReport.fields.map((field) => ({
      title: field.name,
      dataIndex: field.name,
      key: field.name,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <Table
        loading={loading}
        dataSource={reports}
        columns={columns}
        rowKey="_id"
        onRow={(record) => ({
          onClick: () => showReportDetails(record),
        })}
        className="bg-white rounded-lg overflow-hidden"
        rowClassName="hover:bg-blue-50 transition-colors duration-200"
        pagination={{
          className: "bg-white rounded-b-lg p-4",
        }}
      />

      <Modal
        title={
          <span className="text-lg font-bold text-blue-600">
            Report Details
          </span>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width="80%"
        bodyStyle={{ maxHeight: "70vh", overflow: "auto" }}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalVisible(false)}
            className="mr-2"
          >
            Cancel
          </Button>,
          <Button
            key="export_csv"
            onClick={() => handleExport("csv")}
            icon={<DownloadOutlined />}
            className="bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 mr-2"
          >
            Export as CSV
          </Button>,
          <Button
            key="export_excel"
            onClick={() => handleExport("excel")}
            icon={<DownloadOutlined />}
            className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
          >
            Export as Excel
          </Button>,
        ]}
      >
        {selectedReport && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {selectedReport.name}
            </h3>
            <p className="text-gray-600 mb-2">{selectedReport.description}</p>
            <p className="text-sm text-gray-500">
              Date Range:{" "}
              <span className="font-medium">
                {new Date(selectedReport.start_date).toLocaleDateString()} -{" "}
                {new Date(selectedReport.end_date).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}
        {selectedReport && (
          <Table
            dataSource={transformData(
              selectedReport.data,
              selectedReport.fields
            )}
            columns={getModalColumns()}
            rowKey="key"
            className="bg-white rounded-lg overflow-hidden"
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
            pagination={{
              className: "bg-white rounded-b-lg p-4",
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ReportsTable;
