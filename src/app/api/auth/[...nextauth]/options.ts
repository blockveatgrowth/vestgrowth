import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth — free via Google Cloud Console
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

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
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) return null;
          if (!user.password) return null; // Google-only account

          const isPasswordValid = await compare(
            credentials.password.toString(),
            user.password
          );

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
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-in — create or update user in DB
      if (account?.provider === "google") {
        try {
          await connectDB();

          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            // Update Google ID and profile image if not already set
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
            }
            const googleProfile = profile as { picture?: string } | undefined;
            if (googleProfile?.picture) {
              existingUser.profileImage = googleProfile.picture || user.image || existingUser.profileImage;
            }
            await existingUser.save();

            // Attach role and id to user object for JWT
            user.id = existingUser._id.toString();
            (user as { role?: string }).role = existingUser.role;
          } else {
            // Create new user from Google profile
            const newUser = await User.create({
              name: user.name || "User",
              email: user.email,
              googleId: account.providerAccountId,
              profileImage: user.image || "",
              role: "user",
              balance: 0,
            });

            user.id = newUser._id.toString();
            (user as { role?: string }).role = newUser.role;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
        token.id = user.id;
        token.picture = user.image;
      }
      // On Google sign-in, fetch fresh user data
      if (account?.provider === "google" && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
            token.picture = dbUser.profileImage || token.picture;
          }
        } catch {}
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
