import { FetchSubCategories } from "../../organization/actions/fetchSubCategories";
import { fetchReports } from "../actions/fetchReports";
import ReportListTable from "../components/ReportListTable";
import { getSession } from "@/lib/auth/auth";
export default async function page() {
  const result = await fetchReports();
  const session: any = await getSession();
  console.log("======= in fetch reports =========");
  console.log(result);
  const res = result.filter((item: any) => {
    if (item.department) {
      return item.department._id == session.user.department._id;
    }
  });
  const { body } = await FetchSubCategories();

  console.log(res);
  return <ReportListTable reports={res} subCategories={body} />;
}
