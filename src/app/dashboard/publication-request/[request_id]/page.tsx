export const dynamic = "force-dynamic";
export const revalidate = 0;

import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { getPublicationRequest } from "../actions/getPublicationRequest";
import PublicationRequestView from "../components/publicationRequestView";

export default async function Page({ params }: { params: any }) {
  const { request_id } = params;
  const result = await getPublicationRequest({ path: request_id });

  const request = result.body;
  let departments = null;

  if (!request) {
    throw new Error("No publication request found");
  }

  console.log("================ in get page =================");
  console.log(result);

  if (
    !Object.keys(request).includes("department") ||
    request.department == null
  ) {
    const { body } = await FetchDepartment();
    departments = body;
  }

  return <PublicationRequestView request={request} departments={departments} />;
}
