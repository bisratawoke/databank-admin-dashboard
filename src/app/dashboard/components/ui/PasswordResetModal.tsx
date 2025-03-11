"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import resetPassword from "@/app/dashboard/actions/resetPassword"; // Import the server action
import { signIn, useSession } from "next-auth/react";

export default function PasswordResetModal() {
  const { data: session, update }: any = useSession();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (values: { newPassword: string }) => {
    setLoading(true);

    try {
      const response = await resetPassword({ newPassword: values.newPassword });

      if (response.status === 201) {
        message.success("Password reset successfully!");
        await signIn("credentials", {
          redirect: false,
          username: session.user.email,
          password: values.newPassword,
        });
        // inside your successful reset logic:
        await update({
          user: {
            ...session.user,
            lastLogin: new Date().toISOString(),
          },
        });
        setIsModalOpen(false); // Close modal on success
      } else {
        message.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Set New Password"
      open={isModalOpen}
      footer={null}
      closable={false}
    >
      <Form layout="vertical" onFinish={handlePasswordSubmit}>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Submit
        </Button>
      </Form>
    </Modal>
  );
}
