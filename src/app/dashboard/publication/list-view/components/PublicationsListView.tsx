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
import PublicationUpload from "../../upload/components/PublicationUpload";
import SearchInput from "./SearchInput";
import DateFilter from "./DateFilter";
import Spinner from "@/components/Spinner";
// import FileStructure from "./FileStructure";

export default function PublicationListView({
  publications: initialPublications,
  departments,
}: {
  publications: Array<publication>;
  departments: Array<Record<string, any>>;
}) {
  const [publications, setPublications] =
    useState<Array<publication>>(initialPublications);
  const [files, setFiles] = useState<any[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<publication | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { title: string; path: string }[]
  >([]);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  useEffect(() => {
    const flatFiles = flattenPublications(publications, currentPath);
    setFiles(flatFiles);
    setFilteredFiles(flatFiles);
    updateBreadcrumb(currentPath);
  }, [publications, currentPath]);

  const flattenPublications = (
    publications: Array<any>,
    currentPath: string
  ): any[] => {
    const flatData: any[] = [];

    publications.forEach((pub) => {
      if (pub.metadata) {
        console.log(pub.metadata);
      }
      const fullPath = pub.fileName;
      let relativePath = "";

      if (!fullPath) return;

      if (currentPath === "") {
        relativePath = fullPath;
      } else if (fullPath.startsWith(`${currentPath}/`)) {
        relativePath = fullPath.substring(currentPath.length + 1);
      } else {
        return;
      }

      const parts = relativePath.split("/");

      if (parts.length === 1) {
        flatData.push({
          key: pub.fileName,

          name: parts[0],
          isLeaf: true,
          icon: <FaFile style={{ marginRight: 8 }} />,
          lastModified: pub.uploadDate,
          size: pub.size,
          etag: pub.metaStoreId,
          metadata: pub.metadata,
          permanentLink: pub.permanentLink,
          status: pub.status,
          _id: pub._id,
        });
      } else if (parts.length > 1) {
        const firstSubFolder = parts[0];
        const folderPath = currentPath
          ? `${currentPath}/${firstSubFolder}`
          : firstSubFolder;

        if (!flatData.some((item) => item.key === folderPath)) {
          flatData.push({
            key: folderPath,
            name: firstSubFolder,
            isLeaf: false,
            icon: <FaFolder style={{ marginRight: 8 }} />,
            lastModified: "",
            size: "",
            etag: "",
            metadata: pub.metadata,
          });
        }
      }
    });

    return flatData;
  };

  const updateBreadcrumb = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    const breadcrumbItems = parts.map((part, index) => ({
      title: part,
      path: `/${parts.slice(0, index + 1).join("/")}`,
    }));
    setBreadcrumbItems(breadcrumbItems);
  };

  const handleRowClick = async (record: any) => {
    if (record.isLeaf) return;

    const newPath = currentPath ? `${currentPath}/${record.name}` : record.name;
    const { status, body } = await FetchPublications({ path: newPath });

    if (status === 200) {
      setPublications(body);
      setCurrentPath(newPath);
    } else {
      console.error("Failed to fetch publications for path:", newPath);
    }
  };

  const handleBack = async () => {
    if (!currentPath) return;

    const pathParts = currentPath.split("/");
    pathParts.pop();
    const newPath = pathParts.join("/");

    const { status, body } = await FetchPublications({ path: newPath });

    if (status === 200) {
      setPublications(body);
      setCurrentPath(newPath);
    } else {
      console.error("Failed to fetch publications for path:", newPath);
    }
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = files.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  const handleDateFilter = (filteredData: any[]) => {
    setFilteredFiles(filteredData);
  };

  const refreshPublications = async () => {
    const { status, body } = await FetchPublications({ path: currentPath });
    if (status === 200) {
      setPublications(body);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadModalVisible(false);
    refreshPublications();
  };

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
            downloadFile(`http://${record.permanentLink}`, record.name);
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
    <>
      <div className="flex items-center justify-between">
        <Breadcrumb>
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
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsUploadModalVisible(true)}>
            Add Publication
          </Button>
          <div className="flex items-center">
            <SearchInput onSearch={handleSearch} />
            <DateFilter data={files} onFilter={handleDateFilter} />
          </div>
          <Modal
            title="Upload Publication"
            open={isUploadModalVisible}
            onCancel={() => setIsUploadModalVisible(false)}
            footer={null}
          >
            <PublicationUpload
              currentPath={currentPath}
              onUploadSuccess={handleUploadSuccess}
              departments={departments}
            />
          </Modal>
        </div>
      </div>

      {Array.isArray(files) ? (
        <div>
          <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            {/* <FileStructure
              files={initialPublications}
              handleRowClick={handleRowClick}
            /> */}
            <Table
              dataSource={filteredFiles}
              columns={columns}
              pagination={false}
              style={{ flexGrow: 1 }}
              rowKey="key"
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

            {showDetail && (
              <Details
                detail={selectedFile}
                close={() => setShowDetail(false)}
              />
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
