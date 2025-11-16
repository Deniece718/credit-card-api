import { z } from 'zod';

export const createInvoiceSchema = z.object({
    companyId: z.string(),
    cardId: z.string(),
    amount: z.number(),
    isPais: z.boolean().optional(),
    createdAt: z.date().optional(),
    dueDate: z.date().optional(),
})

export const payInoviceSchema = z.object({
    amount: z.number(),
})
