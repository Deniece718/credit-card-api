import request from 'supertest';
import { app } from '../../app';
import User from '../../models/user';

jest.spyOn(User.prototype, 'save').mockImplementation(() => Promise.resolve());
jest.spyOn(User, 'findOne').mockImplementation(
  () =>
    Promise.resolve(
      {
        _id: 'abc',
        email: 'new@email.com',
        validatePassword: () => {
          return true;
        },
        companies: [],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
);

describe('User API', () => {
  it('should signup a user', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'new@email.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.userId).toBeDefined();
  });

  it('should signin a user', async () => {
    const res = await request(app).post('/api/users/signin').send({
      email: 'new@email.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.userId).toBeDefined();
  });
});
