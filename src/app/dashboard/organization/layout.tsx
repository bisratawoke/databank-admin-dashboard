import TabNav from "./components/TabNav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TabNav />
      {children}
    </>
  );
}
