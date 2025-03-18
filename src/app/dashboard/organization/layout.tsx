import { redirect } from "next/navigation";
import TabNav from "./components/TabNav";
import { getSession } from "@/lib/auth/auth";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await getSession();
  if (!session?.user.roles.includes("ADMIN")) redirect("/dashboard/reports");
  else {
    return (
      <div>
        <TabNav />
        {children}
      </div>
    );
  }
}
