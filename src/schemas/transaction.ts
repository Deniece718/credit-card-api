import { z } from 'zod';

export const createTransactionSchema = z.object({
  cardId: z.string(),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
});
