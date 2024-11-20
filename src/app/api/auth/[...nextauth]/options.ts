import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnection from "@/lib/dbConnect";
import UserModel, { IUser } from "@/model/UserSchema";
import { Document } from "mongoose";

// Define the structure of the user object returned
interface User {
  id: string;
  email: string;
  full_Name: string;
  isVerified: boolean;
  onboardComplete: boolean;
  resumeUrl?: string;
  role?: string;
  avatar?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await dbConnection();
        try {
          const email = credentials.email;
          const user = (await UserModel.findOne({ email }).select(
            "+resumeUrl"
          )) as Document<IUser> & IUser;

          // Check user is there or not
          if (!user) {
            throw new Error("User not found");
          }

          // Check user is verified or not
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          if (user.password !== undefined) {
            // Compare user password with database password
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordCorrect) {
              return {
                id: user._id.toString(),
                email: user.email,
                full_Name: user.full_Name ?? "",
                isVerified: user.isVerified,
                onboardComplete: user.onboardComplete,
                resumeUrl: user.resumeUrl,
                role: user.role,
                avatar: user.avatar?.secure_url,
              };
            } else {
              throw new Error("Incorrect Password");
            }
          }
          return null;
        } catch (error) {
          throw new Error((error as Error).message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, session, trigger }) {
      // Update token after user onboarding
      if (trigger === "update" && session?.onboardComplete) {
        token.onboardComplete = session.onboardComplete;
        token.resumeUrl = session.resumeUrl;
        token.role = session.role;
      }
      if (trigger === "update" && session?.picture) {
        token.picture = session.picture;
      }

      // If user logs in with Google
      if (account?.provider === "google") {
        await dbConnection();

        // Declare newUser outside the if block
        let newUser = null;

        // Find or create the user in the database
        const existingUser = await UserModel.findOne({ email: profile?.email });
        if (!existingUser) {
          // New user creation
          newUser = new UserModel({
            full_Name: profile?.name,
            email: profile?.email,
            isVerified: true, // Set any defaults you want for new users
            expireVerifyCode: new Date(),
            onboardComplete: false, // Set default for new users
            avatar: {
              secure_url: (profile as { picture?: string })?.picture || "",
              public_id: "",
            },
          });

          await newUser.save();

          // Set token for user who logs in with Google
          token.isNewUser = true;
          token.onboardComplete = false;
        } else {
          // If the user already exists, mark them as not new
          token.isNewUser = false;
          token.picture = existingUser?.avatar?.secure_url;
          token.onboardComplete = existingUser.onboardComplete;
          token.resumeUrl = existingUser?.resumeUrl;
          token.role = existingUser?.role;
        }

        // Add user ID and other details to the token
        token._id = existingUser?._id?.toString() ?? newUser?._id?.toString();
        token.isVerified = existingUser?.isVerified ?? newUser?.isVerified;
        return token;
      }
      // If user logs in with Credentials
      if (user) {
        token._id = user.id;
        token.name = user.full_Name ?? "";
        token.isVerified = user.isVerified;
        token.onboardComplete = user.onboardComplete;
        token.resumeUrl = user.resumeUrl;
        token.role = user.role;
        token.picture = user.avatar;
      }
      return token;
    },

    async session({ session, token }) {
      // Pass the user data to the session object
      session.user._id = token._id;
      session.user.name = token.name ?? "";
      session.user.isVerified = token.isVerified;
      session.user.isNewUser = token.isNewUser;
      session.user.onboardComplete = token.onboardComplete;
      session.user.role = token.role;
      session.user.resumeUrl = token.resumeUrl;

      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // 1 day
  },

  secret: process.env.NAXTAUTH_SECRET,
};
