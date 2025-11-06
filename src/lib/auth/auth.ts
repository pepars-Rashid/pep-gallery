import { db } from "@/database/db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { compareUserFromDb } from "@/utils/auth/compare-user"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { accounts, sessions, users } from "@/database/schema"
import { eq } from "drizzle-orm"
import { ZodError } from "zod"
import { loginFormSchema } from "@/lib/validation-schemas"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db,{
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [Google, GitHub,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otpCode: { label: "OTP Code", type: "text", optional: true },
        userId: { label: "User ID", type: "text", optional: true },
      },
      authorize: async (credentials) => {
        try {
          // If OTP code is provided, this means OTP was already verified
          // We just need to return the user without password check
          if (credentials.otpCode && credentials.userId) {
            const user = await db
              .select({
                id: users.id,
                email: users.email,
                name: users.name,
                image: users.image,
              })
              .from(users)
              .where(eq(users.id, credentials.userId as string))
              .limit(1);

            if (user.length === 0) {
              return null;
            }

            return user[0];
          }

          // Normal login flow - validate credentials with Zod
          const { email, password } = await loginFormSchema.parseAsync(credentials)
          
          // Find user by email and verify password
          const result = await compareUserFromDb(email, password)
          
          // Check if result has an error property
          if (result && 'error' in result) {
            return null // Invalid credentials
          }
          
          // For 2FA flow, we prevent auto-login here
          // The API route will handle sending OTP
          return null // This will be handled by the 2FA API route
        } catch (error) {
          if (error instanceof ZodError) {
            return null // Invalid input format
          }
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
})