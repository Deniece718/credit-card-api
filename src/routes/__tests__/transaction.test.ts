import request from 'supertest';
import { app } from '../../app';
import Transaction from '../../models/transaction';

jest.spyOn(Transaction.prototype, 'save').mockImplementation(() => Promise.resolve());
jest.spyOn(Transaction, 'findById').mockImplementation(
  () =>
    Promise.resolve(
      {
        _id: '6914b4a2f3a6e5eb19c86cda',
        cardId: '6913a78345e9890b855e3f59',
        description: 'AWS',
        isPaid: false,
        amount: 5000,
        date: new Date('2025-11-02').toISOString(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
);

describe('Transactions API', () => {
  const transactionId = '6914b4a2f3a6e5eb19c86cda';

  it('should add a new transaction', async () => {
    const res = await request(app).post('/api/transactions').send({
      cardId: '6913a78345e9890b855e3f59',
      amount: -2000,
      description: 'AWS',
      date: new Date().toISOString(),
    });

    expect(res.statusCode).toBe(200);
  });

  it('should get a transaction by ID', async () => {
    const res = await request(app).get(`/api/transactions/${transactionId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.amount).toBe(5000);
  });
});
