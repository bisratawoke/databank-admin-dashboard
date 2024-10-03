import { FetchSubCategories } from "../../organization/actions/fetchSubCategories";
import { fetchReports } from "../actions/fetchReports";
import ReportListTable from "../components/ReportListTable";

export default async function page() {
  const result = await fetchReports();
  const { body } = await FetchSubCategories();

  return <ReportListTable reports={result} subCategories={body} />;
}
