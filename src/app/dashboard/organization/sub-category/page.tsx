import { FetchSubCategories } from "../actions/fetchSubCategories";
import { fetchReports } from "../../reports/actions/fetchReports";
import SubCategoryTable from "./components/SubCategoryTable";
export default async function Subcategory() {
  const { body } = await FetchSubCategories();
  const result = await fetchReports();
  console.log(JSON.stringify(body));
  return <SubCategoryTable data={body} reports={result} />;
}