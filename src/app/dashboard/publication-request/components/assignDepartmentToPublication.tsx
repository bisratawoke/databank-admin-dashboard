"use client";
import { Form, message, Select } from "antd";
import { useEffect } from "react";
import assignDepartmentToPublicationRequest from "../actions/assignDepartmentToPublicationRequest";

export default function AssignDepartmentToPublication({
  request,
  setRequest,
  departments,
}: any) {
  const [form] = Form.useForm();

  // Handler for Select change event
  const handleDepartmentChange = async (value: string) => {
    console.log("Selected department ID:", value);
    const { body, status } = await assignDepartmentToPublicationRequest({
      requestId: request._id,
      departmentId: value,
    });

    console.log(body);
    if (status == 200) {
      message.success("Successfully assigned department to publication");
      setRequest(body);
    }

    setRequest((request: any) => ({
      ...request,
      status: body.status,
      department: departments.filter((dep: any) => dep._id == value)[0],
    }));
  };

  return (
    <Form form={form} onFinish={(values) => console.log(values)}>
      <Select placeholder="Select department" onChange={handleDepartmentChange}>
        {departments.map((department: any) => (
          <Select.Option key={department._id} value={department._id}>
            {department.name}
          </Select.Option>
        ))}
      </Select>
    </Form>
  );
}
