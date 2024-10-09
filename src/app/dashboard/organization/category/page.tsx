import { FetchCategories } from "../actions/fetchCategories";
import { FetchSubCategories } from "../actions/fetchSubCategories";
import CategoryTable from "./components/CategoryTable";
export default async function Category() {
  const { body } = await FetchCategories();
  const { body: subcat } = await FetchSubCategories();
  return <CategoryTable data={body} subcategories={subcat} />;
}
