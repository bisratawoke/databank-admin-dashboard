import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { FetchPublications } from "../actions/fetchPublications";
import PublicationListView from "./components/PublicationsListView";

export default async function Page() {
  const { body } = await FetchPublications({});
  const { body: departments } = await FetchDepartment();
  console.log("=================== fetching departments ===============");
  console.log(departments);
  return <PublicationListView publications={body} departments={departments} />;
}
