import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Connect to the database
          await connectDB();

          // Find the user
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          // Check the password
          const isPasswordValid = await compare(
            credentials.password.toString(),
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return the user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to token when user signs in
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user role to session with fallback to "user" if undefined
      if (session.user) {
        session.user.role = token.role as string || "user";
        session.user.id = token.id as string;
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