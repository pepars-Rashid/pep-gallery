// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extended User type that matches your database schema
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    
    // Your custom fields from the database - make sure these match your schema exactly
    role?: "user" | "admin";
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionTier?: "free" | "basic" | "premium" | "vip" | "custom";
    subscriptionStatus?: "active" | "canceled" | "past_due" | "unpaid";
    uploadsUsed?: number;
    downloadsFreeUsed?: number;
    downloadsPaidUsed?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }

  /**
   * Extended Session type
   */
  export interface Session {
    user: {
      // Your custom fields
      role?: "user" | "admin";
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      subscriptionTier?: "free" | "basic" | "premium" | "vip" | "custom";
      subscriptionStatus?: "active" | "canceled" | "past_due" | "unpaid";
      uploadsUsed?: number;
      downloadsFreeUsed?: number;
      downloadsPaidUsed?: number;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** Extended JWT token with your custom fields */
  interface JWT {
    role?: "user" | "admin";
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionTier?: "free" | "basic" | "premium" | "vip" | "custom";
    subscriptionStatus?: "active" | "canceled" | "past_due" | "unpaid";
    uploadsUsed?: number;
    downloadsFreeUsed?: number;
    downloadsPaidUsed?: number;
  }
}