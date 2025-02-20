"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import resetPassword from "@/app/dashboard/actions/resetPassword"; // Import the server action

export default function PasswordResetModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (values: { newPassword: string }) => {
    setLoading(true);

    try {
      const response = await resetPassword({ newPassword: values.newPassword });

      if (response.status === 201) {
        message.success("Password reset successfully!");
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
