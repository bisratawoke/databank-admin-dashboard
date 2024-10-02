/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Tree } from "antd";

// Define TypeScript interfaces for your data structure
interface Report {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  fields: string[];
  data: any[];
  __v: number;
}

interface Subcategory {
  _id: string;
  name: string;
  report: Report[];
  __v: number;
}

interface Category {
  _id: string;
  name: string;
  subcategory: Subcategory[];
  __v: number;
}

interface Department {
  _id: string;
  name: string;
  category: Category[];
  __v: number;
}

interface DataTreeProps {
  data: Department[];
}

const DataTree: React.FC<DataTreeProps> = ({ data }) => {
  // Function to transform the data into a tree structure
  const transformToTreeData = (departments: Department[]) => {
    return departments.map((department) => ({
      title: department.name,
      key: department._id,
      children: department.category.map((category) => ({
        title: category.name,
        key: category._id,
        children: category.subcategory.map((subcategory) => ({
          title: subcategory.name,
          key: subcategory._id,
          children: subcategory.report.map((report) => ({
            title: report.name,
            key: report._id,
            children: [
              {
                title: `Description: ${report.description}`,
                key: `${report._id}-desc`,
              },
              {
                title: `Start Date: ${new Date(
                  report.start_date
                ).toLocaleDateString()}`,
                key: `${report._id}-start`,
              },
              {
                title: `End Date: ${new Date(
                  report.end_date
                ).toLocaleDateString()}`,
                key: `${report._id}-end`,
              },
              {
                title: `Fields: ${report.fields.join(", ")}`,
                key: `${report._id}-fields`,
              },
            ],
          })),
        })),
      })),
    }));
  };

  // Transform the data prop into tree data
  const treeData = transformToTreeData(data);

  return <Tree treeData={treeData} defaultExpandAll selectable={false} />;
};

export default DataTree;
