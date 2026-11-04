-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DONOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'HI');

-- CreateEnum
CREATE TYPE "SchemeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('ONE_TIME', 'MONTHLY');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "AIReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "HelpRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DONOR',
    "preferredLanguage" "Language" NOT NULL DEFAULT 'HI',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "goalAmount" DECIMAL(12,2) NOT NULL,
    "collectedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheme" (
    "id" TEXT NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameHi" TEXT,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "need" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionHi" TEXT,
    "benefit" TEXT NOT NULL,
    "benefitHi" TEXT,
    "eligibilityRules" JSONB NOT NULL,
    "requiredDocuments" JSONB NOT NULL,
    "applicationSteps" JSONB NOT NULL,
    "applicableDistricts" JSONB NOT NULL,
    "officialSourceUrl" TEXT NOT NULL,
    "nearestHelpCentre" JSONB NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL,
    "status" "SchemeStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "donorId" TEXT,
    "campaignId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "donationType" "DonationType" NOT NULL DEFAULT 'ONE_TIME',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "idempotencyKey" TEXT,
    "paymentReference" TEXT,
    "paymentMethod" TEXT,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "donorPAN" TEXT NOT NULL,
    "donorAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'MOCK_PAYMENT_SIMULATOR',
    "transactionReference" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "responseMetadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorPAN" TEXT NOT NULL,
    "donationAmount" DECIMAL(12,2) NOT NULL,
    "trustPAN" TEXT NOT NULL,
    "trust80GRegistrationNumber" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "pdfStorageKey" TEXT,
    "pdfPath" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptSequence" (
    "id" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "nextNumber" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIReview" (
    "id" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "generatedHindiSummary" TEXT NOT NULL,
    "generatedEnglishSummary" TEXT NOT NULL,
    "missingInformation" JSONB,
    "status" "AIReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "schemeCode" TEXT,
    "notes" TEXT,
    "status" "HelpRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_slug_idx" ON "Campaign"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Scheme_schemeCode_key" ON "Scheme"("schemeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Scheme_slug_key" ON "Scheme"("slug");

-- CreateIndex
CREATE INDEX "Scheme_status_category_idx" ON "Scheme"("status", "category");

-- CreateIndex
CREATE INDEX "Scheme_slug_idx" ON "Scheme"("slug");

-- CreateIndex
CREATE INDEX "Scheme_schemeCode_idx" ON "Scheme"("schemeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_idempotencyKey_key" ON "Donation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId");

-- CreateIndex
CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

-- CreateIndex
CREATE INDEX "Donation_idempotencyKey_idx" ON "Donation"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionReference_key" ON "Payment"("transactionReference");

-- CreateIndex
CREATE INDEX "Payment_donationId_idx" ON "Payment"("donationId");

-- CreateIndex
CREATE INDEX "Payment_transactionReference_idx" ON "Payment"("transactionReference");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_donationId_key" ON "Receipt"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "Receipt_receiptNumber_idx" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "Receipt_financialYear_idx" ON "Receipt"("financialYear");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptSequence_financialYear_key" ON "ReceiptSequence"("financialYear");

-- CreateIndex
CREATE INDEX "AIReview_schemeId_idx" ON "AIReview"("schemeId");

-- CreateIndex
CREATE INDEX "AIReview_status_idx" ON "AIReview"("status");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "HelpRequest_status_idx" ON "HelpRequest"("status");

-- CreateIndex
CREATE INDEX "HelpRequest_createdAt_idx" ON "HelpRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReview" ADD CONSTRAINT "AIReview_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReview" ADD CONSTRAINT "AIReview_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
