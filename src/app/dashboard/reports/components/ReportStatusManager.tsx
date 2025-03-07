/* eslint-disable @typescript-eslint/no-explicit-any */
import AmIDepartmentHead from "../actions/checkIfIAmDeparmentHead";
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import ApproveReport from "../actions/ApproveReport";
import { message } from "antd";
import RejectReport from "../actions/RejectReport";
import PublishReport from "../actions/PublishReport";
import { useSession } from "next-auth/react";
import InitalRequestResponse from "../actions/initalRequestResponse";
import RequestSecondApproval from "../actions/RequestSecondApproval";
import dissiminationResponse from "../actions/dissiminationDepResponse";
import { capitalizeFirstLetter } from "@/lib/utils/capitalizeFirstLetter";
import DeputyApprove from "../actions/deputyApproval";

export default function ReportStatusManager({ report, refreshReports }: any) {
  const { data: session }: any = useSession();
  const [loading, setIsLoading] = useState(true);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  useEffect(() => {
    AmIDepartmentHead(report._id)
      .then(({ body, status }) => {
        setIsLoading(false);
        setCurrentStatus(report.status.toLowerCase());
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setAvailableActions(logic[currentStatus.toUpperCase()] || []);
  }, [currentStatus]);

  const logic: { [key: string]: string[] } = {
    PENDING: ["Approve", "Reject"],
    APPROVED: ["Deputy approved", "Reject"], // Ensure this is correctly mapped
    "DEPUTY APPROVED": ["Publish", "Reject"],
    REJECTED: ["Approve"],
  };

  const handler = async (state: string, action: string) => {
    try {
      if (action === "Approve") {
        setCurrentStatus("Approved");
        const result = await ApproveReport({ reportId: report._id });
        const initRequestResult = await InitalRequestResponse({
          reportId: report._id,
          status: "Approved",
        });

        const secondApprovalRequestResult = await RequestSecondApproval({
          reportId: report._id,
        });

        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully approved report");
      } else if (action === "Reject") {
        setCurrentStatus("Rejected");
        const result = await RejectReport({ reportId: report._id });
        await InitalRequestResponse({
          reportId: report._id,
          status: "Rejected",
        });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully rejected  report");
      } else if (action === "Publish") {
        setCurrentStatus("Published");
        const result = await PublishReport({ reportId: report._id });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully Published report");
        await dissiminationResponse({
          reportId: report._id,
          status: currentStatus,
        });
      } else if (action === "Deputy approved") {
        setCurrentStatus("Deputy approved");
        const result = await DeputyApprove({ reportId: report._id });
        // const result = await RequestSecondApproval({ reportId: report._id });

        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Successfully marked as Deputy Approved");
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      refreshReports();
    }
  };

  const menu = (
    <Menu>
      {availableActions.map((action) => (
        <>
          {!session.user.roles.includes("DEPARTMENT_EXPERT") && (
            <>
              {action == "Publish" &&
              !session.user.roles.includes("DISSEMINATION_HEAD") ? (
                <></>
              ) : (
                <>
                  {action == "Deputy approved" &&
                  !session.user.roles.includes("DEPUTY_DIRECTOR") ? (
                    <></>
                  ) : (
                    <Menu.Item
                      key={action}
                      onClick={() => handler(report.status, action)}
                    >
                      {capitalizeFirstLetter(action.toLowerCase())}
                    </Menu.Item>
                  )}
                </>
              )}
            </>
          )}
        </>
      ))}
    </Menu>
  );

  const HandlerButton = () => {
    return (
      <Dropdown overlay={menu} trigger={["hover"]} placement="bottom">
        <Button type="primary">{capitalizeFirstLetter(currentStatus)}</Button>
      </Dropdown>
    );
  };

  return <div>{loading ? <></> : <HandlerButton />}</div>;
}
