import { FetchUsers } from "../../users/actions/fetchUsers";
import { FetchCategories } from "../actions/fetchCategories";
import { FetchDepartment } from "../actions/fetchDepartment";
import DepartmentTable from "./components/DepartmentTable";

export default async function Department() {
  const { body } = await FetchDepartment();
  const { body: cat } = await FetchCategories();
  const { body: users } = await FetchUsers();

  return <DepartmentTable data={body} categories={cat} users={users} />;
}
