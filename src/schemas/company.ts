import { z } from 'zod';

export const createCompanySchema = z.object({
  userId: z.string(),
  companyName: z.string(),
});
