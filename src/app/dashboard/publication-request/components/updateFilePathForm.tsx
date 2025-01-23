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
  const handlePublicationChange = async (value: string) => {
    const { body, status }: any = await setFilePath({
      publicationRequestId: request._id,
      filePath: value,
    });

    if (status == 200) {
      message.success("Successfully assigned publication to request");

      setRequest((request: any) => ({
        ...request,
        fileName: value,
      }));
    }
  };

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
