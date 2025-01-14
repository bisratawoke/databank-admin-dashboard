"use client";
import { Form, message, Select } from "antd";
import { useEffect } from "react";
import assignDepartmentToPublicationRequest from "../actions/assignDepartmentToPublicationRequest";
import setFilePath from "../actions/setFilePath";

export default function updateFilePathForm({
  request,
  setRequest,
  publications,
}: any) {
  const [form] = Form.useForm();
  // Handler for Select change event
  const handlePublicationChange = async (value: string) => {
    console.log(request);
    console.log("Selected department ID:", value);
    const { body, status }: any = await setFilePath({
      publicationRequestId: request,
      filePath: value,
    });

    console.log(body);
    if (status == 200) {
      message.success("Successfully assigned department to publication");
      setRequest(body);
    }

    setRequest((request: any) => ({
      ...request,
      fileName: value,
    }));
  };

  useEffect(() => {
    // Perform any setup or side effects if needed
  }, []);

  return (
    <Form form={form} onFinish={(values) => console.log(values)}>
      <Select
        placeholder="Select publication"
        onChange={handlePublicationChange} // Trigger on value change
      >
        {publications.map((publication: any) => (
          <Select.Option key={publication._id} value={publication.fileName}>
            {publication.name}
          </Select.Option>
        ))}
      </Select>
    </Form>
  );
}
