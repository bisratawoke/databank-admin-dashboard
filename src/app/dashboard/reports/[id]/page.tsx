// File: app/reports/[id]/page.tsx
import ReportDetailsPage from "./ReportDetailsPage";
import { fetchReport } from "../actions/fetchReports";

// The page component is a server component. It receives `params` from Next.js.
export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  // Call your fetchReport action with the ID from the URL.
  const reportData = await fetchReport(params.id);
  return <ReportDetailsPage reports={reportData} />;
}
