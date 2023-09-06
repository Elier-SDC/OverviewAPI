/* eslint-disable no-undef */
const request = require('supertest');
const app = require('./testServer');
const db = require('../db');

const server = app.listen(3000);

afterAll(() => {
  server.close();
  db.close();
});

describe('Tests are running properly', () => {
  test('responds to /test', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(200);
  });
});

describe('The server routes correctly', () => {
  test('responds to /api/products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });

  test('responds to /api/products/:product_id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
  });

  test('responds to /api/products/:product_id/styles', async () => {
    const res = await request(app).get('/api/products/1/styles');
    expect(res.statusCode).toBe(200);
  });

  test('responds to /api/products/:product_id/related', async () => {
    const res = await request(app).get('/api/products/1/related');
    expect(res.statusCode).toBe(200);
  });
});

describe('The model returns the correct shape of data', () => {
  test('styles returns an object with product_id and results', async () => {
    const testId = '1';
    const res = await request(app).get(`/api/products/${testId}/styles`);
    expect(typeof res._body).toBe('object');
    expect(res._body.product_id).toBe(testId);
    expect(Array.isArray(res._body.results)).toBeTruthy();
    expect(res.statusCode).toBe(200);
  });

  test('styles returns an object with the correct shape', async () => {
    const testId = '1';
    const topKeys = ['product_id', 'results'];
    const resultKeys = ['style_id', 'name', 'original_price', 'sale_price', 'default?', 'photos', 'skus'];
    const photoKeys = ['url', 'thumbnail_url'];
    const skusKeys = ['quantity', 'size'];

    const compareKeys = (array1, array2) => array1.some((key) => array2.includes(key));

    const res = await request(app).get(`/api/products/${testId}/styles`);
    const firstSku = Object.keys(res._body.results[0].skus)[0];

    expect(compareKeys(Object.keys(res._body), topKeys)).toBeTruthy();
    expect(compareKeys(Object.keys(res._body.results[0]), resultKeys)).toBeTruthy();
    expect(Array.isArray(res._body.results[0].photos)).toBeTruthy();
    expect(compareKeys(Object.keys(res._body.results[0].photos[0]), photoKeys)).toBeTruthy();
    expect(Array.isArray(res._body.results[0].skus)).toBeFalsy();
    expect(compareKeys(Object.keys(res._body.results[0].skus[firstSku]), skusKeys)).toBeTruthy();
  });

  test('product/:product_id returns an object with the correct shape', async () => {
    const testId = '1';
    const topKeys = ['id', 'name', 'slogan', 'description', 'category', 'default_price', 'features'];
    const featuresKeys = ['feature', 'value'];

    const compareKeys = (array1, array2) => array1.some((key) => array2.includes(key));

    const res = await request(app).get(`/api/products/${testId}`);

    expect(compareKeys(Object.keys(res._body), topKeys)).toBeTruthy();
    expect(Array.isArray(res._body.features)).toBeTruthy();
    expect(compareKeys(Object.keys(res._body.features[0]), featuresKeys)).toBeTruthy();
  });

  test('related returns an array with the correct shape', async () => {
    const testId = '1';

    const res = await request(app).get(`/api/products/${testId}/related`);

    expect(Array.isArray(res._body)).toBeTruthy();
  });

  test('/products returns an array with the correct shape', async () => {
    const topKeys = ['id', 'name', 'slogan', 'description', 'category', 'default_price'];
    const compareKeys = (array1, array2) => array1.some((key) => array2.includes(key));

    const res = await request(app).get('/api/products');

    expect(Array.isArray(res._body)).toBeTruthy();
    expect(compareKeys(Object.keys(res._body[0]), topKeys)).toBeTruthy();
  });
});

describe('The controller handles errors', () => {
  test('Handles products that do not have styles data', async () => {
    const res = await request(app).get('/api/products/79/styles');
    expect(res.text).toBe('There are no styles for this product');
    expect(res.statusCode).toBe(404);
  });
});