"use client";
import { Form, Modal, Input, Button, Tag, message } from "antd";
import { useEffect, useState } from "react";
import SetPublicationRequestPriceAction from "../actions/setPublicationRequestPrice";
import { useSession } from "next-auth/react";

export default function SetPublicationRequestPrice({
  request,
  setRequest,
}: {
  request: any;
  setRequest: any;
}) {
  const { data: session }: any = useSession();
  useEffect(() => {}, []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleTogglePaymentRequired = () => {
    const updatedRequest = {
      ...request,
      paymentRequired: !request.paymentRequired,
    };
    setRequest(updatedRequest);

    if (!updatedRequest.paymentRequired) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleSubmitPrice = async (values: { price: number }) => {
    console.log("Price submitted:", values.price);

    const { body, status } = await SetPublicationRequestPriceAction({
      publicationRequestId: request._id,
      price: values.price,
    });

    if (status === 200)
      message.success("Successfully set publication request price");

    console.log("=================== in handle submit price =================");
    console.log(status);
    console.log(body);

    const updatedRequest = { ...request, price: values.price };
    setRequest(updatedRequest);

    setIsModalVisible(false);
  };

  if (session.user.roles.includes("FINANCIAL_OFFICER")) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-[16px]">Payment Required</span>
          <div className="flex items-center">
            <Tag
              color={request.paymentRequired ? "red" : "green"}
              onClick={handleTogglePaymentRequired}
              className="cursor-pointer"
            >
              {request.paymentRequired ? "Yes" : "No"}
            </Tag>
          </div>
        </div>

        <Modal
          title="Set Publication Pricing"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmitPrice}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input the price!" }]}
              labelCol={{ span: 24 }} // Makes the label span the full width
              wrapperCol={{ span: 24 }} // Ensures the input spans the full width
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ backgroundColor: "#04AA6D", color: "white" }}
                htmlType="submit"
                // block
              >
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  } else {
    return <></>;
  }
}
