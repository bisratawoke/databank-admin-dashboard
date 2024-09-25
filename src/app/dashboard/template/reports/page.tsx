import { fetchReports } from "../actions/fetchReports";
import ReportListTable from "../components/ReportListTable";

export default async function page() {
  const result = await fetchReports();

  return <ReportListTable reports={result} />;
}
