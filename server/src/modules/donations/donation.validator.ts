import { z } from 'zod';

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const createDonationSchema = z.object({
  body: z.object({
    campaignId: z.string().uuid('Please select a valid campaign'),
    amount: z.number().min(100, 'Minimum donation amount is ₹100'),
    donationType: z.enum(['ONE_TIME', 'MONTHLY']).default('ONE_TIME'),
    donorName: z.string().min(2, 'Full name is required'),
    donorEmail: z.string().email('Please enter a valid email address'),
    donorPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
    donorPAN: z
      .string()
      .trim()
      .toUpperCase()
      .regex(PAN_REGEX, 'Please enter a valid 10-character Indian PAN (e.g. ABCDE1234F)'),
    donorAddress: z.string().min(5, 'Full postal address is required for 80G tax receipt compliance'),
    idempotencyKey: z.string().optional(),
    isForeignCard: z.boolean().optional().default(false),
  }),
});

export const processPaymentSchema = z.object({
  body: z.object({
    donationId: z.string().uuid('Valid donation ID is required'),
    method: z.enum(['UPI', 'CARD', 'NET_BANKING']),
    outcome: z.enum(['SUCCESS', 'FAILED', 'PENDING']).default('SUCCESS'),
    isForeignCard: z.boolean().optional().default(false),
  }),
});

