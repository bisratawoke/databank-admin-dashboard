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

  console.log("========= in this page ===========");
  console.log(reportData);
  // Pass the fetched report as a prop into your client component.
  return <ReportDetailsPage reports={reportData} />;
}
