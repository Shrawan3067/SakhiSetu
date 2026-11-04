import { Prisma, PrismaClient } from '@prisma/client';
import { getFinancialYear } from '../../utils/financial-year.js';

export class ReceiptSequenceService {
  /**
   * Concurrency-safe atomic allocation of the next receipt number for the given financial year.
   * Uses PostgreSQL UPDATE ... RETURNING inside a database transaction to prevent race conditions.
   */
  async allocateNextReceiptNumber(
    tx: Prisma.TransactionClient,
    targetDate: Date = new Date()
  ): Promise<{ receiptNumber: string; financialYear: string; sequenceNumber: number }> {
    const financialYear = getFinancialYear(targetDate);

    // Atomic increment using raw query or upsert with optimistic/pessimistic lock.
    // In PostgreSQL: UPDATE "ReceiptSequence" SET "nextNumber" = "nextNumber" + 1 WHERE "financialYear" = $1 RETURNING "nextNumber"
    // First, ensure the row exists for this financial year:
    const seqRow = await tx.$queryRaw<Array<{ id: string; financialYear: string; nextNumber: number }>>`
      INSERT INTO "ReceiptSequence" ("id", "financialYear", "nextNumber", "updatedAt")
      VALUES (gen_random_uuid()::text, ${financialYear}, 1, NOW())
      ON CONFLICT ("financialYear") DO UPDATE
      SET "nextNumber" = "ReceiptSequence"."nextNumber" + 1, "updatedAt" = NOW()
      RETURNING "id", "financialYear", "nextNumber"
    `;

    const allocated = seqRow[0];
    const sequenceNumber = allocated.nextNumber;
    const padded = String(sequenceNumber).padStart(6, '0');
    const receiptNumber = `SAKHI/80G/${financialYear}/${padded}`;

    return {
      receiptNumber,
      financialYear,
      sequenceNumber,
    };
  }
}

export const receiptSequenceService = new ReceiptSequenceService();
