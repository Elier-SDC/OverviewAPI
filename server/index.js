require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const productRouter = require('./Routes/productRoutes');
const cartRouter = require('./Routes/cartRoutes');

const db = require('./db');

// db.connect();
// db.build();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.get('/', (request, response) => {
  response.json({ info: 'API for product information' });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});