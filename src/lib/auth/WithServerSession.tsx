import { signIn } from "next-auth/react";
import { getSession } from "./auth";

export const WithServerSession = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getSession();

  if (!session) signIn();
  else return <>{children}</>;
};
