import request from 'supertest';
import { app } from '../../app';
import Company from '../../models/company';

//TODO: more testing cover
jest.spyOn(Company.prototype, 'save').mockImplementation(() => Promise.resolve());
jest.spyOn(Company, 'findById').mockImplementation(() => Promise.resolve(
  {
    userId: '6913acc476d41eb129f78075',
    companyName: 'Test Company',
  }
) as any
);

describe('Companies API', () => {
  const companyId = '6913ad0a76d41eb129f78077';
  it('should create company', async () => {
    const res = await request(app)
      .post('/api/companies')
      .send({
        userId: '6913acc476d41eb129f78075',
        companyName: 'Test Company'
      });

    expect(res.statusCode).toBe(200);
  });

  it('should fetch company by ID', async () => {
    const res = await request(app).get(`/api/companies/${companyId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.companyName).toBe('Test Company');
  })
});
