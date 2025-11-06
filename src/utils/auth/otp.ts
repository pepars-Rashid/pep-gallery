"use server";

import { db } from "@/database/db";
import { otpCodes } from "@/database/schema";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import { sendOTPEmail } from "@/utils/email/nodemailer";

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAndSendOTP(userId: string, email: string) {
  try {
    // Delete any existing unverified OTPs for this user
    await db
      .delete(otpCodes)
      .where(and(eq(otpCodes.userId, userId), eq(otpCodes.verified, 0)));

    // Generate new OTP
    const code = await generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in database
    await db.insert(otpCodes).values({
      userId,
      email,
      code,
      expiresAt,
      verified: 0,
    });

    // Send email via MailerSend
    const emailResult = await sendOTPEmail(email, code);

    if (!emailResult.success) {
      // Clean up the OTP if email failed
      await db.delete(otpCodes).where(eq(otpCodes.code, code));

      throw new Error("Failed to send OTP email");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating OTP:", error);
    return { success: false, error: "Failed to create OTP" };
  }
}

export async function verifyOTP(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.userId, userId),
          eq(otpCodes.code, code),
          eq(otpCodes.verified, 0),
          // Use database clock to avoid server timezone/drift issues
          gt(otpCodes.expiresAt, sql`now()`)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    // Mark as verified
    await db
      .update(otpCodes)
      .set({ verified: 1 })
      .where(eq(otpCodes.id, result[0].id));

    return { success: true };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Failed to verify OTP" };
  }
}

// we should hanlde this later
export async function cleanupExpiredOTPs() {
  try {
    await db
      .delete(otpCodes)
      // Delete any OTPs whose expiry is before the current DB time
      .where(lt(otpCodes.expiresAt, sql`now()`));
  } catch (error) {
    console.error("Error cleaning up OTPs:", error);
  }
}
