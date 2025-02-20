import { FetchSubCategories } from "../../organization/actions/fetchSubCategories";
import { fetchReports } from "../actions/fetchReports";
import ReportListTable from "../components/ReportListTable";
import { getSession } from "@/lib/auth/auth";
export default async function page() {
  const result = await fetchReports();
  const session: any = await getSession();
  const res = result.filter(
    (item: any) => item.department._id == session.user.department._id
  );
  const { body } = await FetchSubCategories();

  return <ReportListTable reports={res} subCategories={body} />;
}
