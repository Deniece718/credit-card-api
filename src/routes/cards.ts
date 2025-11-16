import { Router, Request, Response } from 'express';
import Card from '../models/card';
import Transaction from '../models/transaction';
import Invoice from '../models/invoice';
import { validate } from '../middlewares/validation';
import { cardLimitSchema, createCardSchema } from '../schemas/card';

const router = Router();

router.post('/', validate(createCardSchema), async(req: Request, res: Response) => {
    try {
        const { cardNumber, companyId, expirationDate, creditLimit, isActivated } = req.body;
        const newCard = new Card({
            cardNumber,
            companyId,
            expirationDate,
            creditLimit,
            isActivated,
        });

        const savedCard = await newCard.save();
        
        return res.status(200).json({
            message: 'Card created successfully',
            data: savedCard,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',   
        });
    }
});

router.get('/:cardId', async(req: Request, res: Response) => {
    try {
        const cardId = req.params.cardId;
        const cardDoc = await Card.findById(cardId);
        if (!cardDoc) {
            return res.status(404).json({
                message: 'Card not found',
            });
        }
            
        return res.status(200).json({
            message: 'Successfully fetched card',
            data: cardDoc,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
});

router.patch('/:cardId/limit', validate(cardLimitSchema), async(req: Request, res: Response) => {
    try {
        const cardId = req.params.cardId;
        const { newLimit } = req.body;
        const cardDoc = await Card.findByIdAndUpdate(cardId, { creditLimit: newLimit }, { new: true });
        
        return res.status(201).json({
            message: 'Successfully update card limit',
            data: cardDoc,
        });
    } catch (error) {
         return res.status(500).json({
            message: 'Internal server error',
        });
    }
});

router.patch('/:cardId/state', async(req: Request & { query: { isActivated: boolean}}, res: Response) => {
    try {
        const cardId = req.params.cardId;
        const { isActivated } = req.query;
        const cardDoc = await Card.findByIdAndUpdate(cardId, { isActivated }, { new: true });
        
        return res.status(201).json({
            message: 'Successfully update card state',
            data: cardDoc,
        });
    } catch (error) {
         return res.status(500).json({
            message: 'Internal server error',
        });
    }
});

router.get('/:cardId/invoices', async(req: Request, res: Response) => {
    try {
        const cardId = req.params.cardId;
        const invoices = await Invoice.find({ cardId });
        res.status(200).json({
            message: 'Fetched invoices successfully',
            data: invoices,
        });
    } catch (error) {
         return res.status(500).json({
            message: 'Internal server error',
        });
    }
    
})

router.get('/:cardId/transactions', async(req: Request, res: Response) => {
    try {
        const cardId = req.params.cardId;
        const transactions = await Transaction.find({cardId});
        res.status(200).json({
            message: 'Fetched transactions successfully',
            data: transactions,
        });
    } catch (error) {
         return res.status(500).json({
            message: 'Internal server error',
        });
    }
    
});

export default router;

/**
 * @swagger
 * /api/cards/{cardId}:
 *   get:
 *     summary: Get card by ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         schema:
 *           type: string
 *         required: true
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card fetched successfully
 *       404:
 *         description: Card not found
 * 
 * /api/cards/{cardId}/limit:
 *   patch:
 *     summary: Update card spending limit
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newLimit:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Successfully updated card limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       500:
 *         description: Internal server error
 * 
 * /api/cards/{cardId}/state:
 *   patch:
 *     summary: Update card activation state
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActivated
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Whether the card should be activated (true) or deactivated (false)
 *     responses:
 *       201:
 *         description: Successfully updated activation state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       500:
 *         description: Internal server error*
 * 
 * /api/cards/{cardId}/invoices:
 *   get:
 *     summary: Get all invoices for a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
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
 *       500:
 *         description: Internal server error
 * 
 * /api/cards/{cardId}/transactions:
 *   get:
 *     summary: Get all transactions for a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched transactions
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
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Internal server error
 */
