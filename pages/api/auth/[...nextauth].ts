import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import NaverProvider from "next-auth/providers/naver";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../util/prisma";

const lpad = function (padString: string, length: number) {
  var str = padString;
  while (str.length < length) str = "0" + str;
  return str;
};

function getUsername(name: string, email: string, id: string) {
  let x = 0;
  for (let i = 0; i < (email as string).length; i++) {
    x += (email as string).charCodeAt(i);
  }
  let idonlynum = Math.floor(
    parseInt((id as string).replace(/\D/g, "") as string) * 1.25 * 3 + x
  );
  let a = name;
  return `${a}#${lpad((idonlynum % 10000).toString(), 4)}`;
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    NaverProvider({
      clientId: process.env.NAVER_ID as string,
      clientSecret: process.env.NAVER_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.permission = token.permission;
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        let x = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
        });
        token.permission = x?.permission as string[];
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    createUser: async ({ user }) => {
      await prisma.user
        .update({
          where: {
            id: user.id,
          },
          data: {
            nickName: getUsername(
              user.name || "User",
              user.email || "",
              user.id
            ),
          },
        })
        .then(() => {
          Promise.resolve();
        })
        .catch(() => {});
    },
  },
});
