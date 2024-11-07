/* eslint-disable @typescript-eslint/no-explicit-any */
import AmIDepartmentHead from "../actions/checkIfIAmDeparmentHead";
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import ApproveReport from "../actions/ApproveReport";
import { message } from "antd";
import RejectReport from "../actions/RejectReport";
import PublishReport from "../actions/PublishReport";
import { useSession } from "next-auth/react";
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
    APPROVED: ["Publish", "Reject"],
    REJECTED: ["Approve"],
    // PUBLISHED: ["Approve"],
  };

  const handler = async (state: string, action: string) => {
    try {
      if (action === "Approve") {
        setCurrentStatus("Approved");
        const result = await ApproveReport({ reportId: report._id });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully approved report");
      } else if (action === "Reject") {
        setCurrentStatus("Rejected");
        const result = await RejectReport({ reportId: report._id });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully rejected  report");
      } else if (action === "Publish") {
        setCurrentStatus("Published");
        const result = await PublishReport({ reportId: report._id });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully Published report");
      }
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    } finally {
      refreshReports();
    }
  };

  const menu = (
    <Menu>
      {availableActions.map((action) => (
        <>
          {action == "Publish" &&
          !session.user.roles.includes("DISSEMINATION_HEAD") ? (
            <></>
          ) : (
            <Menu.Item
              key={action}
              onClick={() => handler(report.status, action)}
            >
              {action.toLowerCase()}
            </Menu.Item>
          )}
        </>
      ))}
    </Menu>
  );

  const HandlerButton = () => {
    return (
      <Dropdown overlay={menu} trigger={["hover"]} placement="bottom">
        <Button type="primary">{currentStatus}</Button>
      </Dropdown>
    );
  };

  return <div>{loading ? <></> : <HandlerButton />}</div>;
}
