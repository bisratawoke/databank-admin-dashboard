import { fetchReports } from "../actions/fetchReports";
import ReportListTable from "../components/ReportListTable";

export default async function page() {
  const result = await fetchReports();
  console.log("==== fetching report ==============");
  console.log(result);
  return <ReportListTable reports={result} />;
}
