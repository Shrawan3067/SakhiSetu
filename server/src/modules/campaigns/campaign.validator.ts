import { z } from 'zod';

export const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    category: z.string().min(2, 'Category is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url().optional(),
    goalAmount: z.number().positive('Goal amount must be greater than zero'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED']).optional().default('ACTIVE'),
  }),
});

export const updateCampaignSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    goalAmount: z.number().positive().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED']).optional(),
  }),
});
