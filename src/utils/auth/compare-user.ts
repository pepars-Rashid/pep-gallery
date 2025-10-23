"use server"
import { db } from '@/database/db';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function compareUserFromDb(email: string, password: string) {
  try {
    // 1. Find user by email
    const user = await db
      .select({
        email: users.email,
        passwordHash: users.passwordHash,
        id: users.id, 
        name: users.name, 
        image: users.image 
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return { error: 'USER_NOT_FOUND' }; // User doesn't exist
    }

    const foundUser = user[0];

    // 2. Check if user has a password hash (social login users might not have one)
    if (!foundUser.passwordHash) {
      return { error: 'NO_PASSWORD_SET' }; // Social login user trying credentials
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, foundUser.passwordHash);

    if (!isPasswordValid) {
      return { error: 'INVALID_PASSWORD' }; // Wrong password
    }

    // 4. Return user without sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;

  } catch (error) {
    console.error('Error comparing user:', error);
    return { error: 'DATABASE_ERROR' };
  }
}