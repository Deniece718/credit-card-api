import { Router, Request, Response } from 'express';
import Transaction from '../models/transaction';
import { validate } from '../middlewares/validation';
import { createTransactionSchema } from '../schemas/transaction';

const router = Router();

router.post('/', validate(createTransactionSchema), async(req: Request, res: Response) => {
    const { cardId, amount, description, date } = req.body;
    const newTransaction = new Transaction({
        cardId,
        amount,
        description,
        date,
    });
    //TODO: Consider after adding the new transaction if exceeding the current month spending limit
    await newTransaction.save();

    res.status(200).json({
        message: 'Added transaction successfully',
        data: newTransaction,
    });
});

router.get('/:transactionId', async(req: Request, res: Response) => {
    const transactionId = req.params.transactionId;
    const transaction = await Transaction.findById(transactionId);
    
    res.status(200).json({
        message: 'Successfully fetched transaction',
        data: transaction,
    });
});

export default router;

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cardId, amount, description, date]
 *             properties:
 *               cardId:
 *                 type: string
 *                 example: '6913a78345e9890b855e3f59'
 *               amount:
 *                 type: number
 *                 example: -5000
 *               description:
 *                 type: string
 *                 example: 'AWS'
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-10-18T12:30:00.000Z'
 *     responses:
 *       200:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input or validation failed
 *       500:
 *         description: Internal server error
 * 
 * /api/transactions/{transactionId}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to fetch
 *         example: '6914b4a2f3a6e5eb19c86cda'
 *     responses:
 *       200:
 *         description: Successfully fetched transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched transaction
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             example:
 *               message: 'Transaction not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: 'Internal server error'
 */
