import { Layout } from "antd";
import SecondaryNav from "./components/layout/SecondaryNav";
import { fetchNotification } from "./actions/fetchNotification";
import PrimaryNavBar from "./components/layout/PrimaryNavBar";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
export default async function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/signin");
  } else {
    const { body: notifications } = await fetchNotification();

    return (
      <Layout>
        <Layout>
          <PrimaryNavBar notifications={notifications} />
          <SecondaryNav />
          <div className="p-[24px] bg-white">{children}</div>
        </Layout>
      </Layout>
    );
  }
}
