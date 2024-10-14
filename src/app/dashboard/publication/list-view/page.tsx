import { FetchPublications } from "../actions/fetchPublications";
import PublicationListView from "./components/PublicationsListView";

export default async function Page() {
  const { body } = await FetchPublications({});
  return <PublicationListView publications={body} />;
}
