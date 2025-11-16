import { z } from 'zod';

export const createCardSchema = z.object({
  cardNumber: z.string(),
  companyId: z.string(),
  expirationDate: z.string(),
  creditLimit: z.number(),
  isActivated: z.boolean(),
});

export const cardLimitSchema = z.object({
  newLimit: z.number(),
});
