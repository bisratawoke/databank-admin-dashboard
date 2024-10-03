"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useTransition } from "react";
import { message, Modal } from "antd";
import ReportsTable from "./components/ReportsTable";
import FileUploader from "./components/FileUploader";
import ParsedDataPreview from "./components/ParsedDataPreview";
import { parseCSV } from "./_parsers/csvParser";
import { parseExcel } from "./_parsers/xlsParser";
import FileMapping from "./components/FileMapping";
import { createData } from "./actions/createData";
import { updateReport } from "./actions/updateReport";
import { fetchReports } from "./actions/fetchReports";

const autoMapFields = (
  fileHeaders: string[],
  reportFields: { name: string; id: string }[]
) => {
  console.log("autoMapFields input - fileHeaders:", fileHeaders);
  console.log("autoMapFields input - reportFields:", reportFields);

  const mapping: Record<string, string> = {};

  fileHeaders.forEach((header) => {
    console.log(`Processing header: "${header}"`);
    const match = reportFields.find((field) => {
      const fieldNameLower = field.name.toLowerCase().trim();
      const headerLower = header.toLowerCase().trim();
      console.log(`Comparing: "${fieldNameLower}" with "${headerLower}"`);
      return fieldNameLower === headerLower;
    });

    if (match) {
      mapping[header] = match.id;
      console.log(`Mapped: "${header}" to "${match.id}" (${match.name})`);
    } else {
      console.log(`No match found for: "${header}"`);
    }
  });

  console.log("Final mapping:", mapping);
  return mapping;
};
const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [reportFields, setReportFields] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [mapping, setMapping] = useState<any>({});
  const [step, setStep] = useState<
    "select" | "upload" | "map" | "preview" | "done"
  >("select");
  const [reports, setReports] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

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

  const refreshReports = async () => {
    try {
      const updatedReports = await fetchReports();
      setReports(updatedReports);
    } catch (error) {
      console.error("Failed to refresh reports:", error);
      message.error("Failed to refresh reports list");
    }
  };

  const handleReportSelect = async (record: any) => {
    console.log("reportId: ", record._id);
    setSelectedReport(record._id);

    // Extract both field name and ID for mapping
    const fields = record.fields.map((field: any) => ({
      name: field.name,
      id: field._id, // Get the field's ObjectId
    }));

    setReportFields(fields);
    setStep("upload");
    setIsModalVisible(true);
  };

  const handleFileSelect = async (file: File) => {
    try {
      let headers: any = [];
      let data: any = [];
      if (file.type === "text/csv") {
        ({ headers, data } = await parseCSV(file));
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        ({ headers, data } = await parseExcel(file));
      }
      setFileHeaders(headers);
      setParsedData(data);
      // Automatically map headers to fields
      const autoMappedFields = autoMapFields(headers, reportFields);
      console.log("autoMappedFields: ", autoMappedFields);
      setMapping(autoMappedFields);

      setStep("map"); // Proceed to mapping step in the modal
    } catch (error) {
      message.error("Failed to parse file");
      console.error(error); // Log the error for more information
    }
  };

  const handleMappingComplete = (newMapping: Record<string, string>) => {
    setMapping(newMapping);
    setStep("preview");
  };

  const handleDataCreate = async (reportId: string, data: any[]) => {
    console.log("received data for update case: ", reportId, data);
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Format the parsed data with field-value pairs
      const formattedData = parsedData
        .map((row: any) =>
          Object.entries(mapping)
            .map(([fileHeader, reportFieldId]: [string, unknown]) => {
              const value = row[fileHeader]?.toString().trim() || "";
              const fieldId = reportFieldId?.toString().trim();
              return fieldId && value
                ? {
                    field: fieldId,
                    value,
                  }
                : null;
            })
            .filter(Boolean)
        )
        .filter((entry) => entry.length > 0)
        .flat()
        .filter((element) => element !== null);

      if (formattedData.length === 0) {
        // Update the report directly with the new data IDs
        const updateResponse = await updateReport({
          reportId: selectedReport ? selectedReport : reportId,
          data: data,
        });
        if (updateResponse.error) {
          throw new Error(updateResponse.error);
        }

        message.success("Report updated successfully");

        // Close modal, refresh reports, and reset state
        await refreshReports();
        setIsModalVisible(false);
        reset();
      } else {
        // Create new data entries and associate them with the report
        const response = await createData(reportId, formattedData);
        if (response.error || !response.result) {
          throw new Error(response.error || "Failed to create data entries");
        }

        // No need to update report data separately since it's already handled in createMultiple

        message.success("Report updated successfully with new data entries");

        // Close modal, refresh reports, and reset state
        await refreshReports();
        setIsModalVisible(false);
        reset();
      }
    } catch (error: any) {
      console.error("Error in handleDataCreate:", error);
      message.error(error.message || "Failed to update the report");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleDataCreate = async () => {
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);

  //   try {
  //     // Format the data
  //     const formattedData = parsedData
  //       .map((row: any) =>
  //         Object.entries(mapping)
  //           .map(([fileHeader, reportFieldId]: [string, unknown]) => {
  //             const value = row[fileHeader]?.toString().trim() || "";
  //             const fieldId = reportFieldId?.toString().trim();
  //             return fieldId && value
  //               ? {
  //                   field: fieldId,
  //                   value,
  //                 }
  //               : null;
  //           })
  //           .filter(Boolean)
  //       )
  //       .filter((entry) => entry.length > 0)
  //       .flat()
  //       .filter((element) => element !== null);

  //     const existingData = await fetchReport(selectedReport);
  //     const reportId = existingData?._id || selectedReport; // Safely retrieve reportId
  //     console.log("existingData: ", existingData);
  //     console.log("selectedReport: ", selectedReport);

  //     // Proceed with update or creation
  //     if (existingData?.length > 0) {
  //       const dataIds = existingData.map((data: any) => data._id.toString());
  //       await updateReport({ reportId, dataIds });
  //       message.success("Report updated successfully");
  //     } else {
  //       // Create new data entries
  //       const response = await createData(formattedData);
  //       if (response.error || !response.result) {
  //         throw new Error(response.error || "Failed to create data entries");
  //       }

  //       // Extract the created data IDs
  //       const dataIds = response.result.map((data: any) => data._id);

  //       // Update the report with the new data IDs
  //       const updateResponse = await updateReport({ reportId, dataIds });
  //       if (updateResponse.error) {
  //         throw new Error(updateResponse.error);
  //       }

  //       message.success("Report updated successfully");
  //     }

  //     // Close modal and reset state
  //     await refreshReports();
  //     setIsModalVisible(false);
  //     reset();
  //   } catch (error: any) {
  //     console.error("Error in handleDataCreate:", error);
  //     message.error(error.message || "Failed to format data");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleDataCreate = async () => {
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);

  //   try {
  //     // Format the data
  //     const formattedData = parsedData
  //       .map((row: any) =>
  //         Object.entries(mapping)
  //           .map(([fileHeader, reportFieldId]: [string, unknown]) => {
  //             const value = row[fileHeader]?.toString().trim() || "";
  //             const fieldId = reportFieldId?.toString().trim();
  //             return fieldId && value
  //               ? {
  //                   field: fieldId,
  //                   value,
  //                 }
  //               : null;
  //           })
  //           .filter(Boolean)
  //       )
  //       .filter((entry) => entry.length > 0)
  //       .flat()
  //       .filter((element) => element !== null);

  //     const existingData = await fetchReport(selectedReport);
  //     console.log("existingData: ", existingData);
  //     console.log("selectedReport: ", selectedReport);
  //     let reportId = existingData._id;

  //     if (existingData.length > 0) {
  //       const dataIds = existingData.map((data: any) => data._id.toString());
  //       alert(reportId);
  //       await updateReport({ reportId, dataIds });
  //       message.success("Report updated successfully");
  //       await refreshReports();
  //       setIsModalVisible(false);
  //       reset();
  //     } else {
  //       const response = await createData(formattedData);

  //       if (response.error || !response.result) {
  //         throw new Error(response.error || "Failed to create data entries");
  //       }

  //       // Extract the created data IDs
  //       const dataIds = response.result.map((data: any) => data._id);

  //       reportId = selectedReport;
  //       // Update the report with the new data IDs
  //       const updateResponse = await updateReport({ reportId, dataIds });

  //       if (updateResponse.error) {
  //         throw new Error(updateResponse.error);
  //       }

  //       message.success("Report updated successfully");
  //       await refreshReports();
  //       setIsModalVisible(false);
  //       reset();
  //     }
  //   } catch (error: any) {
  //     console.error("Error in handleDataCreate:", error);
  //     message.error(error.message || "Failed to format data");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleDataCreate = async () => {
  //   if (isSubmitting) return;

  //   setIsSubmitting(true);
  //   try {
  //     // Flatten the structured data to a single array with field-value pairs
  //     const formattedData: any = parsedData
  //       .map((row: any) => {
  //         return Object.entries(mapping)
  //           .map(([fileHeader, reportFieldId]: [any, any]) => {
  //             const value = row[fileHeader]?.toString().trim() || ""; // Get value and trim whitespace, default to ""
  //             const fieldId = reportFieldId?.toString().trim(); // Ensure field ID is also a string

  //             // Validation: Only return if both fieldId and value are valid
  //             if (fieldId && value) {
  //               return {
  //                 field: fieldId,
  //                 value: value,
  //               };
  //             } else {
  //               // Skip invalid entries (fieldId or value is missing/undefined)
  //               return null;
  //             }
  //           })
  //           .filter((entry) => entry !== null); // Filter out invalid entries
  //       })
  //       .filter((entry) => entry.length > 0); // Filter out empty entries

  //     console.log("validated formattedData: ", formattedData);

  //     // Prepare the payload for the backend, wrap formattedData in `dataEntries`
  //     const payload: any = { dataEntries: formattedData.flat() };
  //     console.log("payload : ", payload);

  //     const { result, status } = await createData(payload);
  //     console.log("result: ", result);
  //     console.log("status: ", status);

  //     if (status === 201) {
  //       console.log("createdData: ", result);
  //       const dataIds = result.map((data: any) => data._id);
  //       await updateReport(selectedReport, dataIds);
  //       console.log("dataIds:", dataIds);

  //       message.success("Report updated successfully");
  //       await refreshReports();

  //       setIsModalVisible(false);
  //       reset();
  //     } else {
  //       message.error("Failed to create data");
  //     }
  //   } catch (error) {
  //     console.error("Error creating data:", error);
  //     message.error("Failed to upload data");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleReportUpdate = async (reportId: string, updatedData: any[]) => {
  //   try {
  //     // First create the new data entries
  //     const { result, status } = await createData({ dataEntries: updatedData });

  //     if (status === 201) {
  //       const dataIds = result.map((data: any) => data._id);

  //       // Then update the report with the new data IDs
  //       await updateReport(reportId, dataIds);
  //       message.success("Report updated successfully");

  //       // Close any open modals and reset state if needed
  //       setIsModalVisible(false);
  //       reset();
  //     } else {
  //       message.error("Failed to update data");
  //     }
  //   } catch (error) {
  //     message.error("Failed to update report");
  //     console.error(error);
  //   }
  // };

  const reset = () => {
    setStep("select");
    setSelectedReport(null);
    setFileHeaders([]);
    setReportFields([]);
    setParsedData([]);
    setMapping({});
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    reset();
  };

  return (
    <>
      {/* Render the Report Selection Table regardless of modal visibility */}
      <ReportsTable
        loading={loading}
        onReportSelect={handleReportSelect}
        reports={reports}
        refreshReports={refreshReports}
        onUpdateReport={(props) => {
          alert(props);
          handleDataCreate(props.reportId, props.data);
        }}
      />

      {/* Modal  */}
      <Modal
        title={
          step === "upload"
            ? "Upload File"
            : step === "map"
            ? "Map File Headers"
            : step === "preview"
            ? "Preview Parsed Data"
            : "Update Report"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={step === "preview" ? null : undefined}
        width={step === "preview" ? "80%" : undefined}
        destroyOnClose={true}
      >
        {step === "upload" && <FileUploader onFileSelect={handleFileSelect} />}
        {step === "map" && (
          <FileMapping
            fileHeaders={fileHeaders}
            reportFields={reportFields}
            mapping={mapping}
            onMappingComplete={handleMappingComplete}
          />
        )}
        {step === "preview" && (
          <ParsedDataPreview
            data={parsedData}
            mapping={mapping}
            onSubmit={() => {
              handleDataCreate(selectedReport, parsedData);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* <Button type="primary" onClick={handleUpdateReport}>
        Add data to Report
      </Button> */}
    </>
  );
};

export default Reports;
