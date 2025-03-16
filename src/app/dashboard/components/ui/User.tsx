/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Avatar,
  message,
  Popover,
  Button,
  Space,
  Flex,
  Typography,
  Skeleton,
} from "antd";
import {
  EditOutlined,
  LogoutOutlined,
  MailOutlined,
  ProductOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { signOut, useSession } from "next-auth/react";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import PasswordResetModal from "./PasswordResetModal";

const useUser = () => {
  const { data: session }: any = useSession();

  let userString = null;
  if (session) {
    userString = JSON.stringify({
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      fullName: `${session.user.firstName}-${session.user.lastName}`,
      email: session.user.email,
      groups: session.user.roles,
    });
  }
  let firstName = "";
  let lastName = "";
  let fullName = "";
  let email = "";
  let groups = [];
  let organizationalUnitName = "";

  if (userString) {
    try {
      const user = JSON.parse(userString);
      firstName = user.firstName;
      lastName = user.lastName;
      fullName = user.fullName;
      email = user.email;
      groups = user.groups;
      organizationalUnitName = user.organizationalUnitName;
    } catch (error) {
      console.error("Invalid user data in localStorage: ", error);
    }
  }

  return {
    firstName,
    lastName,
    fullName,
    email,
    groups,
    organizationalUnitName,
  };
};

const NormalText = ({ children }: { children: any }) => (
  <Typography.Text>{children}</Typography.Text>
);
const GrayText = ({ children }: { children: any }) => (
  <Typography.Text type="secondary">{children}</Typography.Text>
);

const User: React.FC = () => {
  const { firstName, lastName, fullName, email, groups } = useUser();
  const [showModal, setShowModal] = useState(false);

  const content = (
    <Flex vertical>
      <Space direction="vertical">
        <Space>
          <FiUser style={{ fontSize: "48px", color: "#444" }} />
          <Flex vertical>
            <Typography.Title level={4} style={{ margin: "0" }}>
              {fullName}
            </Typography.Title>
            <Space>
              <MailOutlined />
              <NormalText>{email}</NormalText>
            </Space>
            <Space>
              <TeamOutlined />
              {groups?.length > 0 ? (
                <NormalText>{groups.join(", ")}</NormalText>
              ) : (
                <GrayText>No roles assigned</GrayText>
              )}
            </Space>
          </Flex>
        </Space>
        <Flex style={{ width: "100%" }} gap="small">
          <Button
            block
            icon={<EditOutlined />}
            onClick={() => setShowModal(true)}
          >
            Change password
            {showModal && <PasswordResetModal />}
          </Button>
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={() => {
              signOut();
              message.success("Logout successful");
            }}
          >
            Log out
          </Button>
        </Flex>
      </Space>
    </Flex>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      placement="bottomRight"
    >
      <Avatar className="bg-[#078148] hover:cursor-pointer">
        {firstName && lastName ? firstName[0] + lastName[0] : "B"}
      </Avatar>
    </Popover>
  );
};

export default User;
