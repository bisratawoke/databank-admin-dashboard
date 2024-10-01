import React from "react";
import { Table, Button } from "antd";

interface ParsedDataPreviewProps {
  data: any[];
  mapping: Record<string, string>;
  onSubmit: () => void;
}

const ParsedDataPreview: React.FC<ParsedDataPreviewProps> = ({
  data,
  mapping,
  onSubmit,
}) => {
  console.log("data recieved: ", data);
  console.log("Mappings recieved: ", mapping);
  const columns = Object.entries(mapping).map(([fileHeader, reportField]) => ({
    title: fileHeader,
    dataIndex: fileHeader,
    key: reportField,
  }));
  console.log("columns: ", columns);
  return (
    <div>
      <h2>Data Preview</h2>
      <Table dataSource={data} columns={columns} />
      <Button onClick={onSubmit} type="primary">
        Add data to Report
      </Button>
    </div>
  );
};

export default ParsedDataPreview;
