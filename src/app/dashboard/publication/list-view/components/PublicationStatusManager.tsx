/* eslint-disable @typescript-eslint/no-explicit-any */
import AmIDepartmentHead from "../../actions/checkIfIAmDepartmentHead";
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import ApproveReport from "../../actions/approvePublication";
import { message } from "antd";
import RejectReport from "../../actions/rejectPublication";
import PublishReport from "../../actions/publishPublication";
import { useSession } from "next-auth/react";
import InitalRequestResponse from "../../actions/initalRequestResponse";
import RequestSecondApproval from "../../actions/requestSecondApproval";
import dissiminationResponse from "../../actions/dissiminationDepResponse";
// import { capitalizeFirstLetter } from "@/lib/utils/capitalizeFirstLetter";
export function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PublicationStatusManager({
  publication,
  refreshReports,
}: any) {
  const { data: session }: any = useSession();
  const [loading, setIsLoading] = useState(true);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  useEffect(() => {
    AmIDepartmentHead(publication._id)
      .then(({ body, status }) => {
        setIsLoading(false);
        setCurrentStatus(publication.status.toLowerCase());
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
  };

  const handler = async (state: string, action: string) => {
    try {
      if (action === "Approve") {
        setCurrentStatus("Approved");
        const result = await ApproveReport({ reportId: publication._id });
        const initRequestResult = await InitalRequestResponse({
          reportId: publication._id,
          status: "Approved",
        });

        const secondApprovalRequestResult = await RequestSecondApproval({
          reportId: publication._id,
        });

        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully approved publication");
      } else if (action === "Reject") {
        setCurrentStatus("Rejected");
        const result = await RejectReport({ reportId: publication._id });
        await InitalRequestResponse({
          reportId: publication._id,
          status: "Rejected",
        });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully rejected  publication");
      } else if (action === "Publish") {
        setCurrentStatus("Published");
        const result = await PublishReport({ reportId: publication._id });
        if (!(result.status == 200)) throw new Error("Something went wrong");
        message.info("Succesfully Published publication");
        await dissiminationResponse({
          reportId: publication._id,
          status: currentStatus,
        });
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      //   refreshReports();
    }
  };

  const menu = (
    <Menu>
      {availableActions.map((action) => (
        <>
          {!session.user.roles.includes("DEPARTMENT_EXPERT") && (
            <>
              {action == "Approve" &&
              !session.user.roles.includes("DEPARTMENT_HEAD") ? (
                <></>
              ) : (
                <>
                  {action == "Publish" &&
                  !session.user.roles.includes("DISSEMINATION_HEAD") ? (
                    <></>
                  ) : (
                    <Menu.Item
                      key={action}
                      onClick={() => handler(publication.status, action)}
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
