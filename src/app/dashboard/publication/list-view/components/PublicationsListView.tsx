/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { publication } from "../../types";
import { FaFolder, FaFile } from "react-icons/fa"; // Importing icons
import Details from "./Details";
import { CiMenuKebab } from "react-icons/ci";
import PublicationInfoMenu from "./PublicationsInfoMenu";
const flattenPublications = (publications: Array<publication>): Array<any> => {
  const flatData: any[] = [];

  const processPublication = (pub: publication, path: string) => {
    const parts = pub.name.split("/");
    let currentPath = path;

    parts.forEach((part, index) => {
      if (index < parts.length - 1) {
        // It's a folder
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        // If the folder doesn't exist in flatData, add it
        if (!flatData.some((item) => item.key === currentPath)) {
          flatData.push({
            key: currentPath,
            name: part,
            isLeaf: false,
            icon: <FaFolder style={{ marginRight: 8 }} />, // Folder icon
            lastModified: "",
            size: "",
            etag: "",
          });
        }
      } else {
        // It's a file
        flatData.push({
          key: pub.name,
          name: part,
          isLeaf: true,
          icon: <FaFile style={{ marginRight: 8 }} />, // File icon
          lastModified: pub.lastModified,
          size: pub.size,
          etag: pub.etag,
        });
      }
    });
  };

  publications.forEach((pub) => {
    processPublication(pub, "");
  });

  return flatData;
};

export default function PublicationListView({
  publications,
}: {
  publications: Array<publication>;
}) {
  const flatData = flattenPublications(publications);

  const [selectedFile, setSelectedFile] = useState<publication | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {record.icon} {text}
        </div>
      ),
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
    },
    {
      title: "Size (bytes)",
      dataIndex: "size",
      key: "size",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "ETag",
      dataIndex: "etag",
      key: "etag",
    },
    {
      dataIndex: "Action",
      render: (_, record) => (
        <PublicationInfoMenu
          showInfo={() => {
            setSelectedFile(record);
            setShowDetail(true);
          }}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "100px",
      }}
    >
      <Table
        dataSource={flatData}
        columns={columns}
        pagination={false}
        style={{ flexGrow: 1 }}
        onRow={() => {
          return {
            style: {
              cursor: "pointer",
            },
            // onClick: (e) => {
            //   e.stopPropagation();
            //   setSelectedFile(record);
            //   setShowDetail(true);
            // },
          };
        }}
      />

      {showDetail && (
        <Details detail={selectedFile} close={() => setShowDetail(false)} />
      )}
    </div>
  );
}
