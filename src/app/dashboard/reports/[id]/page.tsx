// File: app/reports/[id]/page.tsx
import ReportDetailsPage from "./ReportDetailsPage";
import { fetchReport } from "../actions/fetchReports";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const reportData = await fetchReport(params.id);
  return <ReportDetailsPage reports={reportData} />;
}
