"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Upload,
  Input,
  DatePicker,
  InputNumber,
  message,
  Select,
  Spin,
  Space,
  Switch,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import {
  fetchBuckets,
  fetchLocations,
  uploadPublication,
} from "../actions/publications";
import { InternalBreadcrumbItem } from "antd/es/breadcrumb/BreadcrumbItem";
import { FetchDepartment } from "@/app/dashboard/organization/actions/fetchDepartment";
interface UploadFormValues {
  title: string;
  description: string;
  keyword: string[];
  type: string;
  bucketName: string;
  location: string;
  modified_date: string;
  created_date: string;
  publicationType: string;
  department: string;
  category: string;
  price: string;
}

enum PUBLICATION_TYPE {
  PUBLIC,
  INTERNAL,
  FOR_SALE,
}

interface PublicationUploadProps {
  currentPath: string;
  departments: Array<Record<string, any>>;
  onUploadSuccess?: () => void;
}

const PublicationUpload: React.FC<PublicationUploadProps> = ({
  currentPath,
  onUploadSuccess,
  departments,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverImageList, setCoverImageList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [buckets, setBuckets] = useState<string[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [customLocation, setCustomLocation] = useState(false);

  const [publicationType, setPublicationType] = useState<any>(null);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [categories, setCategories] = useState(
    departments.flatMap((department) => department.category)
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedBuckets, fetchedLocations] = await Promise.all([
          fetchBuckets(),
          fetchLocations(),
        ]);
        setBuckets(fetchedBuckets);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("Failed to load bucket and location lists");
      } finally {
        setLoadingBuckets(false);
        setLoadingLocations(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Set initial values for location and bucket
    form.setFieldsValue({
      location: currentPath,
    });
  }, [currentPath, form]);

  const handleLocationChange = (value: string) => {
    if (value === "custom") {
      setCustomLocation(true);
      form.setFieldsValue({ location: "" });
    } else {
      setCustomLocation(false);
      form.setFieldsValue({ location: value });
    }
  };

  const onFinish = async (values: UploadFormValues) => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload");
      return;
    }

    const file = fileList[0] as RcFile;
    if (!file) {
      message.error("Invalid file object");
      return;
    }

    // if (coverImageList.length === 0) {
    //   message.error("Please select a file to upload");
    //   return;
    // }

    const coverImage = coverImageList[0] as RcFile;
    // if (!coverImage) {
    //   message.error("Invalid file object");
    //   return;
    // }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      coverImage && formData.append("coverImage", coverImage);
      // formData.append("publicationType", values.publicationType[0]);
      formData.append("department", values.department[0]);
      formData.append("category", values.category[0]);
      formData.append("publicationType", values.publicationType);
      formData.append("paymentRequired", `${paymentRequired}`);
      formData.append("price", values.price ? values.price : "0");

      delete values.publicationType;
      delete values.department;
      delete values.category;
      delete values.publicationType;
      delete values.price;
      delete values.paymentRequired;

      const metadata = {
        ...values,
        fileName: file.name,
        size: file.size,
        type: file.type || values.type,
        bucketName: values.bucketName,
        keyword: values.keyword.filter((k) => k.trim() !== ""),

        modified_date: dayjs(values.modified_date).toISOString(),
        created_date: dayjs(values.created_date).toISOString(),
      };

      Object.entries(metadata).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Serialize arrays
        } else {
          formData.append(key, value as string); // Add all other fields
        }
      });

      // formData.append("department", "67237bbb2b5c915bcefc61c5");

      const result = await uploadPublication(formData);

      if (result.success) {
        message.success("File uploaded successfully");
        form.resetFields();
        setFileList([]);
        onUploadSuccess?.(); // Call the callback on success
      } else {
        console.error("Upload error:", result.error);
        message.error(result.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const beforeCoverImageUpload = (file: UploadFile) => {
    setCoverImageList([file]);
    form.setFieldsValue({ type: file.type });
    return false;
  };

  const beforeUpload = (file: UploadFile) => {
    setFileList([file]);

    // Auto-fill the type field with file's MIME type
    form.setFieldsValue({ type: file.type });

    return false; // Prevent automatic upload
  };

  // const beforeUpload = (file: File) => {
  //   const isValidType = [
  //     "application/pdf",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     "application/csv",
  //   ].includes(file.type);
  //   const isValidSize = file.size / 1024 / 1024 < 10; // 10MB limit

  //   if (!isValidType) {
  //     message.error("You can only upload PDF, DOCX, or XLSX files!");
  //   }
  //   if (!isValidSize) {
  //     message.error("File must be smaller than 10MB!");
  //   }

  //   return isValidType && isValidSize;
  // };

  const onCoverImageRemove = () => {
    setCoverImageList([]);
    form.setFieldValue("type", "");
  };
  const onRemove = () => {
    setFileList([]);
    form.setFieldValue("type", "");
  };

  return (
    <div className="rounded-lg shadow-lg max-w-md mx-auto">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          modified_date: dayjs(),
          created_date: dayjs(),
          location: currentPath,
        }}
        className="space-y-4"
      >
        <Form.Item label="File">
          <Upload
            beforeUpload={beforeUpload}
            onRemove={onRemove}
            fileList={fileList}
            maxCount={1}
            className="w-full"
          >
            <Button icon={<UploadOutlined />} disabled={fileList.length > 0}>
              Select File
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter file title" className="w-full" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter file description"
            className="w-full"
          />
        </Form.Item>

        <Form.Item name="department" label="Department">
          <Select
            mode="multiple"
            placeholder="Select departments"
            onChange={(dep) => {
              if (dep.length > 0) {
                setCategories(
                  departments.flatMap((department) =>
                    dep.includes(department._id) ? department.category : []
                  )
                );

                // setCategories((categories) =>
                //   departments.flatMap(
                //     (department) =>
                //       dep.includes(department._id) && department.category
                //   )
                // );
              } else {
                setCategories(
                  departments.flatMap((department) => department.category)
                );
              }
            }}
          >
            {departments.map((dep) => (
              <Select.Option key={dep._id} value={dep._id}>
                {dep.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Select mode="multiple" placeholder="Select categories">
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="publicationType"
          label="Publication Type"
          rules={[
            {
              required: true,
              message: "Please enter at least one publication type",
            },
          ]}
        >
          <Select
            // mode="tags"
            style={{ width: "100%" }}
            placeholder="Please Select the publication type"
            tokenSeparators={[","]}
            onChange={(value) => {
              form.setFieldValue("publicationType", value);
              setPublicationType(value);
            }}
            className="w-full"
            options={[
              {
                label: "Public",
                value: "PUBLIC",
              },
              {
                label: "Internal",
                value: "INTERNAL",
              },
            ]}
          />
        </Form.Item>
        {/* {form.getFieldValue("publicationType")} */}
        {publicationType == "PUBLIC" && (
          <>
            <Form.Item label="Cover Image">
              <Upload
                beforeUpload={beforeCoverImageUpload}
                onRemove={onCoverImageRemove}
                fileList={coverImageList}
                maxCount={1}
                className="w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  // disabled={fileList.length > 0}
                >
                  Select File
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="paymentRequired"
              label="Payment Required"
              valuePropName="Payment Required"
            >
              <Switch onChange={(value) => setPaymentRequired(value)} />
            </Form.Item>

            {paymentRequired && (
              <Form.Item
                name="price"
                label="Publication Price"
                rules={[
                  {
                    required: false,
                    message: "Please enter a publication Price",
                  },
                ]}
              >
                <Input
                  placeholder="Enter publciation price"
                  className="w-full"
                />
              </Form.Item>
            )}
          </>
        )}

        <Form.Item
          name="keyword"
          label="Keywords"
          rules={[
            { required: true, message: "Please enter at least one keyword" },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter keywords and press enter"
            tokenSeparators={[","]}
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="bucketName"
          label="Bucket"
          rules={[{ required: true, message: "Please select a bucket" }]}
        >
          <Select
            loading={loadingBuckets}
            placeholder="Select a bucket"
            notFoundContent={loadingBuckets ? <Spin size="small" /> : null}
            className="w-full"
          >
            {buckets.map((bucket: any) => (
              <Select.Option key={bucket.name} value={bucket.name}>
                {bucket.name} (Created:{" "}
                {dayjs(bucket.creationDate).format("YYYY-MM-DD")})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="File Type"
          rules={[{ required: true, message: "Please specify the file type" }]}
        >
          <Input placeholder="e.g., application/pdf" className="w-full" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Storage Location"
          rules={[
            { required: true, message: "Please specify the storage location" },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Select
              style={{ width: customLocation ? "30%" : "100%" }}
              loading={loadingLocations}
              placeholder="Select a location"
              onChange={handleLocationChange}
              value={customLocation ? "custom" : form.getFieldValue("location")}
              className="w-full"
            >
              <Select.Option value="custom">
                Enter custom location
              </Select.Option>
              {locations.map((location) => (
                <Select.Option key={location} value={location}>
                  {location}
                </Select.Option>
              ))}
            </Select>
            {customLocation && (
              <Input
                style={{ width: "70%" }}
                placeholder="Enter custom location"
                onChange={(e) =>
                  form.setFieldsValue({ location: e.target.value })
                }
                className="w-full"
              />
            )}
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="modified_date"
          label="Last Modified Date"
          rules={[
            { required: true, message: "Please select the last modified date" },
          ]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="created_date"
          label="Creation Date"
          rules={[
            { required: true, message: "Please select the creation date" },
          ]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={uploading}
            disabled={fileList.length === 0}
            style={{ width: "100%" }}
            className="w-full"
          >
            Upload Publication
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PublicationUpload;
