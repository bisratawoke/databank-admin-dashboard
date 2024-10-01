import React, { useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUploader: React.FC<{ onFileSelect: (file: File) => void }> = ({
  onFileSelect,
}) => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = ({ file }) => {
    setFileList([file]);
    onFileSelect(file);
  };

  return (
    <Upload
      onRemove={() => setFileList([])}
      beforeUpload={() => false}
      fileList={fileList}
      onChange={handleUpload}
    >
      <Button icon={<UploadOutlined />}>Upload CSV/Excel</Button>
    </Upload>
  );
};

export default FileUploader;
