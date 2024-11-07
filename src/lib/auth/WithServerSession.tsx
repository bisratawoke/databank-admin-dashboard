import { signIn } from "next-auth/react";
import { getSession } from "./auth";

export const WithServerSession = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = getSession();
  if (!session) signIn();
  else return <>{children}</>;
};
