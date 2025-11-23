import request from 'supertest';
import { app } from '../src/server';

describe('Customers API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@firelinksystem.com',
        password: 'password'
      });
    
    authToken = response.body.token;
  });

  it('should get customers list', async () => {
    const response = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should create a new customer', async () => {
    const customerData = {
      companyName: 'Test Company Ltd',
      contactName: 'Test Contact',
      email: 'test@company.com',
      phone: '+441234567890',
      address: '123 Test Street, London',
      postcode: 'SW1A 1AA',
      vatNumber: 'GB123456789'
    };

    const response = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${authToken}`)
      .send(customerData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.companyName).toBe(customerData.companyName);
  });
});
