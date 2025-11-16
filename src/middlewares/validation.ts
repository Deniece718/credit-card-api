import { ZodError } from 'zod';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate =
  (schema: z.ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => ({
          message: `${e.path.join('.')} is ${e.message}`,
        }));
        res.status(400).json({ error: ERROR_MESSAGES.INVALID_DATA, details: errorMessages });
      } else {
        res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
      }
    }
  };
