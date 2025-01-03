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

    setRequest({
      ...request,
      department: departments.filter((dep: any) => dep._id == value),
    });
  };

  useEffect(() => {
    // Perform any setup or side effects if needed
  }, []);

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
