import { Router, Request, Response } from 'express';
import Company from '../models/company';
import Card from '../models/card';
import Transaction from '../models/transaction';
import Invoice from '../models/invoice';
import { CardData, TransactionData } from '../types';
import { now } from 'mongoose';
import { createCompanySchema } from '../schemas/company';
import { validate } from '../middlewares/validation';

const router = Router();

router.post('/', validate(createCompanySchema), async (req: Request, res: Response) => {
  const { userId, companyName } = req.body;

  const newCompany = new Company({
    userId,
    companyName,
  });

  const savedCompany = await newCompany.save();

  return res.status(200).json({
    message: 'Company created successfully',
    data: savedCompany,
  });
});

router.get('/', async (_req: Request, res: Response) => {
  const companies = await Company.find();

  return res.status(200).json({
    message: 'Successfully fetched companies',
    data: companies,
  });
});

router.get('/:companyId', async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const company = await Company.findById(companyId);

  return res.status(200).json({
    message: 'Successfully fetched company',
    data: company,
  });
});

router.get('/:companyId/cards/allData', async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const cards = await Card.find({ companyId });
  const currentMonth = now().getMonth();
  const currentYear = now().getFullYear();
  const cardsData: CardData[] = [];

  await Promise.all(
    cards.map(async (card) => {
      const transactions = (await Transaction.find({ cardId: card.id })).map(
        (transaction) =>
          ({
            id: transaction._id,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
          }) as TransactionData,
      );

      const currentMonthTransactions = transactions.filter((txn) => {
        const txnDate = new Date(txn.date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
      });

      cardsData.push({
        id: card._id,
        isActivated: card.isActivated,
        cardNumber: card.cardNumber,
        expirationDate: card.expirationDate,
        remainingSpend: {
          used: currentMonthTransactions.reduce(
            (sum, txn) => sum - Math.abs(txn.amount),
            card.creditLimit,
          ),
          limit: card.creditLimit,
        },
        transactions,
      } as unknown as CardData);
    }),
  );

  return res.status(200).json({
    message: 'Successfully fetched company',
    data: cardsData,
  });
});

router.get('/:companyId/cards', async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const card = await Card.find({ companyId });

  return res.status(200).json({
    message: 'Successfully fetched company card',
    data: card,
  });
});

router.get('/:companyId/invoices', async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const invoices = await Invoice.find({ companyId });
  res.status(200).json({
    message: 'Fetched invoices successfully',
    data: invoices,
  });
});

export default router;

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Successfully fetched companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, name]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: '65fb129df2a1b52aa0438c11'
 *               companyName:
 *                 type: string
 *                 example: 'Company ABC'
 *     responses:
 *       200:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid request payload
 *
 * /api/companies/{companyId}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *
 * /api/companies/{companyId}/cards/allData:
 *   get:
 *     summary: Get all cards for a company with spending information
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched company cards with calculated spending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CardData'
 *
 * /api/companies/{companyId}/cards:
 *   get:
 *     summary: Get company card(s)
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched cards for the company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Card'
 *
 * /api/companies/{companyId}/invoices:
 *   get:
 *     summary: Get all invoices for a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 */
