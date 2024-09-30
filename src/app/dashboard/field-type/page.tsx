import { FetchFieldTypes } from "./actions/fetchFieldTypes";
import FieldTypesTables from "./components/FieldTypesTable";
export default async function Page() {
  const { body } = await FetchFieldTypes();
  return <FieldTypesTables fieldTypes={body} />;
}
