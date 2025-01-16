export const dynamic = "force-dynamic";
export const revalidate = 0;

import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { getPublicationRequest } from "../actions/getPublicationRequest";
import PublicationRequestView from "../components/publicationRequestView";
import { FetchPublications } from "@/app/dashboard/publication/actions/fetchPublications";
import fetchChat from "../../actions/fetchChat";
import { getSession } from "@/lib/auth/auth";
export default async function Page({ params }: { params: any }) {
  const { request_id } = params;
  const result = await getPublicationRequest({ path: request_id });

  const session = await getSession();

  const request = result.body;
  let departments = null;

  if (!request) {
    throw new Error("No publication request found");
  }

  if (
    !Object.keys(request).includes("department") ||
    request.department == null
  ) {
    const { body } = await FetchDepartment();
    departments = body;
  }

  const { body: publications } = await FetchPublications({ path: "" });

  const { body: chat } = await fetchChat({ subjectId: request_id });

  console.log("============== in publication request managment =============");
  console.log(chat);

  return (
    <PublicationRequestView
      request={request}
      departments={departments}
      publications={publications}
      chat={chat}
    />
  );
}
