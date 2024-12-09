import FetchPublicationRequests from "./actions/fetchPublicationRequests";
import PublicationRequestListView from "./components/publicationRequestListView";

export default async function Page() {
  const { body } = await FetchPublicationRequests();
  return <PublicationRequestListView publicationRequestList={body} />;
}
