/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Table, Breadcrumb, Modal, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { publication } from "../../types";
import { FaFolder, FaFile } from "react-icons/fa";
import Details from "./Details";
import PublicationInfoMenu from "./PublicationsInfoMenu";
import { downloadFile } from "../../utils/downloadFile";
import { FetchPublications } from "../../actions/fetchPublications";
import { RiArrowRightWideFill } from "react-icons/ri";
import PublicationUpload from "../../upload/components/PublicationUpload";
export default function PublicationListView({
  publications: initialPublications,
}: {
  publications: Array<publication>;
}) {
  // State to hold the current list of publications based on the current path
  const [publications, setPublications] =
    useState<Array<publication>>(initialPublications);

  // State to hold the flattened data for the table
  const [files, setFiles] = useState<any[]>([]);

  // State for managing the selected file for details view
  const [selectedFile, setSelectedFile] = useState<publication | null>(null);

  // State to control the visibility of the details modal
  const [showDetail, setShowDetail] = useState(false);

  // State to track the current directory path
  const [currentPath, setCurrentPath] = useState<string>("");

  // State to manage the breadcrumb items
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { title: string; path: string }[]
  >([]);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  /**
   * Effect to flatten publications whenever the publications list or current path changes
   */
  useEffect(() => {
    const flatFiles = flattenPublications(publications, currentPath);
    setFiles(flatFiles);
    updateBreadcrumb(currentPath); // Update breadcrumb based on current path
  }, [publications, currentPath]);

  // /**
  //  * Function to flatten publications based on the current path
  //  * Only immediate folders and files within the current path are included
  //  */
  // const flattenPublications = (
  //   publications: Array<publication>,
  //   currentPath: string
  // ): any[] => {
  //   const flatData: any[] = [];

  //   publications.forEach((pub) => {
  //     const fullPath = pub.name;
  //     let relativePath = "";

  //     // Determine the relative path based on the current path
  //     if (currentPath === "") {
  //       relativePath = fullPath;
  //     } else if (fullPath.startsWith(`${currentPath}/`)) {
  //       relativePath = fullPath.substring(currentPath.length + 1);
  //     } else {
  //       // If the publication is not under the current path, ignore it
  //       return;
  //     }

  //     const parts = relativePath.split("/");

  //     if (parts.length === 1) {
  //       // It's a file directly under the current path
  //       flatData.push({
  //         key: pub.name, // Use the full path as the key
  //         name: parts[0],
  //         isLeaf: true,
  //         icon: <FaFile style={{ marginRight: 8 }} />,
  //         lastModified: pub.lastModified,
  //         size: pub.size,
  //         etag: pub.etag,
  //       });
  //     } else if (parts.length > 1) {
  //       // It's inside a subfolder; only display the first subfolder
  //       const firstSubFolder = parts[0];
  //       const folderPath = currentPath
  //         ? `${currentPath}/${firstSubFolder}`
  //         : firstSubFolder;

  //       if (!flatData.some((item) => item.key === folderPath)) {
  //         flatData.push({
  //           key: folderPath, // Use the full path of the subfolder as the key
  //           name: firstSubFolder,
  //           isLeaf: false,
  //           icon: <FaFolder style={{ marginRight: 8 }} />,
  //           lastModified: "",
  //           size: "",
  //           etag: "",
  //         });
  //       }
  //     }
  //   });

  //   return flatData;
  // };

  /**
   * Function to flatten publications based on the current path
   * Only immediate folders and files within the current path are included
   */
  const flattenPublications = (
    publications: Array<any>, // Adjust type according to your use case
    currentPath: string
  ): any[] => {
    const flatData: any[] = [];

    publications.forEach((pub) => {
      const fullPath = pub.fileName; // Replace pub.name with pub.fileName
      let relativePath = "";

      // Ensure fullPath is defined before proceeding
      if (!fullPath) return;

      // Determine the relative path based on the current path
      if (currentPath === "") {
        relativePath = fullPath;
      } else if (fullPath.startsWith(`${currentPath}/`)) {
        relativePath = fullPath.substring(currentPath.length + 1);
      } else {
        // If the publication is not under the current path, ignore it
        return;
      }

      const parts = relativePath.split("/");

      if (parts.length === 1) {
        // It's a file directly under the current path
        flatData.push({
          key: pub.fileName, // Use the full path as the key
          name: parts[0],
          isLeaf: true,
          icon: <FaFile style={{ marginRight: 8 }} />,
          lastModified: pub.uploadDate, // Adjust this field to match your data
          size: pub.size, // If size is available in your data
          etag: pub.metaStoreId, // If needed, adjust to match your data
        });
      } else if (parts.length > 1) {
        // It's inside a subfolder; only display the first subfolder
        const firstSubFolder = parts[0];
        const folderPath = currentPath
          ? `${currentPath}/${firstSubFolder}`
          : firstSubFolder;

        if (!flatData.some((item) => item.key === folderPath)) {
          flatData.push({
            key: folderPath, // Use the full path of the subfolder as the key
            name: firstSubFolder,
            isLeaf: false,
            icon: <FaFolder style={{ marginRight: 8 }} />,
            lastModified: "",
            size: "",
            etag: "",
          });
        }
      }
    });

    return flatData;
  };

  /**
   * Update breadcrumb based on the current path
   */
  const updateBreadcrumb = (path: string) => {
    const parts = path.split("/").filter(Boolean); // Remove empty segments
    const breadcrumbItems = parts.map((part, index) => ({
      title: part,
      path: `/${parts.slice(0, index + 1).join("/")}`,
    }));
    setBreadcrumbItems(breadcrumbItems);
  };

  /**
   * Handler for row clicks
   * Navigates into a folder by updating the current path and fetching new publications
   */
  const handleRowClick = async (record: any) => {
    if (record.isLeaf) return; // Do nothing if it's a file

    // Construct the new path by appending the clicked folder's name
    const newPath = currentPath ? `${currentPath}/${record.name}` : record.name;

    // Fetch publications for the new path
    const { status, body } = await FetchPublications({
      path: newPath,
    });

    if (status === 200) {
      setPublications(body); // Update publications with the fetched data
      setCurrentPath(newPath); // Update the current path
    } else {
      console.error("Failed to fetch publications for path:", newPath);
      // Optionally, handle errors (e.g., show a notification)
    }
  };

  /**
   * Handler to navigate back to the parent directory
   */
  const handleBack = async () => {
    if (!currentPath) return; // Do nothing if already at root

    // Split the current path and remove the last segment to go up one level
    const pathParts = currentPath.split("/");
    pathParts.pop();
    const newPath = pathParts.join("/");

    // Fetch publications for the new path
    const { status, body } = await FetchPublications({
      path: newPath,
    });

    if (status === 200) {
      setPublications(body); // Update publications with the fetched data
      setCurrentPath(newPath); // Update the current path
    } else {
      console.error("Failed to fetch publications for path:", newPath);
      // Optionally, handle errors (e.g., show a notification)
    }
  };

  /**
   * Define the columns for the Ant Design table
   */
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
      title: "Action",
      dataIndex: "Action",
      render: (_, record) => (
        <PublicationInfoMenu
          downloadFile={() => {
            downloadFile(
              `http://localhost:4000/publications/download/${encodeURIComponent(
                record.key
              )}`,
              record.name
            );
          }}
          showInfo={() => {
            setSelectedFile(record);
            setShowDetail(true);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Breadcrumb
          style={{
            marginBottom: "16px",
            display: "flex",
          }}
          separator={
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <RiArrowRightWideFill />
            </div>
          }
        >
          {breadcrumbItems.map((item) => (
            <Breadcrumb.Item key={item.path}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentPath(item.path.split("/")[1]);
                  handleBack();
                }}
              >
                {item.title}
              </span>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <Button onClick={() => setIsUploadModalVisible(true)}>
          Upload Publication
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <Table
          dataSource={files}
          columns={columns}
          pagination={false}
          style={{ flexGrow: 1 }}
          rowKey="key" // Ensure each row has a unique key
          onRow={(record) => {
            return {
              onClick: () => {
                handleRowClick(record);
              },
              style: {
                cursor: "pointer",
              },
            };
          }}
        />

        {/* Details Modal */}
        {showDetail && (
          <Details detail={selectedFile} close={() => setShowDetail(false)} />
        )}
      </div>
      <Modal
        title="Upload Publication"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
      >
        <PublicationUpload currentPath={currentPath} />
      </Modal>
    </div>
  );
}
