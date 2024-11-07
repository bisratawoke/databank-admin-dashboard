"use client";
import { useEffect, useState } from "react";

const FileMapping: React.FC<{
  fileHeaders: string[];
  reportFields: { name: string; id: string }[];
  mapping: Record<string, string>; // Pass the auto-mapping here
  onMappingComplete: (mapping: any) => void;
}> = ({ fileHeaders, reportFields, mapping, onMappingComplete }) => {
  useEffect(() => {
    alert("============ in file mapping =================");
  }, []);
  const [currentMapping, setCurrentMapping] = useState(mapping);

  const handleFieldMapping = (header: string, fieldId: string) => {
    setCurrentMapping((prev) => ({ ...prev, [header]: fieldId }));
  };

  const handleComplete = () => {
    onMappingComplete(currentMapping);
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">
        Map File Columns to Report Fields
      </h2>
      <div>
        {fileHeaders.map((header) => (
          <div key={header} className="flex justify-between mb-2">
            <span>{header}</span>
            <select
              value={currentMapping[header] || ""}
              onChange={(e) => handleFieldMapping(header, e.target.value)}
              className="border p-2"
            >
              <option value="">Select Field</option>
              {reportFields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} {/* Show the field's name in the dropdown */}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={handleComplete}
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        Complete Mapping
      </button>
    </div>
  );
};
export default FileMapping;
