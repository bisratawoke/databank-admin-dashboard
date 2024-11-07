/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Dropdown, Input, Modal, Table, Tag } from "antd";
import {
  DownloadOutlined,
  SaveOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Data, fields, report } from "../types";
import * as XLSX from "xlsx";
import { prepareDataForExport } from "../_parsers/exportHelper";
import ReportStatusManager from "./ReportStatusManager";

interface ReportsTableProps {
  loading: boolean;
  onReportSelect: (record: any) => void;
  onUpdateReport?: ({
    reportId,
    data,
  }: {
    dataId?: string;
    reportId?: string;
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedData, setSavedData] = useState<DataType[]>([]);

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
      title: "Status",
      dataIndex: "status",
      key: "status",
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
          value: item?.value?.slice(0, 4),
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
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<UploadOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click
              showReportDetails(record, true);
            }}
            size="small"
          >
            Upload
          </Button>
        </div>
      ),
    },
  ];

  // const showReportDetails = (record: report) => {
  //   if (record.data && record.data.length > 0) {
  //     setSelectedReport(record);
  //     setIsModalVisible(true);
  //     setIsEditing(false);
  //     setEditedData([]);
  //   } else {
  //     onReportSelect(record);
  //   }
  // };
  const showReportDetails = (record: report, isUpload: boolean = false) => {
    if (isUpload) {
      onReportSelect(record); // This will trigger the upload flow
    } else if (record.data && record.data.length > 0) {
      setSelectedReport(record);

      setIsModalVisible(true);
      setIsEditing(false);
      setEditedData([]);
    } else {
      onReportSelect(record);
    }
  };

  const handleEditClick = () => {
    if (!selectedReport) return;
    setIsEditing(true);
    const transformed = transformData(
      selectedReport.data,
      selectedReport.fields
    );
    setEditedData(transformed);
    setOriginalData(transformed);
    setSavedData(transformed);
    setHasUnsavedChanges(false);
  };

  const handleSaveLocally = () => {
    console.log("edditedData: ", editedData);
    setSavedData([...editedData]);
    setHasUnsavedChanges(false);
  };

  const handleSubmitChanges = async () => {
    if (!selectedReport || !onUpdateReport) return;

    const updatedData = savedData.flatMap((row) => {
      const originalRow = originalData.find((orig) => orig.key === row.key);
      if (!originalRow) return [];

      return Object.entries(row)
        .map(([fieldName, value]) => {
          // Skip if this is an ID field or the key field
          if (fieldName.endsWith("_id") || fieldName === "key") return null;

          // Get the specific data ID for this field
          const dataId = row[`${fieldName}_id`];
          if (!dataId) return null;

          // Only include if the value has changed
          if (originalRow[fieldName] !== value) {
            const field = selectedReport.fields.find(
              (f) => f.name === fieldName
            );
            if (!field) return null;

            return {
              _id: dataId, // Use the specific data ID for this field
              field: field._id,
              value: value?.toString() || "",
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null entries
    });

    try {
      if (updatedData.length > 0) {
        await onUpdateReport({
          data: updatedData,
        });
        await refreshReports();
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to update report data:", error);
    } finally {
      setIsEditing(false);
      setHasUnsavedChanges(false);
    }
  };

  const handleInputChange = (
    value: string,
    rowIndex: number,
    fieldName: string
  ) => {
    const updatedData = [...editedData];

    // Preserve all existing data including IDs when updating
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [fieldName]: value,
    };

    setEditedData(updatedData);
    setHasUnsavedChanges(true);
  };

  const transformData = (data: any[], fields: any[]) => {
    // Create an object to store the grouped data
    const groupedByRow: { [key: string]: any } = {};

    // First pass: group data by row number based on field patterns
    data.forEach((item) => {
      const fieldName = item.field.name;
      const value = item.value;
      const dataId = item._id;

      // Find which row this item belongs to
      let rowIndex = Object.keys(groupedByRow).find((key) => {
        const row = groupedByRow[key];
        // Check if this row is incomplete (missing this field)
        return !row.hasOwnProperty(fieldName);
      });

      // If no existing row is found, create a new one
      if (!rowIndex) {
        rowIndex = String(Object.keys(groupedByRow).length);
        groupedByRow[rowIndex] = {};
      }

      // Store both the value and the data ID for this field
      groupedByRow[rowIndex][fieldName] = value;
      groupedByRow[rowIndex][`${fieldName}_id`] = dataId; // Store the ID with a field-specific key
    });

    // Convert the grouped data into an array format
    const transformedData = Object.keys(groupedByRow).map((rowIndex) => {
      const row = groupedByRow[rowIndex];
      const result: any = { key: parseInt(rowIndex) };

      // Add all fields and their IDs to the row
      fields.forEach((field) => {
        const fieldName = field.name;
        result[fieldName] = row[fieldName] || "";
        result[`${fieldName}_id`] = row[`${fieldName}_id`] || null;
      });

      return result;
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
    const cleanedData = prepareDataForExport(data);
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${selectedReport?.name}.xlsx`);
  };

  const exportToCSV = (data: any[]) => {
    const cleanedData = prepareDataForExport(data);
    const headers = Object.keys(cleanedData[0]);
    const csvContent = [
      headers.join(","),
      ...cleanedData.map((row) =>
        headers
          .map((header) => {
            const value = row[header]?.toString() || "";
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
    <div>
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
          <div className="flex justify-between items-center ">
            <span className="text-lg font-bold text-blue-600">
              Report Details
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setEditedData([]);
          setSavedData([]);
          setHasUnsavedChanges(false);
          setSelectedReport(null);
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
            {selectedReport && selectedReport.data?.length > 0 && (
              <div className="flex justify-between">
                <ReportStatusManager
                  report={selectedReport}
                  refreshReports={refreshReports}
                />
                {/* <div>{selectedReport.status}</div> */}
                <div className="flex justify-end">
                  {!isEditing ? (
                    <>
                      <Button
                        icon={<EditOutlined />}
                        onClick={handleEditClick}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        icon={<UploadOutlined />}
                        onClick={() => showReportDetails(selectedReport, true)}
                        className="mr-2"
                      >
                        Upload
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        icon={<SaveOutlined />}
                        onClick={handleSaveLocally}
                        className="mr-2"
                        disabled={!hasUnsavedChanges}
                      >
                        Save
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleSubmitChanges}
                        className="mr-2"
                        disabled={hasUnsavedChanges}
                      >
                        Submit
                      </Button>
                    </>
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
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default ReportsTable;
