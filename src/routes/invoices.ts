import { Router, Request, Response } from 'express';
import Invoice from '../models/invoice';
import { createInvoiceSchema, payInoviceSchema } from '../schemas/invoice';
import { validate } from '../middlewares/validation';

const router = Router();

router.post('/', validate(createInvoiceSchema), async (req: Request, res: Response) => {
  const currentDate = new Date();
  const { companyId, cardId, amount, isPaid, creatdAt, dueDate } = req.body;
  const newInvoice = new Invoice({
    companyId,
    cardId,
    amount,
    isPaid: isPaid ?? false,
    creatdAt: creatdAt ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    dueDate: dueDate ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 28),
  });

  await newInvoice.save();

  res.status(200).json({
    message: 'Added invoice successfully',
    data: newInvoice,
  });
});

router.get('/', async (req: Request, res: Response) => {
  const invoices = await Invoice.find();

  return res.status(200).json({
    message: 'Successfully fetched all invoices',
    data: invoices,
  });
});

router.get('/:invoiceId', async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;
  const invoice = await Invoice.findById(invoiceId);

  return res.status(200).json({
    message: 'Successfully fetched invoice',
    data: invoice,
  });
});

//TODO: Consider full/partial pay invoice
router.patch('/:invoiceId', validate(payInoviceSchema), async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId;
  const { amount } = req.body;

  const invoiceDoc = await Invoice.findById(invoiceId);
  if (invoiceDoc?.isPaid || !invoiceDoc) {
    return res.status(404).json({
      message: 'Invoice is already paid or not exist',
    });
  }

  if (amount > invoiceDoc.amount) {
    return res.status(400).json({
      message: 'Paid amount exceeds invoice amount',
    });
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    amount === invoiceDoc?.amount ? { isPaid: true } : { amount: invoiceDoc.amount - amount },
    { new: true },
  );

  res.status(201).json({
    message: 'Invoices was paid successfully',
    data: updatedInvoice,
  });
});

export default router;

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyId, cardId, amount, createdAt, dueDate]
 *             properties:
 *               companyId:
 *                 type: string
 *                 example: '6913ad0a76d41eb129f78077'
 *               cardId:
 *                 type: string
 *                 example: '6913a78345e9890b855e3f59'
 *               amount:
 *                 type: number
 *                 example: 8000
 *               isPaid:
 *                 type: boolean
 *                 default: false
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-09-02T00:00:00.000Z'
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-09-28T00:00:00.000Z'
 *     responses:
 *       200:
 *         description: Added invoice successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Successfully fetched all invoices
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
 *
 *
 * /api/invoices/{invoiceId}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invoice to fetch
 *     responses:
 *       200:
 *         description: Successfully fetched invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *
 *   patch:
 *     summary: Pay an invoice (full or partial)
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 200
 *                 description: Amount being paid toward the invoice
 *     responses:
 *       201:
 *         description: Invoice was paid successfully (fully or partially)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Paid amount exceeds invoice amount
 *       404:
 *         description: Invoice does not exist or is already paid
 */
