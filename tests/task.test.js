const supertest = require('supertest');
const app = require('../app'); // Adjust the path to your app.js file
const request = supertest(app);

describe('Task API', () => {
  it('GET /tasks — should return all tasks', async () => {
    const response = await request.get('/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  // Add more tests for POST, PUT, DELETE...
});
