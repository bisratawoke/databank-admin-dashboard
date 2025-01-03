export const dynamic = "force-dynamic";
export const revalidate = 0;

import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { getPublicationRequest } from "../actions/getPublicationRequest";
import PublicationRequestView from "../components/publicationRequestView";
import { FetchPublications } from "@/app/dashboard/publication/actions/fetchPublications";
export default async function Page({ params }: { params: any }) {
  const { request_id } = params;
  const result = await getPublicationRequest({ path: request_id });

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

  return (
    <PublicationRequestView
      request={request}
      departments={departments}
      publications={publications}
    />
  );
}
