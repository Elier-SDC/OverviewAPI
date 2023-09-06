const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'heithm',
  host: 'localhost',
  database: 'elier',
  password: '',
  port: '5432',
});


const connectDB = async () => {
  await pool.connect();
};

const closeDB = () => pool.end().then(() => console.log('Database pool has ended'));

const buildDB = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to the database');

    // Specify the file paths relative to the 'server' folder
    const productFilePath = path.join(__dirname, 'csv_files/product.csv');
    const stylesFilePath = path.join(__dirname, 'csv_files/styles.csv');
    const skusFilePath = path.join(__dirname, 'csv_files/skus.csv');
    const photosFilePath = path.join(__dirname, 'csv_files/photos.csv');
    const featuresFilePath = path.join(__dirname, 'csv_files/features.csv');

    // Create the "public" schema if it doesn't exist
    await pool.query('CREATE SCHEMA IF NOT EXISTS public');

    // DROP existing tables if they exist
    await pool.query('DROP TABLE IF EXISTS public.product CASCADE');
    await pool.query('DROP TABLE IF EXISTS public.styles CASCADE');
    await pool.query('DROP TABLE IF EXISTS public.skus CASCADE');
    await pool.query('DROP TABLE IF EXISTS public.photos CASCADE');
    await pool.query('DROP TABLE IF EXISTS public.features CASCADE');

    // Create the product table in the public schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.product (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        slogan VARCHAR(200),
        description VARCHAR(500),
        category VARCHAR(25),
        default_price DECIMAL(10, 2)
      )
    `);

    // Create the styles table in the public schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.styles (
        style_id SERIAL PRIMARY KEY,
        product_id INT,
        name VARCHAR(50),
        sale_price INT,
        default_price INT,
        default_style SMALLINT
      )
    `);

    // Create the skus table in the public schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.skus (
        sku_id SERIAL PRIMARY KEY,
        style_id INT,
        size VARCHAR(15),
        quantity INT
      )
    `);

    // Create the photos table in the public schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.photos (
        photo_id SERIAL PRIMARY KEY,
        style_id INT,
        url VARCHAR,
        thumbnail_url VARCHAR
      )
    `);

    // Create the features table in the public schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.features (
        feature_id SERIAL PRIMARY KEY,
        product_id INT,
        feature VARCHAR(25),
        value VARCHAR(40)
      )
    `);

    // Create Indexes
    await pool.query('CREATE INDEX style_index ON public.styles USING hash(product_id)');
    await pool.query('CREATE INDEX photo_index ON public.photos USING hash(style_id)');
    await pool.query('CREATE INDEX sku_index ON public.skus USING hash(style_id)');
    await pool.query('CREATE INDEX product_index ON public.product USING hash(id)');
    await pool.query('CREATE INDEX features_index ON public.features USING hash(product_id)');

    // COPY existing data into tables from CSV files
    await pool.query(`COPY public.product FROM '${productFilePath}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY public.styles FROM '${stylesFilePath}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY public.skus FROM '${skusFilePath}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY public.photos FROM '${photosFilePath}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY public.features FROM '${featuresFilePath}' DELIMITER ',' NULL AS 'null' CSV HEADER`);

    console.log('Database schema and tables created');

  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports.pool = pool;
module.exports.connect = connectDB;
module.exports.build = buildDB;
module.exports.close = closeDB;
