const listen = require('test-listen');
const handler = require('./helloWorld');
jest.dontMock('node-fetch');
const fetch = require('node-fetch');

afterAll(() => jest.mock('node-fetch'));

test('service returns "hello world"', async () => {
  try {
    const endpoint = await listen(handler);
    const response = await fetch(endpoint);
    const body = await response.text();

    expect(response).toHaveProperty('status', 200);
    expect(body).toBe('hello world');
  } catch (e) {
    console.error(e);
    return Promise.reject('Failed to make request');
  }
});
