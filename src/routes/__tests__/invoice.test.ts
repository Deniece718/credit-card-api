import request from 'supertest';
import { app } from '../../app';
import Invoice from '../../models/invoice';

jest.spyOn(Invoice.prototype, 'save').mockImplementation(() => Promise.resolve());
jest.spyOn(Invoice, 'findById').mockImplementation(
  () =>
    Promise.resolve(
      {
        _id: '6913b9881ecb981dd22cf349',
        companyId: '6913ad0a76d41eb129f78077',
        cardId: '6913a78345e9890b855e3f59',
        isPaid: false,
        amount: 10000,
        createdAt: new Date('2025-09-02'),
        dueDate: new Date('2025-09-28'),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
);

describe('Invoices API', () => {
  const invoiceId = '6913b9881ecb981dd22cf349';

  it('should add a new invoice', async () => {
    const res = await request(app).post(`/api/invoices`).send({
      companyId: '6913ad0a76d41eb129f78077',
      cardId: '6913a78345e9890b855e3f59',
      amount: 10000,
    });

    expect(res.statusCode).toBe(200);
  });

  it('should fetch a invoice by ID', async () => {
    const res = await request(app).get(`/api/invoices/${invoiceId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.amount).toBe(10000);
  });
});
