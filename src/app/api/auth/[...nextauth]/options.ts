import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextAuthOptions } from "next-auth";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    // Standard email/password login
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

          if (!user || !user.password) return null;

          const isPasswordValid = await compare(credentials.password.toString(), user.password);
          if (!isPasswordValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.profileImage || user.avatar || null,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),

    // Magic Link (passwordless) login
    CredentialsProvider({
      id: "magic-token",
      name: "Magic Link",
      credentials: {
        token: { label: "Token", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.token || !credentials?.email) return null;

        try {
          await connectDB();

          const hashedToken = crypto.createHash("sha256").update(credentials.token).digest("hex");

          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
            magicToken: hashedToken,
            magicTokenExpiry: { $gt: new Date() },
          });

          if (!user) return null;

          // Clear the magic token after use
          user.magicToken = undefined;
          user.magicTokenExpiry = undefined;
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.profileImage || user.avatar || null,
          };
        } catch (error) {
          console.error("Magic token auth error:", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || "user";
        session.user.id = token.id as string;
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
};
