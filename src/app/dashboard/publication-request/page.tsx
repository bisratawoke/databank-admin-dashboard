import PublicationListView from "../publication/list-view/components/PublicationsListView";
import FetchPublicationRequests from "./actions/fetchPublicationRequests";
import PublicationRequestListView from "./components/publicationRequestListView";

export default async function Page() {
  const { body, status } = await FetchPublicationRequests();

  console.log(
    "========== in publication request ================================="
  );
  console.log(body);

  return <PublicationRequestListView publicationRequestList={body} />;
}
