"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Table, Input, Dropdown, message } from "antd";

import {
  DownloadOutlined,
  SaveOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ReportStatusManager from "../components/ReportStatusManager";
import * as XLSX from "xlsx";
import { prepareDataForExport } from "../_parsers/exportHelper";
import { Data, report } from "../types";
import { updateReport } from "../actions/updateReport";
import { useSession } from "next-auth/react";
import { updateData } from "../actions/updateData";
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

const ReportDetailsPage: React.FC<{ reports: any }> = ({
  reports,
}: {
  reports: any;
}) => {
  const router = useRouter();
  const { reportId } = useParams<{ reportId: string }>();

  const session: any = useSession();
  const [selectedReport, setSelectedReport] = useState<report | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<DataType[]>([]);
  const [originalData, setOriginalData] = useState<DataType[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedData, setSavedData] = useState<DataType[]>([]);

  // Fetch report data by reportId – replace this with your actual API logic.
  // useEffect(() => {
  //   async function fetchReport() {
  //     try {
  //       // const response = await
  //       // const data = await response.json();
  //       setSelectedReport(reports);
  //     } catch (error) {
  //       console.error("Error fetching report:", error);
  //     }
  //   }
  //   if (reportId) fetchReport();
  // }, [reportId]);

  useEffect(() => {
    setSelectedReport(reports);
  }, []);

  const transformData = (data: any[], fields: any[]) => {
    const groupedByRow: { [key: string]: any } = {};
    data.forEach((item) => {
      const fieldName = item.field.name;
      const value = item.value;
      const dataId = item._id;
      let rowIndex = Object.keys(groupedByRow).find((key) => {
        const row = groupedByRow[key];
        return !row.hasOwnProperty(fieldName);
      });
      if (!rowIndex) {
        rowIndex = String(Object.keys(groupedByRow).length);
        groupedByRow[rowIndex] = {};
      }
      groupedByRow[rowIndex][fieldName] = isNaN(value)
        ? value
        : parseFloat(Number(value).toFixed(2));
      groupedByRow[rowIndex][`${fieldName}_id`] = dataId;
    });
    return Object.keys(groupedByRow).map((rowIndex) => {
      const row = groupedByRow[rowIndex];
      const result: any = { key: parseInt(rowIndex) };
      fields.forEach((field) => {
        const fieldName = field.name;
        result[fieldName] = row[fieldName] || "";
        result[`${fieldName}_id`] = row[`${fieldName}_id`] || null;
      });
      return result;
    });
  };

  const getModalColumns = () => {
    if (!selectedReport) return [];
    return selectedReport.fields.map((field: any) => ({
      title: field.name,
      dataIndex: field.name,
      key: field._id,
      render: (value: string, record: any, rowIndex: number) =>
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
    setHasUnsavedChanges(true);
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
    setSavedData([...editedData]);
    setHasUnsavedChanges(false);
  };

  const handleDataUpdate = async (data: any[]) => {
    try {
      const updateResponse = await updateData({
        data: data,
      });
      if (updateResponse.error) {
        throw new Error(updateResponse.error);
      }

      message.success("Report updated successfully");

      setSelectedReport((report: any) => ({
        ...report,
        data: report.data.map((dataItem: any) => {
          const updatedRecord = updateResponse.result.find(
            (record: any) => record._id === dataItem._id
          );
          // If a matching record is found, merge the updated data into the current item
          return updatedRecord ? { ...dataItem, ...updatedRecord } : dataItem;
        }),
      }));
    } catch (error: any) {
      console.error("Error in handleDataCreate:", error);
      message.error(error.message || "Failed to update the report");
    } finally {
      //  setIsSubmitting(false);
    }
  };

  const handleSubmitChanges = async () => {
    if (!selectedReport) return;
    const updatedData = savedData.flatMap((row) => {
      const originalRow = originalData.find((orig) => orig.key === row.key);
      if (!originalRow) return [];
      return Object.entries(row)
        .map(([fieldName, value]) => {
          if (fieldName.endsWith("_id") || fieldName === "key") return null;
          const dataId = row[`${fieldName}_id`];
          if (!dataId) return null;
          if (originalRow[fieldName] !== value) {
            const field = selectedReport.fields.find(
              (f: any) => f.name === fieldName
            );
            if (!field) return null;
            return {
              _id: dataId,
              field: field._id,
              value: value?.toString() || "",
            };
          }
          return null;
        })
        .filter(Boolean);
    });

    try {
      if (updatedData.length > 0) {
        // Call your API or backend function to update the data here
        await handleDataUpdate(updatedData);
        // router.;
        // After the data is updated, update the local state to reflect the changes
        // setOriginalData((prevData) => {
        //   return prevData.map((row) => {
        //     const updatedRow = savedData.find((r) => r.key === row.key);
        //     if (updatedRow) {
        //       return { ...row, ...updatedRow };
        //     }
        //     return row;
        //   });
        // });
        // setSavedData(savedData); // Update saved data with the current changes
      }
    } catch (error) {
      console.error("Failed to update report data:", error);
    } finally {
      setIsEditing(false);
      setHasUnsavedChanges(false);
    }
  };

  // const handleSubmitChanges = async () => {
  //   if (!selectedReport) return;
  //   const updatedData = savedData.flatMap((row) => {
  //     const originalRow = originalData.find((orig) => orig.key === row.key);
  //     if (!originalRow) return [];
  //     return Object.entries(row)
  //       .map(([fieldName, value]) => {
  //         if (fieldName.endsWith("_id") || fieldName === "key") return null;
  //         const dataId = row[`${fieldName}_id`];
  //         if (!dataId) return null;
  //         if (originalRow[fieldName] !== value) {
  //           const field = selectedReport.fields.find(
  //             (f: any) => f.name === fieldName
  //           );
  //           if (!field) return null;
  //           return {
  //             _id: dataId,
  //             field: field._id,
  //             value: value?.toString() || "",
  //           };
  //         }
  //         return null;
  //       })
  //       .filter(Boolean);
  //   });
  //   try {
  //     if (updatedData.length > 0) {
  //       await handleDataUpdate(updatedData);
  //     }
  //   } catch (error) {
  //     console.error("Failed to update report data:", error);
  //   } finally {
  //     setIsEditing(false);
  //     setHasUnsavedChanges(false);
  //   }
  // };

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
    type === "excel" ? exportToExcel(data) : exportToCSV(data);
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

  if (!selectedReport) return <div>Loading...</div>;

  return (
    <div className="p-4">
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
      <div className="flex justify-between mt-4">
        <ReportStatusManager
          report={selectedReport}
          refreshReports={() => {}}
        />
        <div className="flex justify-end">
          {!isEditing ? (
            <>
              {selectedReport.status != "published" &&
                selectedReport.status != "approved" && (
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                )}
              {/* {selectedReport?.status != 'published' && (


              <Button
                icon={<UploadOutlined />}
                onClick={() => router.push(`/reports/${reportId}/upload`)}
                className="mr-2"
              >
                Upload
              </Button>
              )} */}
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
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button icon={<DownloadOutlined />} className="mr-2">
              Export
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
