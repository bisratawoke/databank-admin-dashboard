import { fetchFieldTypes } from "../../actions/fetchFieldTypes";
import { fetchReport } from "../../actions/fetchReports";
import ReportTable from "../../components/ReportTable";
export default async function Page({ params }: { params: { id: string } }) {
  const report = await fetchReport(params.id);
  const fieldTypes = await fetchFieldTypes();
  return (
    <ReportTable reportId={params.id} report={report} fieldTypes={fieldTypes} />
  );
}
