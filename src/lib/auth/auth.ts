/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);