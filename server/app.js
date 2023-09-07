
require('dotenv').config();
const express = require('express');
const productRouter = require('./routes/productRoutes');
const db = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRouter);

app.get('/', (request, response) => {
  response.json({ info: 'API for product information' });
});

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
