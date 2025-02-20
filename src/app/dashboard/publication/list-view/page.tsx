import { FetchCategories } from "../../organization/actions/fetchCategories";
import { FetchDepartment } from "../../organization/actions/fetchDepartment";
import { FetchPublications } from "../actions/fetchPublications";
import PublicationListView from "./components/PublicationsListView";
import { getSession } from "@/lib/auth/auth";

export default async function Page() {
  const { body } = await FetchPublications({});
  const session: any = await getSession();
  const res = body.filter(
    (item: any) => item.department._id == session?.user.department._id
  );
  const { body: departments } = await FetchDepartment();

  return <PublicationListView publications={res} departments={departments} />;
}
