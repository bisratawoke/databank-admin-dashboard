import { Form, Modal, Input, Button, Tag, message } from "antd";
import { useState } from "react";
import SetPublicationRequestPriceAction from "../actions/setPublicationRequestPrice";

export default function SetPublicationRequestPrice({
  request,
  setRequest,
}: {
  request: any;
  setRequest: any;
}) {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [form] = Form.useForm(); // Form instance

  const handleTogglePaymentRequired = () => {
    const updatedRequest = {
      ...request,
      paymentRequired: !request.paymentRequired,
    };
    setRequest(updatedRequest);

    // If paymentRequired is true, show modal
    if (!updatedRequest.paymentRequired) {
      setIsModalVisible(false); // Hide modal when toggled back to false
    } else {
      setIsModalVisible(true); // Show modal when toggled to true
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
    // Update the request with the submitted price
    const updatedRequest = { ...request, price: values.price };
    setRequest(updatedRequest);

    setIsModalVisible(false); // Close modal after submission
  };

  return (
    <div>
      {/* Payment Required Toggle */}
      <div className="flex justify-between items-center">
        <span className="font-semibold">Payment Required:</span>
        <Tag
          color={request.paymentRequired ? "red" : "green"}
          onClick={handleTogglePaymentRequired} // Toggle payment status
          className="cursor-pointer"
        >
          {request.paymentRequired ? "Yes" : "No"}
        </Tag>
      </div>

      {/* Modal for Price Form */}
      <Modal
        title="Enter Price"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)} // Close modal without saving
        footer={null}
      >
        <Form form={form} onFinish={handleSubmitPrice}>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Price
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
