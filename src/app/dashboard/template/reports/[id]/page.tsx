import { fetchReport } from "../../actions/fetchReports";
import ReportTable from "../../components/ReportTable";
export default async function Page({ params }: { params: { id: string } }) {
  const report = await fetchReport(params.id);
  return <ReportTable report={report}></ReportTable>;
}
