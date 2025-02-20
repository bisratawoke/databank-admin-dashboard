import { Layout } from "antd";
import SecondaryNav from "./components/layout/SecondaryNav";
import { fetchNotification } from "./actions/fetchNotification";
import PrimaryNavBar from "./components/layout/PrimaryNavBar";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { AiOutlineConsoleSql } from "react-icons/ai";
import PasswordResetModal from "./components/ui/PasswordResetModal";
export default async function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await getSession();
  console.log("========== in root layout ================");
  console.log(session);
  if (!session) {
    redirect("/api/auth/signin");
  } else {
    const { body: notifications } = await fetchNotification();
    const showModal = session?.user?.lastLogin == null;
    return (
      <Layout>
        <Layout>
          <PrimaryNavBar notifications={notifications} />
          <SecondaryNav />
          <div className="p-[24px] bg-white">{children}</div>
        </Layout>
        {showModal && <PasswordResetModal />}
      </Layout>
    );
  }
}
