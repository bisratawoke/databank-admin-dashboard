import WithRole from "@/lib/auth/WithRole";
import { WithServerSession } from "@/lib/auth/WithServerSession";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WithServerSession>
      <WithRole role={"ADMIN"}>{children}</WithRole>
    </WithServerSession>
  );
}
