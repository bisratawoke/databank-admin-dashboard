import { FetchTree } from "./actions/fetchTree";
import DataTree from "./components/DataTree";
export default async function page() {
  const { body } = await FetchTree();

  console.log(body);
  return <DataTree data={body} />;
}
