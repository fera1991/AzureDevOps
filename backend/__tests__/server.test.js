const request = require('supertest');
const { app, client } = require('../server');

let server;

let messageId;

beforeAll(async () => {
  // Iniciar el servidor
  server = app.listen(5000);
  // Conectar a la base de datos
  await client.connect();
});

afterAll(async () => {
  // Cerrar el servidor
  await server.close();
  // Cerrar la conexión a la base de datos
  await client.close();
});

describe('API Endpoints', () => {
  it('should get all messages', async () => {
    const res = await request(server).get('/api/messages');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('length');
  });

  it('should create a new message', async () => {
    const res = await request(server)
      .post('/api/messages')
      .send({ message: 'Test message' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('message', 'Test message');

    // Guardar el _id del mensaje creado 
    messageId = res.body._id;
  });

  it('should delete a message', async () => {
    const res = await request(server).delete(`/api/messages/${messageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Mensaje eliminado exitosamente');
  });
});
