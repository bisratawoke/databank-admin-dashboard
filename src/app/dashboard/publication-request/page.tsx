import FetchPublicationRequests from "./actions/fetchPublicationRequests";
import PublicationRequestListView from "./components/publicationRequestListView";

export default async function Page() {
  const { body } = await FetchPublicationRequests();

  console.log("============ in publication request ==================");
  console.log(body);

  return <PublicationRequestListView publicationRequestList={body} />;
}
