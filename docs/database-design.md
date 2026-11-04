# SakhiSetu — Database Design & Schema Reference

## 1. Relational Database Overview

The SakhiSetu platform is powered by a normalized relational PostgreSQL database managed through Prisma ORM. Financial integrity, zero floating-point arithmetic errors, and strict non-destructive constraints govern all tables.

### Design Principles:
1. **Precise Decimal Handling**: Monetary values (`goalAmount`, `collectedAmount`, `amount`, `donationAmount`) use `Decimal(12, 2)` in PostgreSQL, never raw IEEE-754 floating-point numbers.
2. **Non-Destructive Deletions**: Financial records (`Donation`, `Payment`, `Receipt`, `Campaign`) enforce `onDelete: Restrict` to preserve financial auditability.
3. **Atomic Concurrency**: Sequence numbering utilizes an isolated row-level locking table (`ReceiptSequence`) with `UPDATE ... RETURNING`.
4. **Data Minimization & Snapshotting**: Receipts store a frozen historical snapshot of the donor's name, PAN, and trust details at the moment of issuance, ensuring receipts remain legally intact even if the donor later edits their profile.

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ DONATION : "initiates"
    USER ||--o{ AI_REVIEW : "reviews"
    USER ||--o{ AUDIT_LOG : "triggers"
    CAMPAIGN ||--o{ DONATION : "receives"
    SCHEME ||--o{ AI_REVIEW : "has"
    DONATION ||--o{ PAYMENT : "processed_by"
    DONATION ||--|| RECEIPT : "issues"

    USER {
        uuid id PK
        string fullName
        string email UK
        string phone
        string passwordHash
        enum role "DONOR | ADMIN"
        enum preferredLanguage "EN | HI"
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    CAMPAIGN {
        uuid id PK
        string title
        string slug UK
        string description
        string category
        string imageUrl
        decimal goalAmount
        decimal collectedAmount
        timestamp startDate
        timestamp endDate
        enum status "ACTIVE | COMPLETED | PAUSED | ARCHIVED"
        timestamp createdAt
        timestamp updatedAt
    }

    SCHEME {
        uuid id PK
        string schemeCode UK
        string name
        string nameHi
        string slug UK
        string category
        string need
        string description
        string descriptionHi
        string benefit
        string benefitHi
        json eligibilityRules
        json requiredDocuments
        json applicationSteps
        json applicableDistricts
        string officialSourceUrl
        json nearestHelpCentre
        timestamp lastCheckedAt
        enum status "DRAFT | PUBLISHED | ARCHIVED"
        timestamp createdAt
        timestamp updatedAt
    }

    DONATION {
        uuid id PK
        uuid donorId FK "nullable"
        uuid campaignId FK
        decimal amount
        string currency "INR"
        enum donationType "ONE_TIME | MONTHLY"
        enum status "PENDING | SUCCESS | FAILED"
        string idempotencyKey UK
        string paymentReference
        string paymentMethod
        string donorName
        string donorEmail
        string donorPhone
        string donorPAN
        string donorAddress
        timestamp createdAt
        timestamp updatedAt
    }

    PAYMENT {
        uuid id PK
        uuid donationId FK
        string provider
        string transactionReference UK
        enum status "PENDING | SUCCESS | FAILED"
        json responseMetadata
        timestamp createdAt
    }

    RECEIPT {
        uuid id PK
        uuid donationId FK UK
        string receiptNumber UK
        string donorName
        string donorPAN
        decimal donationAmount
        string trustPAN
        string trust80GRegistrationNumber
        string financialYear
        string pdfStorageKey
        string pdfPath
        timestamp issuedAt
    }

    RECEIPT_SEQUENCE {
        uuid id PK
        string financialYear UK
        int nextNumber
        timestamp updatedAt
    }

    AI_REVIEW {
        uuid id PK
        uuid schemeId FK
        string generatedHindiSummary
        string generatedEnglishSummary
        json missingInformation
        enum status "PENDING | APPROVED | REJECTED"
        uuid reviewedById FK "nullable"
        timestamp reviewedAt
        timestamp createdAt
        timestamp updatedAt
    }

    AUDIT_LOG {
        uuid id PK
        uuid userId FK "nullable"
        string action
        string entityType
        string entityId
        json metadata
        timestamp createdAt
    }

    HELP_REQUEST {
        uuid id PK
        string name
        string phone
        string district
        string schemeCode
        string notes
        enum status "PENDING | CONTACTED | RESOLVED"
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## 3. Table Schemas and Constraints

### 3.1 `User`
- **id**: `UUID`, Primary Key.
- **email**: `VARCHAR(255)`, Unique, Indexed.
- **passwordHash**: `VARCHAR(255)` (bcrypt hash with 10 salt rounds).
- **role**: Enum (`DONOR`, `ADMIN`).
- **preferredLanguage**: Enum (`EN`, `HI`).
- **isActive**: `BOOLEAN`, default `true`.

### 3.2 `Campaign`
- **id**: `UUID`, Primary Key.
- **slug**: `VARCHAR(255)`, Unique, Indexed.
- **goalAmount**: `Decimal(12, 2)`, strictly positive.
- **collectedAmount**: `Decimal(12, 2)`, incremented transactionally upon successful payment.
- **status**: Enum (`ACTIVE`, `COMPLETED`, `PAUSED`, `ARCHIVED`).

### 3.3 `Scheme`
- **schemeCode**: `VARCHAR(50)`, Unique, Indexed (e.g. `SCH-014`, `SCH-022`, `SCH-031`).
- **slug**: `VARCHAR(255)`, Unique, Indexed.
- **eligibilityRules**: `JSONB` containing deterministic rule boundaries (`minAge`, `maxAge`, `maritalStatus`, `requiresBPL`, `requiresSHG`).
- **requiredDocuments**: `JSONB` array of required verification items.
- **applicableDistricts**: `JSONB` array of districts (e.g., 9 Madhya Pradesh districts).
- **status**: Enum (`DRAFT`, `PUBLISHED`, `ARCHIVED`). Indexed on `(status, category)`.

### 3.4 `Donation`
- **amount**: `Decimal(12, 2)`.
- **idempotencyKey**: `VARCHAR(255)`, Unique. Prevents duplicate records on network retries.
- **donorPAN**: `VARCHAR(10)`. Formatted per Indian ITD rules (`[A-Z]{5}[0-9]{4}[A-Z]{1}`). Masked for display.
- **status**: Enum (`PENDING`, `SUCCESS`, `FAILED`). Indexed.

### 3.5 `Receipt`
- **donationId**: `UUID`, Unique, Foreign Key (`Donation.id`, `onDelete: Restrict`).
- **receiptNumber**: `VARCHAR(50)`, Unique, Indexed. Format: `SAKHI/80G/YYYY-YY/XXXXXX`.
- **donorName**: Immutable string snapshot at issuance.
- **donorPAN**: Immutable string snapshot at issuance.
- **donationAmount**: `Decimal(12, 2)` snapshot.
- **trustPAN**: Snapshotted trust PAN (`AAATC1234D`).
- **trust80GRegistrationNumber**: Snapshotted 80G registration (`CIT(E)/BPL/80G/2021-22/A-1089`).
- **financialYear**: Indian financial year (e.g., `2026-27`).

### 3.6 `ReceiptSequence`
- **financialYear**: `VARCHAR(10)`, Unique (e.g. `2026-27`).
- **nextNumber**: `INT`, atomically incremented via PostgreSQL:
  ```sql
  INSERT INTO "ReceiptSequence" ("id", "financialYear", "nextNumber", "updatedAt")
  VALUES (gen_random_uuid()::text, $1, 1, NOW())
  ON CONFLICT ("financialYear") DO UPDATE
  SET "nextNumber" = "ReceiptSequence"."nextNumber" + 1, "updatedAt" = NOW()
  RETURNING "id", "financialYear", "nextNumber";
  ```

---

## 4. Indexing Strategy

| Table | Index Columns | Purpose |
|---|---|---|
| `User` | `email` | Fast O(1) login lookup |
| `User` | `role` | Role-based filtering |
| `Scheme` | `slug` | Public URL routing |
| `Scheme` | `schemeCode` | CMS and eligibility code matching |
| `Scheme` | `status, category` | Multi-column filter for public listing |
| `Campaign` | `status` | Filter active campaigns |
| `Campaign` | `slug` | Public campaign routing |
| `Donation` | `donorId` | Fast donor portal history fetch |
| `Donation` | `campaignId` | Campaign donor count aggregation |
| `Donation` | `status, createdAt` | Dashboard analytics & admin listing |
| `Donation` | `idempotencyKey` | Duplicate request prevention |
| `Receipt` | `receiptNumber` | Unique verification and receipt lookup |
| `Receipt` | `financialYear` | Form 10BD annual statement compilation |
| `AIReview` | `schemeId, status` | Review desk queue filtering |
