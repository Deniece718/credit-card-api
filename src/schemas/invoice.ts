import { z } from 'zod';

export const createInvoiceSchema = z.object({
  companyId: z.string(),
  cardId: z.string(),
  amount: z.number(),
  isPais: z.boolean().optional(),
  createdAt: z.string().optional(),
  dueDate: z.string().optional(),
});

export const payInoviceSchema = z.object({
  amount: z.number(),
});
