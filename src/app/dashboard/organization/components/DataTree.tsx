/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Tree } from "antd";

const DataTree = ({ data }: any) => {
  // Function to transform the object into a tree structure
  const transformToTreeData = (categories: any) => {
    return categories.map((category: any) => ({
      title: category.name,
      key: category._id,
      children: category.category.map((subcat: any) => ({
        title: subcat.name,
        key: subcat._id,
        children: subcat.subcategory.map((subcategory: any) => ({
          title: subcategory.name,
          key: subcategory._id,
          children: subcategory.report.map((report: any) => ({
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

  // Tree data based on the passed prop
  const treeData = transformToTreeData(data);

  return <Tree treeData={treeData} defaultExpandAll selectable={false} />;
};

export default DataTree;
