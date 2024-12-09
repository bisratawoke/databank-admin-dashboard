"use client";

import { Card, Tag, List, Modal, Input, Button, Form } from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles
import PublicationRequestStatusManager from "./publicationRequestStatusManager";
import { useState } from "react";
import AssignDepartmentToPublication from "./assignDepartmentToPublication";
import SetPublicationPrice from "./setPublicationRequestPrice";

export default function PublicationRequestView({
  request: data,
  departments: departmentInit,
}: any) {
  const [request, setRequest] = useState(data);
  const [departments, setDepartments] = useState(departmentInit);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card
        title={`Request ID: ${request._id}`}
        bordered
        className="w-full max-w-2xl shadow-lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Status:</span>
            <Tag
              color={
                request.status === "Pending department assignment"
                  ? "orange"
                  : "green"
              }
            >
              {request.status}
            </Tag>
          </div>

          <SetPublicationPrice request={request} setRequest={setRequest} />

          {/* Preferred Data Format */}
          <div className="flex justify-between items-center">
            <span className="font-semibold">Preferred Data Format:</span>
            <span>{request.preferredDataFormat}</span>
          </div>

          {/* Purpose for Research */}
          <div>
            <span className="font-semibold">Purpose for Research:</span>
            <p className="mt-1">{request.purposeForResearch}</p>
          </div>

          {/* Date Importance */}
          <div>
            <span className="font-semibold">Date Importance:</span>
            <p className="mt-1">{request.dateImportance}</p>
          </div>

          {/* Administrative Units */}
          <div>
            <span className="font-semibold">Administrative Units:</span>
            <p className="mt-1">{request.adminUnits}</p>
          </div>

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div>
              <span className="font-semibold">Attachments:</span>
              <div className="mt-2">
                {request.attachments.map(
                  (attachment: string, index: number) => (
                    <div key={index} className="mb-2">
                      <a
                        href={`http://${attachment}`}
                        download
                        className="text-blue-600 hover:underline"
                      >
                        {`Download Attachment ${index + 1}`}
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-1 mb-5 flex flex-col gap-1">
          <span>Department</span>
          {request.department != null ? (
            <>{request.department.name}</>
          ) : (
            <AssignDepartmentToPublication
              request={request}
              setRequest={setRequest}
              departments={departments}
            />
          )}
        </div>
        <div className="mt-1">
          <PublicationRequestStatusManager
            publication={request}
            setPublicationRequest={setRequest}
          />
        </div>
      </Card>
    </div>
  );
}
