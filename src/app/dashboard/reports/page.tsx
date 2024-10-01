"use client";
import React, { useState } from "react";
import { message, Modal, Button } from "antd";
import ReportsTable from "./components/ReportsTable";
import FileUploader from "./components/FileUploader";
import ParsedDataPreview from "./components/ParsedDataPreview";
import { parseCSV } from "./_parsers/csvParser";
import { parseExcel } from "./_parsers/xlsParser";
import FileMapping from "./components/FileMapping";
import { createData } from "./actions/createData";
import { updateReport } from "./actions/updateReport";
import { Data } from "./types";

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
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [reportFields, setReportFields] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [mapping, setMapping] = useState<any>({});
  const [step, setStep] = useState<
    "select" | "upload" | "map" | "preview" | "done"
  >("select");
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleDataCreate = async () => {
    try {
      // Flatten the structured data to a single array with field-value pairs
      const formattedData: any = parsedData
        .map((row: any) => {
          return Object.entries(mapping)
            .map(([fileHeader, reportFieldId]: [any, any]) => {
              const value = row[fileHeader]?.toString().trim() || ""; // Get value and trim whitespace, default to ""
              const fieldId = reportFieldId?.toString().trim(); // Ensure field ID is also a string

              // Validation: Only return if both fieldId and value are valid
              if (fieldId && value) {
                return {
                  field: fieldId,
                  value: value,
                };
              } else {
                // Skip invalid entries (fieldId or value is missing/undefined)
                return null;
              }
            })
            .filter((entry) => entry !== null); // Filter out invalid entries
        })
        .filter((entry) => entry.length > 0); // Filter out empty entries

      console.log("validated formattedData: ", formattedData);

      // Prepare the payload for the backend, wrap formattedData in `dataEntries`
      const payload: any = { dataEntries: formattedData.flat() };
      console.log("payload : ", payload);

      const { result, status } = await createData(payload);
      console.log("result: ", result);
      console.log("status: ", status);

      if (status === 201) {
        console.log("createdData: ", result);
        const dataIds = result.map((data: any) => data._id);
        console.log("dataIds:", dataIds);

        await updateReport(selectedReport, dataIds);
        setStep("done");
        message.success("Report updated successfully");
        reset();
      } else {
        message.error("Failed to create data");
        console.log("error: ", result);
      }
    } catch (error) {
      message.error("Failed to create data or update report");
      console.error(error);
    }
  };

  const reset = () => {
    setStep("select");
    setSelectedReport(null);
    setFileHeaders([]);
    setReportFields([]);
    setParsedData([]);
    setMapping({});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Render the Report Selection Table regardless of modal visibility */}
      <ReportsTable onReportSelect={handleReportSelect} />

      {/* Modal  */}
      <Modal
        title={
          step === "upload"
            ? "Upload File"
            : step === "map"
            ? "Map File Headers"
            : "Preview Parsed Data"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={step === "preview" ? null : undefined}
        width={step === "preview" ? "80%" : undefined} // Increase modal width for preview
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
            onSubmit={handleDataCreate}
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
