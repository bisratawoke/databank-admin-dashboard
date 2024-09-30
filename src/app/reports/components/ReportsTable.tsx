"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Tooltip } from "antd";
import { fetchReports } from "../actions/fetchReports";

const ReportsTable: React.FC<{
  onReportSelect: (reportId: string) => void;
}> = ({ onReportSelect }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getReports() {
      try {
        setLoading(true);
        const data = await fetchReports();
        console.log("data: ", data);
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getReports();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => (
        <Tooltip title={text}>{text.slice(0, 8)}...</Tooltip>
      ),
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
              {item.name}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={reports}
      columns={columns}
      rowKey="_id"
      onRow={(record) => ({
        onClick: () => onReportSelect(record),
      })}
    />
  );
};

export default ReportsTable;
