/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  message,
  Popover,
  Button,
  Space,
  Flex,
  Typography,
} from "antd";
import {
  EditOutlined,
  LogoutOutlined,
  MailOutlined,
  ProductOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import styles from "./user.module.css";

import { FiUser } from "react-icons/fi";

// Custom hook to get user data
const useUser = () => {
  const userString = localStorage.getItem("user");
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
  //   const { logOut } = useContext(AuthContext);
  //   const navigate = useNavigate();
  const {
    firstName,
    lastName,
    fullName,
    email,
    groups,
    organizationalUnitName,
  } = useUser();

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
            <Space>
              <ProductOutlined />
              <Typography.Text>
                {organizationalUnitName ? (
                  <NormalText>{organizationalUnitName}</NormalText>
                ) : (
                  <GrayText>No organizational unit assigned</GrayText>
                )}
              </Typography.Text>
            </Space>
          </Flex>
        </Space>
        <Flex style={{ width: "100%" }} gap="small">
          <Button
            block
            icon={<EditOutlined />}
            // onClick={() => navigate("/auth/change-password")}
          >
            Change password
          </Button>
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={() => {
              //   logOut();
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
      <Avatar className={styles.avatar}>
        {firstName && lastName ? firstName[0] + lastName[0] : "B"}
      </Avatar>
    </Popover>
  );
};

export default User;
