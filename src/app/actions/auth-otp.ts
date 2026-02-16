"use server"

import { db } from '@/database/db';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { compareUserFromDb } from '@/utils/auth/compare-user';
import { createAndSendOTP, verifyOTP } from '@/utils/auth/otp';

export async function initiateOTP(email: string, password: string) {
  try {
    // Verify credentials
    const result = await compareUserFromDb(email, password);
    
    if (result && 'error' in result) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Get user ID
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Create and send OTP using email as identifier
    const otpResult = await createAndSendOTP(email, email);

    if (!otpResult.success) {
      return {
        success: false,
        error: otpResult.error || 'Failed to send OTP',
      };
    }

    return {
      success: true,
      message: 'OTP sent to your email',
      userId: user[0].id,
    };
  } catch (error) {
    console.error('OTP initiation error:', error);
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}


// Server Action: Verify OTP and get user email

export async function verifyOTPAndGetUser(email: string, otpCode: string) {
  try {
    if (!email || !otpCode) {
      return {
        success: false,
        error: 'Missing OTP code or email',
      };
    }

    // Verify OTP using email as identifier
    const verification = await verifyOTP(email, otpCode);

    if (!verification.success) {
      return {
        success: false,
        error: verification.error || 'Invalid OTP',
      };
    }

    // Get user to return userId
    const user = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      message: 'OTP verified successfully',
      userId: user[0].id,
      email: user[0].email,
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}

