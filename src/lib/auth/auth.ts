import { db } from "@/database/db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { compareUserFromDb } from "@/utils/auth/compare-user"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { accounts, sessions, users, verificationTokens } from "@/database/schema"
import { eq, sql } from "drizzle-orm"
import { ZodError } from "zod"
import { loginFormSchema } from "@/lib/validation-schemas"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otpCode: { label: "OTP Code", type: "text", optional: true },
      },
      authorize: async (credentials) => {
        try {
          // If OTP code is provided, this means OTP was already verified
          // We just need to return the user without password check
          if (credentials.otpCode && credentials.email) {
            const user = await db
              .select({
                id: users.id,
                email: users.email,
                name: users.name,
                image: users.image,
                role: users.role,
                stripeCustomerId: users.stripeCustomerId,
                stripeSubscriptionId: users.stripeSubscriptionId,
                subscriptionTier: users.subscriptionTier,
                subscriptionStatus: users.subscriptionStatus,
              })
              .from(users)
              .where(eq(users.email, credentials.email as string))
              .limit(1);

            if (user.length === 0) {
              return null;
            }

            // Map database user to NextAuth User type (null -> undefined)
            const dbUser = user[0];
            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name ?? undefined,
              image: dbUser.image ?? undefined,
              role: dbUser.role ?? undefined,
              stripeCustomerId: dbUser.stripeCustomerId ?? undefined,
              stripeSubscriptionId: dbUser.stripeSubscriptionId ?? undefined,
              subscriptionTier: dbUser.subscriptionTier ?? undefined,
              subscriptionStatus: dbUser.subscriptionStatus ?? undefined,
            };
          }

          // Normal login flow - validate credentials with Zod
          const { email, password } = await loginFormSchema.parseAsync(credentials);

          // Find user by email and verify password
          const result = await compareUserFromDb(email, password);

          // Check if result has an error property
          if (result && "error" in result) {
            return null; // Invalid credentials
          }

          // For 2FA flow, we prevent auto-login here
          // The server action will handle sending OTP
          return null; // This will be handled by the 2FA flow
        } catch (error) {
          if (error instanceof ZodError) {
            return null; // Invalid input format
          }
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in - user object is available
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.stripeCustomerId = user.stripeCustomerId;
        token.stripeSubscriptionId = user.stripeSubscriptionId;
        token.subscriptionTier = user.subscriptionTier;
        token.subscriptionStatus = user.subscriptionStatus;
      }

      // On session update, refresh user data from database
      if (trigger === "update" && token.id) {
        const dbUser = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            image: users.image,
            role: users.role,
            stripeCustomerId: users.stripeCustomerId,
            stripeSubscriptionId: users.stripeSubscriptionId,
            subscriptionTier: users.subscriptionTier,
            subscriptionStatus: users.subscriptionStatus,
          })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);

        if (dbUser.length > 0) {
          const userData = dbUser[0];
          token.id = userData.id;
          token.email = userData.email;
          token.name = userData.name;
          token.image = userData.image;
          token.role = userData.role ?? undefined;
          token.stripeCustomerId = userData.stripeCustomerId ?? undefined;
          token.stripeSubscriptionId = userData.stripeSubscriptionId ?? undefined;
          token.subscriptionTier = userData.subscriptionTier ?? undefined;
          token.subscriptionStatus = userData.subscriptionStatus ?? undefined;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Populate session from JWT token
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.image as string | null | undefined;
        session.user.role = token.role as "user" | "admin" | undefined;
        session.user.stripeCustomerId = token.stripeCustomerId as string | null | undefined;
        session.user.stripeSubscriptionId = token.stripeSubscriptionId as string | null | undefined;
        session.user.subscriptionTier = token.subscriptionTier as "free" | "basic" | "premium" | "vip" | "custom" | undefined;
        session.user.subscriptionStatus = token.subscriptionStatus as "active" | "canceled" | "past_due" | "unpaid" | undefined;
      }
      return session;
    },
    async signIn({ user }) {
      // Optionally create session record in DB for multi-device tracking
      // This allows you to see all active sessions per user
      // JWT authentication works independently of this
      if (user?.id) {
        try {
          // Generate a session token for tracking
          const sessionToken = crypto.randomUUID();

          await db.insert(sessions).values({
            sessionToken,
            userId: user.id,
            expires: sql`now() + interval '30 days'`,
          });
        } catch (error) {
          // Don't fail sign in if session creation fails
          // This is just for tracking purposes
          console.error("Failed to create session record for tracking:", error);
        }
      }
      return true;
    },
  },
})