import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  decimal,
  jsonb,
  pgEnum,
  AnyPgColumn,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ===== ENUMS =====
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "basic",
  "premium",
  "vip",
  "custom",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "unpaid",
]);
export const priceTypeEnum = pgEnum("price_type", ["free", "paid"]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);
export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
]);

// ===== USERS & AUTH =====
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 20 }),
  identifier: varchar("identifier", { length: 40 }),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  passwordHash: text("passwordHash"),
  image: text("image"),
  role: userRoleEnum("role").default("user"),

  // user info (optional)
  briefDescription: varchar("brief_description", { length: 200 }),

  // Stripe & Subscription fields
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default(
    "active"
  ),

  // Usage tracking - Enhanced for free vs paid
  monthlyUploadLimit: integer("monthly_upload_limit").default(5), // Free tier: 5
  currentMonthUploads: integer("current_month_uploads").default(0),
  uploadLimitResetAt: timestamp("upload_limit_reset_at"), // When to reset counters

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== PRODUCTS =====
export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  slug: text("slug").notNull().unique(),
  tags: jsonb("tags").$type<string[]>().default([]),

  servicePrice: decimal("servicePrice", { precision: 10, scale: 2 }), // Amount for paid items
  priceType: priceTypeEnum("price_type").notNull(),

  // Separated image arrays
  Images: jsonb("original_images")
    .$type<
      Array<{
        publicId: string; // Cloudinary public ID
        width: number;
        height: number;
        format: string; // jpg, png, mp3, mp4, etc.
        size: number; // File size in bytes
      }>
    >()
    .notNull()
    .default([]),

  // Stats
  viewCount: integer("view_count").default(0),
  likes: integer("likes").default(0),

  // Ownership & status
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: productStatusEnum("status").default("draft"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== TRANSACTIONS (Single Table - Optimized for Single Item Purchases) =====
export const transactions = pgTable("transaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),

  // Transaction Details
  status: transactionStatusEnum("status").default("pending"),
  amount: decimal("amount", { precision: 10, scale: 2 }).default("0.00"), // 0 for free services

  // SNAPSHOT - Preserve product details at time of transaction
  snapshotTitle: varchar("snapshot_title", { length: 100 }).notNull(),
  snapshotDescription: varchar("snapshot_description", { length: 500 }),
  snapshotPrice: decimal("snapshot_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  snapshotPriceType: priceTypeEnum("snapshot_price_type").notNull(),

  // Primary image snapshot
  snapshotImage: jsonb("snapshot_image").$type<{
    publicId: string;
    url: string;
    width: number;
    height: number;
  }>(),

  // Customer info
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),

  // Stripe identifiers (null for free downloads)
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== CATEGORIES =====
export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }).notNull(),
  slug: text("slug").notNull().unique(),
  description: varchar("description", { length: 500 }),
  parentId: text("parent_id").references((): AnyPgColumn => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== JUNCTION TABLES =====
export const productsToCategories = pgTable(
  "products_to_categories",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] })]
);

export const likes = pgTable("likes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedItems = pgTable("saved_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== REVIEWS =====
export const reviews = pgTable("review", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  comment: varchar("comment", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== AUTH TABLES =====
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<"oauth" | "oidc" | "email">().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// ===== RELATIONS =====
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  transactions: many(transactions),
  likes: many(likes),
  savedItems: many(savedItems),
  reviews: many(reviews),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  categories: many(productsToCategories),
  likes: many(likes),
  savedItems: many(savedItems),
  reviews: many(reviews),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(productsToCategories),
}));

export const productsToCategoriesRelations = relations(
  productsToCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productsToCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productsToCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [likes.productId],
    references: [products.id],
  }),
}));

export const savedItemsRelations = relations(savedItems, ({ one }) => ({
  user: one(users, {
    fields: [savedItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [savedItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
