import { FetchCategories } from "../actions/fetchCategories";
import { FetchDepartment } from "../actions/fetchDepartment";
import DepartmentTable from "./components/DepartmentTable";

export default async function Department() {
  const { body } = await FetchDepartment();
  const { body: cat } = await FetchCategories();
  return <DepartmentTable data={body} categories={cat} />;
}
