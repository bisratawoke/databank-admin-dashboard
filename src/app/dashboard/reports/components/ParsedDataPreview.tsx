/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { Table, Button, Input } from "antd";
// import { EditOutlined, SaveOutlined } from "@ant-design/icons";

// interface ParsedDataPreviewProps {
//   data: any[];
//   mapping: Record<string, string>;
//   onSubmit: (editedData: any[]) => void;
//   isSubmitting: boolean;
// }

// const ParsedDataPreview: React.FC<ParsedDataPreviewProps> = ({
//   data,
//   mapping,
//   onSubmit,
//   isSubmitting,
// }) => {
//   console.log("data recieved: ", data);
//   console.log("Mappings recieved: ", mapping);

//   const [isEditing, setIsEditing] = React.useState<boolean>(false);
//   const [editedData, setEditedData] = React.useState<any[]>(data);

//   const handleEditClick = () => {
//     setIsEditing(!isEditing); // Toggle editing mode
//   };

//   const handleSaveClick = () => {
//     setIsEditing(false); // Disable editing
//     // onSubmit(editedData); // Submit the edited data
//   };

//   const handleInputChange = (
//     value: string,
//     rowIndex: number,
//     columnKey: string
//   ) => {
//     const updatedData = [...editedData]; // Make a copy of the data
//     updatedData[rowIndex] = {
//       ...updatedData[rowIndex],
//       [columnKey]: value,
//     }; // Update the specific cell
//     setEditedData(updatedData); // Update the state with the new data
//   };

//   // Generate the table columns with editable cells when in edit mode
//   const columns = Object.entries(mapping).map(([fileHeader, reportField]) => ({
//     title: fileHeader,
//     dataIndex: fileHeader,
//     key: reportField,
//     render: (_: any, record: any, rowIndex: number) =>
//       isEditing ? (
//         <Input
//           value={editedData[rowIndex][fileHeader]}
//           onChange={(e) =>
//             handleInputChange(e.target.value, rowIndex, fileHeader)
//           }
//         />
//       ) : (
//         record[fileHeader]
//       ),
//   }));
//   console.log("columns: ", columns);
//   return (
//     <div>
//       <h2>Data Preview</h2>
//       <Table
//         dataSource={editedData}
//         columns={columns}
//         rowKey={(record, index: any) => index.toString()}
//       />
//       <div style={{ marginTop: "16px" }}>
//         {!isEditing ? (
//           <Button
//             icon={<EditOutlined />}
//             onClick={handleEditClick}
//             className="mr-2"
//             disabled={isSubmitting}
//           >
//             Edit
//           </Button>
//         ) : (
//           <Button
//             icon={<SaveOutlined />}
//             onClick={handleSaveClick}
//             type="primary"
//             className="mr-2"
//             disabled={isSubmitting}
//           >
//             Save
//           </Button>
//         )}
//         <Button
//           onClick={() => onSubmit(editedData)}
//           type="primary"
//           loading={isSubmitting}
//           disabled={isSubmitting}
//         >
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ParsedDataPreview;

import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

interface ParsedDataPreviewProps {
  data: any[];
  mapping: Record<string, string>;
  onSubmit: (editedData: any[]) => void;
  isSubmitting: boolean;
}

const ParsedDataPreview: React.FC<ParsedDataPreviewProps> = ({
  data,
  mapping,
  onSubmit,
  isSubmitting,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<any[]>(data);
  const [savedData, setSavedData] = useState<any[]>([]);

  useEffect(() => {
    const initialData = data.map((row, index) => ({
      ...row,
      key: index.toString(),
    }));
    setEditedData(initialData);
    setSavedData(initialData);
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setSavedData([...editedData]); // Save the current edits
    setIsEditing(false);
  };

  const handleInputChange = (
    value: string,
    rowIndex: number,
    columnKey: string
  ) => {
    const updatedData = [...editedData];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnKey]: value,
    };
    setEditedData(updatedData);
  };

  const handleSubmit = () => {
    // Use the most recent version of the data (either saved edits or original data)
    const dataToSubmit = isEditing ? editedData : savedData;
    console.log("datatoSubmit", dataToSubmit);
    onSubmit(dataToSubmit);
  };

  const columns = Object.entries(mapping).map(([fileHeader, reportField]) => ({
    title: fileHeader,
    dataIndex: fileHeader,
    key: reportField,
    render: (_: any, record: any, rowIndex: number) =>
      isEditing ? (
        <Input
          value={editedData[rowIndex]?.[fileHeader] || ""}
          onChange={(e) =>
            handleInputChange(e.target.value, rowIndex, fileHeader)
          }
        />
      ) : (
        (savedData[rowIndex]?.[fileHeader] || record[fileHeader])?.toString()
      ),
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Data Preview</h2>
      <Table
        dataSource={isEditing ? editedData : savedData}
        columns={columns}
        rowKey={(record, index) => record.key || index?.toString()}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
      <div className="flex justify-end space-x-2 mt-4">
        {!isEditing ? (
          <Button
            icon={<EditOutlined />}
            onClick={handleEditClick}
            className="mr-2"
            disabled={isSubmitting}
          >
            Edit
          </Button>
        ) : (
          <Button
            icon={<SaveOutlined />}
            onClick={handleSaveClick}
            type="primary"
            className="mr-2"
            disabled={isSubmitting}
          >
            Save
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          type="primary"
          loading={isSubmitting}
          disabled={isSubmitting || isEditing}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ParsedDataPreview;
