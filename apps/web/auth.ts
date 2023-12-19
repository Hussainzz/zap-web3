import { type NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'
import { encryptString } from "@/lib/encrypt";

declare module "next-auth" {
  interface User {
    id?: number;
    name?: string | null
    email?: string | null
    apiAccessToken?: string | null
  }
}

const AUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        //if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid credentials");
        }

        const cookieStore = cookies()

        const apiAccessToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          AUTH_SECRET
        );
        cookieStore.set('api-access-token', encryptString(apiAccessToken), {
          secure: true,
          httpOnly: true
        });

        return {
          id: user?.id,
          name: user?.fullname,
          email: user?.email,
          apiAccessToken: encryptString(apiAccessToken)
        } satisfies User;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
  callbacks:{
    async jwt({ token, user }) {
      const merged = {
        ...token,
        ...user,
      };

      if (!merged.email) {
        const userId = Number(merged.id ?? token.sub);

        const retrieved = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        });

        if (!retrieved) {
          return token;
        }

        merged.id = retrieved.id;
        merged.email = retrieved.email;
      }


      return {
        id: merged.id,
        name: merged.name,
        email: merged.email,
        apiAccessToken: merged.apiAccessToken
      };
    },
    async session({ token, session }) {
      if (token && token.email) {
        return {
          ...session,
          user: {
            id: Number(token.id),
            name: token.name,
            email: token.email,
            apiAccessToken: token.apiAccessToken
          },
        };
      }
      return session;
    },
  }
  // jwt: {
  //   async encode({ secret, token }) {
  //     const encodedToken = jwt.sign(
  //       {
  //         ...token,
  //         exp: 30 * 24 * 60 * 60
  //       },
  //       secret
  //     )
  //     return encodedToken
  //   },
  //   async decode({ secret, token }) {
  //     const decodedToken = jwt.verify(token!, secret)
  //     console.log(decodedToken)
  //     return decodedToken as JWT
  //   }
  // }
};
