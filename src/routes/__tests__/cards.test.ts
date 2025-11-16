import request from 'supertest';
import { app } from '../../app';
import Card from '../../models/card';
import Invoice from '../../models/invoice';
import Transaction from '../../models/transaction';

const findCardMock = jest.spyOn(Card, 'findById').mockImplementation(() => Promise.resolve(
    {
      _id: '6913a78345e9890b855e3f59',
      companyId: '6913ad0a76d41eb129f78077',
      cardNumber: '123456789',
      creditLimit: 10000,
      isActivated: true,
      expirationDate: new Date('2025-12-31'),
    }
  ) as any
)
const updateCardMock = jest.spyOn(Card, 'findByIdAndUpdate').mockImplementation(() => Promise.resolve(
    {
      _id: '6913a78345e9890b855e3f59',
      companyId: '6913ad0a76d41eb129f78077',
      cardNumber: '123456789',
      creditLimit: 20000,
      isActivated: true,
      expirationDate: new Date('2025-12-31'),
    }
   ) as any
)
const findInvoiceMock = jest.spyOn(Invoice, 'find').mockImplementation(() => Promise.resolve(
    [
      {
        _id: '6913b9881ecb981dd22cf349',
        companyId: '6913ad0a76d41eb129f78077',
        cardId: '6913a78345e9890b855e3f59',
        isPaid: true,
        amount: 10000,
        createdAt: new Date('2025-09-02'),
        dueDate: new Date('2025-09-28'),
      },
      {
        _id: '6913b9881ecb981dd22cf349',
        companyId: '6913ad0a76d41eb129f78077',
        cardId: '6913a78345e9890b855e3f59',
        isPaid: false,
        amount: 15000,
        createdAt: new Date('2025-10-02'),
        dueDate: new Date('2025-10-28'),
      }
    ]
   ) as any
)
const findTransactionMock = jest.spyOn(Transaction, 'find').mockImplementation(() => Promise.resolve(
    [
      {
        _id: '6914b4a2f3a6e5eb19c86cda',
        cardId: '6913a78345e9890b855e3f59',
        amount: -2000,
        description: 'AWS',
        date: new Date('2025-11-15'),
      },
    ]
   ) as any
)
      
describe('Cards API', () => {
  const cardId = '6913a78345e9890b855e3f59';

  it('should fetch card by ID', async () => {
    const res = await request(app).get(`/api/cards/${cardId}`);

    expect(res.statusCode).toBe(200);
    expect(findCardMock).toHaveBeenCalledTimes(1);
    expect(findCardMock).toHaveBeenCalledWith(cardId);
    expect(res.body.data.cardNumber).toBe('123456789');
  });

  it('should update card limit by ID', async () => {
    const res = await request(app).patch(`/api/cards/${cardId}/limit`).send({newLimit: 20000});

    expect(res.statusCode).toBe(201);
    expect(updateCardMock).toHaveBeenCalledTimes(1);
    expect(updateCardMock).toHaveBeenCalledWith(cardId, {creditLimit: 20000}, {new: true});
    expect(res.body.data.creditLimit).toBe(20000);
  });

  it('should fetch card invoices by ID', async () => {
    const res = await request(app).get(`/api/cards/${cardId}/invoices`);

    expect(res.statusCode).toBe(200);
    expect(findInvoiceMock).toHaveBeenCalledTimes(1);
    expect(findInvoiceMock).toHaveBeenCalledWith({cardId});
    expect(res.body.data.length).toBe(2);
  })

  it('should fetch card transaction by ID', async () => {
    const res = await request(app).get(`/api/cards/${cardId}/transactions`);

    expect(res.statusCode).toBe(200);
    expect(findTransactionMock).toHaveBeenCalledTimes(1);
    expect(findTransactionMock).toHaveBeenCalledWith({cardId});
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].description).toBe('AWS');
  })
});

