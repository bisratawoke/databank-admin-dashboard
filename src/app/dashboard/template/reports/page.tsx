import { FetchSubCategories } from "../../organization/actions/fetchSubCategories";
import { fetchReports } from "../actions/fetchReports";
import ReportListTable from "../components/ReportListTable";
import { getSession } from "@/lib/auth/auth";
export default async function page() {
  const result = await fetchReports();
  const session: any = await getSession();
  console.log("=============== in get reports list page ===========");
  console.log(session);
  let res = result;
  if (
    !session.user.roles.includes("DISSEMINATION_HEAD") &&
    !session.user.roles.includes("DEPUTY_DIRECTOR")
  ) {
    res = result.filter((item: any) => {
      if (item.department) {
        return item.department._id == session.user.department._id;
      }
    });
  }
  const { body } = await FetchSubCategories();

  console.log(res);
  return <ReportListTable reports={res} subCategories={body} />;
}
