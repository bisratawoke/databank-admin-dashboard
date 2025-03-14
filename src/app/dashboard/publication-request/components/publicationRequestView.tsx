"use client";

import { Card, Tag, List, Modal, Input, Button, Form } from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles
import PublicationRequestStatusManager from "./publicationRequestStatusManager";
import { useEffect, useState } from "react";
import AssignDepartmentToPublication from "./assignDepartmentToPublication";
import SetPublicationPrice from "./setPublicationRequestPrice";
import Attachment from "./attachement";
import TextAreaContainer from "./textAreaContainer";
import UpdateFilePathForm from "./updateFilePathForm";
import React from "react";
import Spinner from "@/components/Spinner";
import ChatContainer from "../../components/ui/ChatContainer";

export default function PublicationRequestView({
  request: data,
  departments: departmentInit,
  publications,
  chat,
}: any) {
  const [request, setRequest] = useState<any>({});
  const [departments, setDepartments] = useState(departmentInit);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setRequest(data);
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  } else
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4 gap-10">
        <Card title={``} bordered className="w-full max-w-2xl shadow-lg">
          <div className="space-y-4">
            {request.attachments && request.attachments.length > 0 && (
              <div>
                <span className="font-bold text-[16px]">
                  Official letter requesting the data
                </span>
                <div className="mt-2">
                  {request.attachments.map(
                    (attachment: string, index: number) => (
                      <Attachment link={attachment} key={index} />
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[16px]">Data Requester</span>
              <div className="bg-white p-2 rounded border">
                {" "}
                {/* Added styling */}
                <p className="text-[14px] text-[#8A8888]">
                  Full Name: {request.author?.fullName}{" "}
                  {/* Safe navigation in case author is null */}
                </p>
                <p className="text-[14px] text-[#8A8888]">
                  Email: {request.author?.email}
                </p>
                <p className="text-[14px] text-[#8A8888]">
                  Phone Number: {request.author?.phoneNumber}
                </p>
                {/* Add other author fields as needed */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[16px]">Data Specification</span>
              <TextAreaContainer text={request.dataSpecification} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[16px]">Data Importance</span>
              <TextAreaContainer text={request.dateImportance} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-[16px]">
                Purpose for Research
              </span>
              <TextAreaContainer text={request.purposeForResearch} />
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <span className="font-bold text-[16px]">
                Administrative Units
              </span>
              <div className={`flex items-center`}>
                <p className="text-[14px] text-[#8A8888] flex items-center p-1">
                  {request.adminUnits}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <span className="font-bold text-[16px]">
                Preferred data format
              </span>
              <div className={`flex items-center`}>
                <p className="text-[14px] text-[#8A8888] flex items-center p-1">
                  {request.preferredDataFormat}
                </p>
              </div>
            </div>

            {request.department != null ? (
              <div className="mt-1 mb-5 flex flex-col gap-1">
                <div className="flex flex-col gap-2 justify-center">
                  <span className="font-bold text-[16px]">Department</span>
                  <p className="text-[14px] text-[#8A8888] flex items-center p-1">
                    <>{request.department.name}</>
                  </p>
                </div>
              </div>
            ) : (
              <AssignDepartmentToPublication
                request={request}
                setRequest={setRequest}
                departments={departments}
              />
            )}

            <div className="mt-1 mb-5 flex flex-col gap-1">
              <span className="font-bold text-[16px]">Publication</span>
              {request.fileName != null ? (
                <div className="flex flex-col gap-2 justify-center">
                  <div className={`flex items-center`}>
                    <p className="text-[14px] text-[#8A8888] flex items-center p-1">
                      <>{request.fileName}</>
                    </p>
                  </div>
                </div>
              ) : (
                <UpdateFilePathForm
                  request={request}
                  setRequest={setRequest}
                  publications={publications}
                />
              )}
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <span className="font-bold text-[16px]">Status</span>
              <div className={`flex items-center`}>
                <p className="text-[14px] text-[#8A8888] flex items-center p-1">
                  {request.status}
                </p>
              </div>
            </div>

            {request.paymentData && (
              <div className="flex flex-col gap-2 justify-center">
                <span className="font-bold text-[16px]">Price</span>
                <div className={`flex items-center`}>
                  <p className="text-[14px] text-[#8A8888] flex items-center p-1">
                    {request.paymentData.price}
                  </p>
                </div>
              </div>
            )}

            <SetPublicationPrice request={request} setRequest={setRequest} />
          </div>
          <div className="mt-10">
            <PublicationRequestStatusManager
              publication={request}
              setPublicationRequest={setRequest}
            />
          </div>
        </Card>
        <Card className="w-full max-w-2xl shadow-lg">
          <ChatContainer {...chat} />
        </Card>
      </div>
    );
}
