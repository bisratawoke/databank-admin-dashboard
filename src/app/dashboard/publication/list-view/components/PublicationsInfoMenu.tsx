/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Dropdown, Menu } from "antd";
import { IoIosCodeDownload } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const PublicationInfoMenu = ({
  showInfo,
  downloadFile,
}: {
  showInfo: any;
  downloadFile: any;
}) => {
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
      <Menu.Item key="3" icon={<FaRegTrashAlt />}>
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
