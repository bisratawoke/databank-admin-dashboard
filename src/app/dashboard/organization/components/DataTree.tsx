/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Tree } from "antd";

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
  const transformToTreeData = (departments: Department[]) => {
    return departments.map((department) => ({
      title: department.name,
      key: department._id,
      children: department.category.map((category) => ({
        title: category.name,
        key: `${department._id}-${category._id}`,
        children: category.subcategory.map((subcategory) => ({
          title: subcategory.name,
          key: `${department._id}-${category._id}-${subcategory._id}`,
          children: subcategory.report.map((report) => ({
            title: report.name,
            key: `${department._id}-${category._id}-${subcategory._id}-${report._id}`,
          })),
        })),
      })),
    }));
  };

  const treeData = transformToTreeData(data);

  return <Tree treeData={treeData} defaultExpandAll selectable={false} />;
};

export default DataTree;
