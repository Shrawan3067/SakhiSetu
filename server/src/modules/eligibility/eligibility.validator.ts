import { z } from 'zod';

export const eligibilityMatchSchema = z.object({
  body: z.object({
    district: z.string().min(1, 'District is required'),
    age: z.number().int().min(14, 'Age must be at least 14').max(100, 'Age must be valid'),
    occupation: z.string().min(1, 'Occupation is required'),
    maritalStatus: z.enum(['unmarried', 'married', 'widowed', 'divorced']),
    isSHGMember: z.boolean(),
    hasBPLCard: z.boolean(),
    isPregnantOrNewMother: z.boolean().optional().default(false),
  }),
});

export const callbackRequestSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Valid 10-digit phone number is required'),
    district: z.string().min(1, 'District is required'),
    schemeCode: z.string().optional(),
    notes: z.string().optional(),
  }),
});
