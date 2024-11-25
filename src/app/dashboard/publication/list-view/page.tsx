import { FetchCategories } from "../../organization/actions/fetchCategories";
import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { FetchPublications } from "../actions/fetchPublications";
import PublicationListView from "./components/PublicationsListView";

export default async function Page() {
  const { body } = await FetchPublications({});
  const { body: departments } = await FetchDepartment();

  return <PublicationListView publications={body} departments={departments} />;
}
