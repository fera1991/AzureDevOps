const request = require('supertest');
const express = require('express');
const app = express();

// Setup de prueba básica para Jest y Supertest
describe('API Endpoints', () => {
  it('should get all messages', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('length');
  });

  it('should create a new message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        message: 'Test message'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('message', 'Test message');
  });

  it('should delete a message', async () => {
    const messageId = 'some-test-id';
    const res = await request(app).delete(`/api/messages/${messageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Mensaje eliminado exitosamente');
  });
});
