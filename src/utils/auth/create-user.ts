"use server"
import { db } from '@/database/db'
import { users } from '@/database/schema'
import { saltAndHashPassword } from './hash-passord'
import { eq } from 'drizzle-orm'

export async function createUser(email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error('User already exists')
    }

    // Hash password
    const passwordHash = await saltAndHashPassword(password)

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
      })
      .returning({ id: users.id, email: users.email, name: users.name })

    return newUser[0]
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
