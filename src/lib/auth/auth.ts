import { db } from "@/database/db"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { compareUserFromDb } from "@/utils/auth/compare-user"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { accounts, sessions, users } from "@/database/schema"
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
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials with Zod
          const { email, password } = await loginFormSchema.parseAsync(credentials)
          
          // Find user by email and verify password
          const result = await compareUserFromDb(email, password)
          
          // Check if result has an error property
          if (result && 'error' in result) {
            return null // Invalid credentials
          }
          
          return result
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