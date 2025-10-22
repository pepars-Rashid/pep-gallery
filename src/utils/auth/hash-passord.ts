'use server'
import bcrypt from 'bcrypt';

export async function saltAndHashPassword(password: string): Promise<string> {
  try {
    // Use lower salt rounds to reduce server load (8 instead of 12)
    const passwordHash = await bcrypt.hash(password, 8);
    return passwordHash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password processing failed');
  }
}