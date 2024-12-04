import { FetchDepartment } from "../organization/actions/fetchDepartment";
import { FetchUsers, FetchRoles } from "./actions/fetchUsers";
import UserListTable from "./components/UserListTable";

export default async function Users() {
  const { body } = await FetchUsers();
  const { body: roles } = await FetchRoles();
  const { body: departments } = await FetchDepartment();
  console.log("======= in users =====");
  console.log(departments);
  return <UserListTable data={body} roles={roles} departments={departments} />;
}
