/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { message } from "antd";
import { useSession } from "next-auth/react";
import InitalApproval from "../actions/initalApproval";
import SecondaryApproval from "../actions/secondaryApproval";
import VerifyPublicationRequestPayment from "../actions/verifyPublicationRequestPayment";
export function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PublicationRequestStatusManager({
  publication,
  setPublicationRequest,
}: any) {
  const { data: session }: any = useSession();
  const [loading, setIsLoading] = useState(true);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  useEffect(() => {
    console.log(
      "=========== in publication request status manager ================="
    );
    console.log(session.user.roles);
    setCurrentStatus(publication.status.toLowerCase());
  }, []);

  useEffect(() => {
    setAvailableActions(logic[currentStatus.toUpperCase()] || []);
  }, [currentStatus]);

  const logic: { [key: string]: string[] } = {
    "PENDING DEPARTMENT ASSIGNMENT": ["Pending Approval"],
    "PENDING APPROVAL": ["Initial Approval", "Reject"],
    "INITIAL APPROVAL": ["Deputy Approval", "Reject"],
    "PAYMENT PENDING": ["Payment verified"],
    PENDING: ["Approve", "Reject"],
    APPROVED: ["Publish", "Reject"],
    REJECTED: ["Approve"],
  };

  const handler = async (state: string, action: string) => {
    try {
      if (action === "Payment verified") {
        console.log(
          "============ in payment verification component ================="
        );
        const { body, status }: any = await VerifyPublicationRequestPayment({
          publicationRequestId: publication._id,
        });
        console.log(body);
        message.success("Successfully verified publication request payment");
        setPublicationRequest(body);
        // setCurrentStatus(body.status.toLowerCase());
      }
      if (action == "Deputy Approval") {
        const { body, status }: any = await SecondaryApproval({
          publicationRequestId: publication._id,
        });
        message.success("Successfully made seconday approval");
        setPublicationRequest(body);
        setCurrentStatus(body.status.toLowerCase());
      }
      if (action == "Initial Approval") {
        const { body, status }: any = await InitalApproval({
          publicationRequestId: publication._id,
        });
        message.success("Successfully made initial approval");
        setPublicationRequest(body);
        setCurrentStatus(body.status.toLowerCase());
      }
      if (action === "Approve") {
        setCurrentStatus("Approved");

        // const result = await ApproveReport({ reportId: publication._id });
        // const initRequestResult = await InitalRequestResponse({
        //   reportId: publication._id,
        //   status: "Approved",
        // });

        // console.log(initRequestResult);
        // const secondApprovalRequestResult = await RequestSecondApproval({
        //   reportId: publication._id,
        // });
        // console.log("=========== second approval request resultl ==========");
        // console.log(secondApprovalRequestResult);
        // if (!(result.status == 200)) throw new Error("Something went wrong");
        // message.info("Succesfully approved publication");
      } else if (action === "Reject") {
        setCurrentStatus("Rejected");
        setPublicationRequest((state: any) => ({
          ...state,
          status: "Rejected",
        }));
        // const result = await RejectReport({ reportId: publication._id });
        // await InitalRequestResponse({
        //   reportId: publication._id,
        //   status: "Rejected",
        // });
        // if (!(result.status == 200)) throw new Error("Something went wrong");
        // message.info("Succesfully rejected  publication");
      } else if (action === "Publish") {
        setCurrentStatus("Published");
        // const result = await PublishReport({ reportId: publication._id });
        // if (!(result.status == 200)) throw new Error("Something went wrong");
        // message.info("Succesfully Published publication");
        // await dissiminationResponse({
        //   reportId: publication._id,
        //   status: currentStatus,
        // });
      }
    } catch (err) {
      console.log("============ in update errpr ===============");
      console.log(err);
      message.error("Something went wrong");
    } finally {
      //   refreshReports();
    }
  };

  const menu = (
    <Menu>
      {availableActions.map((action) => (
        <>
          {action == "Initial Approval" &&
          !session.user.roles.includes("DEPARTMENT_HEAD") ? (
            <></>
          ) : (
            <>
              {action == "Deputy Approval" &&
              !session.user.roles.includes("DEPUTY_DIRECTOR") ? (
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

  return <HandlerButton />;
}
