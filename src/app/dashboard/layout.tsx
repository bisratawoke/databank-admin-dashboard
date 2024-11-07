import { Layout } from "antd";
import SecondaryNav from "./components/layout/SecondaryNav";
import { fetchNotification } from "./actions/fetchNotification";
import PrimaryNavBar from "./components/layout/PrimaryNavBar";

export default async function Index({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
