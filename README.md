# pep-gallery

## 1. Project Overview

-  Gallery web app for sharing and selling digital assets with community features.

### Tech Stack

- **Framework**: Next.js 15
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: NextAuth V5
- **ORM**: Drizzle ORM with relations
- **Deployment**: Vercel

---

## 2. Authentication System & Database Integration

## How Authentication Works

- **Registration** : Form → Zod validation → Password hash → User created in DB
- **Login** : Credentials → Zod validation → bcrypt compare → Session created
- **OAuth** : Google/GitHub → Provider callback → User created/linked
- **Sessions** : Stored in DB via Drizzle Adapter, JWT tokens for auth state

# Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Form
    participant NV as NextAuth
    participant DB as Database
    participant BC as bcrypt
    participant OA as OAuth Provider

    Note over U,OA: Credentials Flow
    U->>F: Submit Email/Password
    F->>NV: Validate with Zod
    NV->>DB: Query user by email
    DB->>NV: Return user data
    NV->>BC: Compare password hash
    BC->>NV: Password valid
    NV->>DB: Create session
    DB->>NV: Session token
    NV->>U: Login success

    Note over U,OA: OAuth Flow
    U->>NV: Sign in with Google/GitHub
    NV->>OA: Redirect to provider
    OA->>NV: OAuth callback
    NV->>DB: Find/create user + account
    DB->>NV: User data
    NV->>DB: Create session
    DB->>NV: Session token
    NV->>U: OAuth login success
```

## Integration Points

- **NextAuth** ↔ **Drizzle Adapter** ↔ **Neon PostgreSQL**
- **Credentials**: Custom compareUserFromDb with bcrypt verification
- **OAuth**: Google & GitHub providers with account linking
- **Sessions**: Automatic management with DB storage

## Auth Providers

- **Credentials** (Email/Password)
- **Google OAuth**
- **GitHub OAuth**

## Core Functions & Paths

### Auth Configuration

- **File: [src/lib/auth/auth.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/lib/auth/auth.ts).**
- **Features: NextAuth config with Drizzle adapter, Credentials & OAuth providers**

### Database Schema

- **File: [src/database/schema.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/database/schema.ts)**
- **Tables:**

```
- users (lines 13-21): Main user table with auth & subscription fields
- (lines 171-209):
- accounts : OAuth provider connections
- sessions : User session management
- verificationTokens : Email verification tokens
```

### Helper Functions

- **Password Hashing**: [src/utils/auth/hash-passord.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/utils/auth/hash-passord.ts) - **saltAndHashPassword()**

- **User Verification**: [src/utils/auth/compare-user.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/utils/auth/compare-user.ts) - **compareUserFromDb()**

- **User Creation**: [src/utils/auth/create-user.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/utils/auth/create-user.ts) - **createUser()**

### Validation Schemas

- **File**: [src/lib/validation-schemas.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/lib/validation-schemas.ts)
- **Schemas**: **registerFormSchema**, **loginFormSchema** with Zod validation

### **Auth Triggers**

- **Sign up**:

```ts
// for credntials I used Create user helper function
// for provideors it's the same as sign in
```

- **Sign in**:

```ts
import { signIn, SignInResponse } from "next-auth/react";
// in the form component
// for credentials
(await signIn("credentials", {
  email: values.email,
  password: values.password,
  redirectTo: "/profile",
})) as SignInResponse | undefined;
// for provideors
signIn("github", { redirectTo: "/profile" });
signIn("google", { redirectTo: "/profile" });
```

- **Sign Out**:

```ts
await signOut();
```

- **Session Check**: (this is the server check)

```ts
  auth() from NextAuth
```

## 2. Database Schema & Structure

## Database Overview

- Neon PostgreSQL database with complex relationships for gallery management, user interactions, and hierarchical categories.

```mermaid
erDiagram
    users {
        text id PK
        text name
        text email UK
        timestamp emailVerified
        text passwordHash
        text image
        user_role role
        text stripe_customer_id UK
        text stripe_subscription_id
        subscription_tier subscription_tier
        subscription_status subscription_status
        integer uploads_used
        integer downloads_free_used
        integer downloads_paid_used
        timestamp created_at
        timestamp updated_at
    }

    products {
        text id PK
        text title
        text description
        text slug UK
        json tags
        price_type price_type
        decimal price
        jsonb images
        integer download_count
        integer view_count
        decimal avg_rating
        integer review_count
        text user_id FK
        product_status status
        timestamp created_at
        timestamp updated_at
    }

    transactions {
        text id PK
        text user_id FK
        text product_id FK
        transaction_type type
        transaction_status status
        decimal amount
        text snapshot_title
        text snapshot_description
        decimal snapshot_price
        price_type snapshot_price_type
        jsonb snapshot_image
        text customer_email
        text customer_name
        text stripe_payment_intent_id
        text stripe_subscription_id
        timestamp created_at
    }

    categories {
        text id PK
        text name
        text slug UK
        text description
        text parent_id FK
        timestamp created_at
    }

    products_to_categories {
        text product_id PK,FK
        text category_id PK,FK
    }

    favorites {
        text id PK
        text user_id FK
        text product_id FK
        timestamp created_at
    }

    saved_items {
        text id PK
        text user_id FK
        text product_id FK
        timestamp created_at
    }

    reviews {
        text id PK
        text user_id FK
        text product_id FK
        integer rating
        text comment
        timestamp created_at
    }

    accounts {
        text userId PK,FK
        text type
        text provider PK
        text providerAccountId PK
        text refresh_token
        text access_token
        integer expires_at
        text token_type
        text scope
        text id_token
        text session_state
    }

    sessions {
        text sessionToken PK
        text userId FK
        timestamp expires
    }

    verificationTokens {
        text identifier PK
        text token PK
        timestamp expires
    }

    users ||--o{ products : "user_id CASCADE"
    users ||--o{ transactions : "user_id CASCADE"
    users ||--o{ favorites : "user_id CASCADE"
    users ||--o{ saved_items : "user_id CASCADE"
    users ||--o{ reviews : "user_id CASCADE"
    users ||--o{ accounts : "userId CASCADE"
    users ||--o{ sessions : "userId CASCADE"

    products }o--o{ transactions : "product_id SET NULL"
    products ||--o{ products_to_categories : "product_id CASCADE"
    products ||--o{ favorites : "product_id CASCADE"
    products ||--o{ saved_items : "product_id CASCADE"
    products ||--o{ reviews : "product_id CASCADE"

    categories ||--o{ products_to_categories : "category_id CASCADE"
    categories }o--|| categories : "parent_id SET NULL"

    products_to_categories }o--|| products : "product_id"
    products_to_categories }o--|| categories : "category_id"

```

## Key Database Features

### 🔄 Hierarchical Categories

- **Self-referencing parent_id allows infinite category nesting**
- **Top-level categories have parent_id: null**
- **Example Structure:**

```
  Technology (id: 'tech', parentId: null)
├── Laptops (id: 'laptops', parentId: 'tech')
└── Phones (id: 'phones', parentId: 'tech')
```

**Benefit**:

- Flexible organization without multiple tables

### 🔗 Many-to-Many Relationships

- **Products ↔ Categories: Junction table products_to_categories**
- **Single product can belong to multiple categories**
- **Single category can contain multiple products**

### 🗑️ onDelete System

```
  USERS
├── ⬇️ ON DELETE: CASCADE
│   │
│   ├── PRODUCTS (user_id)
│   │   ├── ⬇️ ON DELETE: CASCADE
│   │   │   │
│   │   │   ├── TRANSACTIONS (product_id) → SET NULL
│   │   │   ├── PRODUCTS_TO_CATEGORIES (product_id) → CASCADE
│   │   │   ├── FAVORITES (product_id) → CASCADE
│   │   │   ├── SAVED_ITEMS (product_id) → CASCADE
│   │   │   └── REVIEWS (product_id) → CASCADE
│   │   │
│   ├── TRANSACTIONS (user_id) → CASCADE
│   ├── FAVORITES (user_id) → CASCADE
│   ├── SAVED_ITEMS (user_id) → CASCADE
│   ├── REVIEWS (user_id) → CASCADE
│   ├── ACCOUNTS (userId) → CASCADE
│   └── SESSIONS (userId) → CASCADE
│
CATEGORIES
├── ⬇️ ON DELETE: CASCADE
│   │
│   ├── PRODUCTS_TO_CATEGORIES (category_id) → CASCADE
│   └── SELF-REFERENCE: parent_id → SET NULL

```

### File Reference

**Schema Definition**: [src/database/schema.ts](https://github.com/pepars-Rashid/pep-gallery/blob/main/src/database/schema.ts)

**Relations**: Drizzle relations for type-safe queries (lines 211-311)

**Migrations**: Automatic schema versioning with drizzle push command:
```bash
npx drizzle-kit push
```

***This structure supports scalable gallery operations with proper data integrity and flexible content organization.***
_________________________________________


### This project still in progress under this plan:

![Project Plan](https://github.com/pepars-Rashid/pep-gallery/blob/main/project-plan.png)