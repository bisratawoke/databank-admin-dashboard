/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

import { Tree } from "antd";

interface FileProps {
  name: string;
  lastModified: string;
  etag: string;
  size: number;
}

interface FileStructureProps {
  files: FileProps[];
  handleRowClick: (record: Record<string, any>) => void;
}

const FileStructure: React.FC<FileStructureProps> = ({
  files,
  handleRowClick,
}) => {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    // Function to build the tree data
    const transformToTreeData = (files: FileProps[]) => {
      const root: { [key: string]: any } = {};

      files.forEach((file) => {
        const parts = file.name.split("/"); // Split the file name by '/'
        let currentLevel = root;

        parts.forEach((part, index) => {
          if (!currentLevel[part]) {
            currentLevel[part] = {
              key: parts.slice(0, index + 1).join("/"),
              title: part,
              children: {},
            };
          }

          // If it's the last part (the file), attach file metadata
          if (index === parts.length - 1) {
            currentLevel[part].title = `${part}`;
            currentLevel[part].fileInfo = file; // Store file info for click handler
            delete currentLevel[part].children; // No children for files
          }

          // Move deeper into the folder structure
          currentLevel = currentLevel[part].children;
        });
      });

      // Convert object structure to array format for Ant Design's Tree
      const convertToTreeArray = (obj: { [key: string]: any }) => {
        return Object.values(obj).map((node) => ({
          ...node,
          children: node.children
            ? convertToTreeArray(node.children)
            : undefined,
        }));
      };

      return convertToTreeArray(root);
    };

    const treeData = transformToTreeData(files);
    setTree(treeData);
  }, []);

  // Handler for selecting a tree item
  const onSelect = (selectedKeys: React.Key[]) => {
    const selectedKey = selectedKeys[0]; // Get the first selected key
    const selectedNode = findNodeByKey(tree, selectedKey);

    // handleRowClick(selectedNode.title);
    // if (selectedNode && selectedNode.fileInfo) {
    //   handleRowClick(selectedNode.fileInfo); // Call the handleRowClick with file info
    // }
  };

  // Helper function to find the node by key
  const findNodeByKey = (nodes: any[], key: React.Key): any | undefined => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  return <Tree treeData={tree} defaultExpandAll onSelect={onSelect} />;
};

export default FileStructure;
