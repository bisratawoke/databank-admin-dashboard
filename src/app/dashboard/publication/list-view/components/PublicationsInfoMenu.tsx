/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Dropdown, Menu, Modal, message } from "antd";
import { IoIosCodeDownload } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import deletePublication from "../../actions/deletePublication";

const PublicationInfoMenu = ({
  showInfo,
  downloadFile,
  selectedFile,
  refreshPublications,
}: {
  showInfo: any;
  downloadFile: any;
  selectedFile: any;
  refreshPublications: any;
}) => {
  // Function to show delete confirmation prompt
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this publication?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      cancelText: "No",
      onOk: async () => {
        try {
          await deletePublication({ publicationId: selectedFile._id });
          refreshPublications();
          message.success("Publication deleted successfully!");
        } catch (error) {
          message.error("Failed to delete publication.");
        }
      },
      onCancel() {
        // Optional: handle cancel if needed
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<IoIosCodeDownload />}
        onClick={() => downloadFile()}
      >
        Download
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<IoMdInformationCircleOutline />}
        onClick={() => showInfo()}
      >
        Information
      </Menu.Item>
      <Menu.Item key="3" icon={<FaRegTrashAlt />} onClick={showDeleteConfirm}>
        Move to bin
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["hover"]}>
      <span style={{ cursor: "pointer" }}>
        <HiDotsVertical size={24} />
      </span>
    </Dropdown>
  );
};

export default PublicationInfoMenu;
