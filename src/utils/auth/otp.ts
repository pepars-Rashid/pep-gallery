"use server";

import { db } from "@/database/db";
import { verificationTokens } from "@/database/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import { sendOTPEmail } from "@/utils/email/nodemailer";

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
  // real production generation:
  // randomInt(100000, 999999).toString(); // 6-digit OTP is better option
  // we could even hash it by bcrypt (no need for server cpu usage) 
}

export async function createAndSendOTP(identifier: string, email: string) {
  try {
    // Delete any existing tokens for this identifier
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, identifier));

    // Generate new OTP
    const code = await generateOTP();
    // const expires = new Date(Date.now() + 30 * 60 * 1000); // wrong server expiry

    // Store in verificationTokens table
    await db.insert(verificationTokens).values({
      identifier, // email or userId
      token: code, // OTP code
      expires: sql`now() + interval '30 minutes'`, // Database handles expiry
    });

    // Send email via MailerSend
    const emailResult = await sendOTPEmail(email, code);

    if (!emailResult.success) {
      // Clean up the token if email failed
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, code)
          )
        );

      throw new Error("Failed to send OTP email");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating OTP:", error);
    return { success: false, error: "Failed to create OTP" };
  }
}

export async function verifyOTP(
  identifier: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, code),
          // Use database clock to avoid server timezone/drift issues
          gt(verificationTokens.expires, sql`now()`)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    // Delete the token after successful verification (one-time use)
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, code)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Failed to verify OTP" };
  }
}
