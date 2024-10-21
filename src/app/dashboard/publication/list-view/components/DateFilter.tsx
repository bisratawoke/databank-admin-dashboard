/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

interface FileData {
  name: string;
  lastModified: string;
  etag: string;
  size: number;
}

interface DateFilterProps {
  data: FileData[];
  onFilter: (filteredData: FileData[]) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ data, onFilter }) => {
  const handleDateChange: any = (
    dates: [moment.Moment | null, moment.Moment | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].startOf("day").toISOString();
      const endDate = dates[1].endOf("day").toISOString();

      const filteredData = data.filter((file) => {
        if (!file.lastModified) return false;

        const lastModifiedDate = new Date(file.lastModified).toISOString();
        return lastModifiedDate >= startDate && lastModifiedDate <= endDate;
      });

      onFilter(filteredData);
    } else {
      onFilter(data);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <RangePicker onChange={handleDateChange} format="YYYY-MM-DD" />
    </div>
  );
};

export default DateFilter;
