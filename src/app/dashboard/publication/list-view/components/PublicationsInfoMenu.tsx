"use client";
import React from "react";
import { Dropdown, Menu } from "antd";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosCodeDownload } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";

const PublicationInfoMenu = ({ showInfo }: { showInfo: any }) => {
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<IoIosCodeDownload />}>
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
        <CiMenuKebab size={24} />
      </span>
    </Dropdown>
  );
};

export default PublicationInfoMenu;
