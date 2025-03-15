/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.username,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const response = await res.json();

        if (res.ok && response.user && response.auth) {
          return {
            ...response.user,
            accessToken: response.auth.accessToken,
            refreshToken: response.auth.refreshToken,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      console.log("===================== inside jwt callback ==============");
      console.log(user);
      console.log(token);
      if (user) {
        token.user = { ...user, lastLogin: user.lastLogin || null };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      if (token.exp && token.exp < Date.now()) {
        const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            refresh_token: token.refreshToken,
          }),
        });

        if (!(res.status == 201)) redirect("/api/auth/signin");
        const result = await res.json();

        token.accessToken = result.access_token;
        token.user.accessToken = result.access_token;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard/organization`;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
