import { AntdRegistry } from "@ant-design/nextjs-registry";
import "../styles/globals.css";
import { getSession } from "../lib/auth/auth";
import Providers from "../lib/auth/authProvider";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <AntdRegistry>{children}</AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
