import { FetchCategories } from "../../organization/actions/fetchCategories";
import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { FetchPublications } from "../actions/fetchPublications";
import PublicationListView from "./components/PublicationsListView";

export default async function Page() {
  const { body } = await FetchPublications({});
  const { body: departments } = await FetchDepartment();
  // const { body: categories } = await FetchCategories()
  console.log(
    "=================== fetching departments for publications  ==============="
  );
  console.log(departments[0].category);
  return <PublicationListView publications={body} departments={departments} />;
}
