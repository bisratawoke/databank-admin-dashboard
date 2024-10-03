/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Dropdown, Input, Modal, Table, Tag } from "antd";
import {
  DownloadOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Data, fields, report } from "../types";
import * as XLSX from "xlsx";

interface ReportsTableProps {
  loading: boolean;
  onReportSelect: (record: any) => void;
  onUpdateReport?: ({
    reportId,
    data,
  }: {
    reportId: string;
    data: any[];
  }) => void;
  reports: any[];
  refreshReports: () => Promise<void>;
}

interface DataType extends Data {
  [key: string]: any;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  loading,
  onReportSelect,
  onUpdateReport,
  reports,
  refreshReports,
}) => {
  const [selectedReport, setSelectedReport] = useState<report | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<DataType[]>([]);
  const [originalData, setOriginalData] = useState<DataType[]>([]);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any, index: number) => index + 1,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any) => (
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
      render: (fields: fields[]) => (
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
      render: (data: Data[]) => {
        if (!data || data.length === 0) return null;

        const limitedData = data.slice(0, 4).map((item) => ({
          ...item,
          value: item.value.slice(0, 4),
        }));

        return (
          <>
            {limitedData.map((item, index) => (
              <Tag key={item._id || index} color="green">
                {item.value}
              </Tag>
            ))}
          </>
        );
      },
    },
  ];

  const showReportDetails = (record: report) => {
    if (record.data && record.data.length > 0) {
      setSelectedReport(record);
      setIsModalVisible(true);
      setIsEditing(false);
      setEditedData([]);
    } else {
      onReportSelect(record);
    }
  };

  // const handleEditClick = () => {
  //   if (!selectedReport) return;
  //   setIsEditing(true);
  //   setEditedData(transformData(selectedReport.data, selectedReport.fields));
  // };
  const handleEditClick = () => {
    if (!selectedReport) return;
    setIsEditing(true);
    const transformed = transformData(
      selectedReport.data,
      selectedReport.fields
    );
    setEditedData(transformed);
    setOriginalData(transformed); // Store the original data for comparison
  };

  // const handleSaveClick = async () => {
  //   if (!selectedReport || !onUpdateReport) return;

  //   const updatedData = editedData.flatMap((row) =>
  //     Object.entries(row)
  //       .map(([fieldName, value]) => {
  //         const field = selectedReport.fields.find(
  //           (f: fields) => f.name === fieldName
  //         );
  //         if (!field || fieldName === "key") return null;

  //         return {
  //           _id: field._id,
  //           field: field._id,
  //           value: value?.toString() || "",
  //         };
  //       })
  //       .filter(Boolean)
  //   );

  //   console.log("Selected Report ID:", selectedReport._id); // Add this line for debugging
  //   try {
  //     if (selectedReport && selectedReport._id) {
  //       onUpdateReport({ reportId: selectedReport._id, data: updatedData });
  //     } else {
  //       console.error("selectedReport is undefined or missing _id property");
  //     }
  //     setIsEditing(false);
  //     await refreshReports(); // Use the passed refreshReports function
  //     setIsModalVisible(false); // Close modal after successful update
  //   } catch (error) {
  //     console.error("Failed to update report:", error);
  //   }
  // };

  const handleSaveClick = async () => {
    if (!selectedReport || !onUpdateReport) return;

    // Create an updatedData array only with changed values
    const updatedData = editedData.flatMap((row, rowIndex) => {
      const originalRow = originalData[rowIndex];

      return Object.entries(row)
        .map(([fieldName, value]) => {
          const field = selectedReport.fields.find(
            (f: fields) => f.name === fieldName
          );
          if (!field || fieldName === "key") return null;

          // Check if the value has changed
          if (originalRow[fieldName] !== value) {
            return {
              _id: field._id,
              field: field._id,
              value: value?.toString() || "",
            };
          }
          return null; // Return null if there's no change
        })
        .filter(Boolean); // Filter out null values
    });

    console.log("Selected Report ID:", selectedReport._id); // Debugging
    try {
      if (selectedReport && selectedReport._id) {
        if (updatedData.length > 0) {
          // Only call if there is data to update
          onUpdateReport({
            reportId: selectedReport._id,
            data: updatedData,
          });
          await refreshReports(); // Use the passed refreshReports function
          setIsModalVisible(false); // Close modal after successful update
        }
      } else {
        console.error("selectedReport is undefined or missing _id property");
      }
    } catch (error) {
      console.error("Failed to update report:", error);
    } finally {
      setIsEditing(false);
    }
  };
  const handleInputChange = (
    value: string,
    rowIndex: number,
    fieldName: string
  ) => {
    const updatedData = [...editedData];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [fieldName]: value,
    };
    setEditedData(updatedData);
  };

  const transformData = (data: any[], fields: any[]) => {
    // First, group the data by unique combinations
    const groupedData = data.reduce((groups, item) => {
      const fieldName = item.field.name;
      const value = item.value;

      let group = groups.find((g: object) => !g.hasOwnProperty(fieldName));

      if (!group) {
        group = {};
        groups.push(group);
      }

      group[fieldName] = value;

      return groups;
    }, [] as any[]);

    // Ensure all fields are present in each group
    const fieldNames = fields.map((field) => field.name);
    const transformedData = groupedData.map((group: any, index: number) => {
      const row: any = { key: index };
      fieldNames.forEach((fieldName) => {
        row[fieldName] = group[fieldName] || "";
      });
      return row;
    });

    return transformedData;
  };

  const getModalColumns = () => {
    if (!selectedReport) return [];

    return selectedReport.fields.map((field: any) => ({
      title: field.name,
      dataIndex: field.name,
      key: field._id,
      render: (value: string, record: string, rowIndex: number) =>
        isEditing ? (
          <Input
            value={editedData[rowIndex][field.name]}
            onChange={(e) =>
              handleInputChange(e.target.value, rowIndex, field.name)
            }
          />
        ) : (
          value?.toString() || ""
        ),
    }));
  };

  const exportToExcel = (data: any[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${selectedReport?.name}.xlsx`);
  };

  const exportToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).filter((key) => key !== "key");
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]?.toString() || "";
            // Escape commas and quotes in the value
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedReport?.name}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = (type: "excel" | "csv") => {
    if (!selectedReport) return;

    const data = transformData(selectedReport.data, selectedReport.fields);

    if (type === "excel") {
      exportToExcel(data);
    } else {
      exportToCSV(data);
    }
  };

  const exportMenuItems = [
    {
      key: "excel",
      label: "Export to Excel",
      onClick: () => handleExport("excel"),
    },
    {
      key: "csv",
      label: "Export to CSV",
      onClick: () => handleExport("csv"),
    },
  ];

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
        size="small"
        bordered
        className="bg-white rounded-lg overflow-hidden"
        rowClassName="hover:bg-blue-50 transition-colors duration-200"
        pagination={{
          className: "bg-white rounded-b-lg p-4",
        }}
      />

      <Modal
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">
              Report Details
            </span>
            {selectedReport && selectedReport.data?.length > 0 && (
              <div>
                {!isEditing ? (
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleSaveClick}
                    type="primary"
                    className="mr-2"
                  >
                    Save
                  </Button>
                )}
                <Dropdown
                  menu={{ items: exportMenuItems }}
                  placement="bottomRight"
                >
                  <Button icon={<DownloadOutlined />} className="mr-2">
                    Export
                  </Button>
                </Dropdown>
              </div>
            )}
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setEditedData([]);
          setSelectedReport(null); // Reset selectedReport when closing modal
        }}
        width="80%"
        footer={null}
        destroyOnClose={true}
      >
        {selectedReport && (
          <>
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
            <Table
              dataSource={
                isEditing
                  ? editedData
                  : transformData(selectedReport.data, selectedReport.fields)
              }
              columns={getModalColumns()}
              rowKey="key"
              className="bg-white rounded-lg overflow-hidden"
              rowClassName="hover:bg-blue-50 transition-colors duration-200"
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default ReportsTable;
