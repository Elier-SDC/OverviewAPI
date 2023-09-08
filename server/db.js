require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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



const closeDB = async () => {
    try {
      await pool.end();
      console.log('Pool has ended');
    } catch (error) {
      console.error('Error closing the pool:', error);
    }
  };




const importCSV = async (tableName, filePath) => {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const copyQuery = `COPY ${tableName} FROM '${fullPath}' DELIMITER ',' NULL AS 'null' CSV HEADER`;

    await pool.query(copyQuery);
    console.log(`Data imported into ${tableName} table.`);
  } catch (error) {
    console.error(`Error importing data into ${tableName} table:`, error);
  }
};


const buildDB = async () => {
  try {
    await connectDB();
    console.log('Connected to the database');


    const productFilePath = path.join(__dirname, 'csv_files/product.csv');
    const stylesFilePath = path.join(__dirname, 'csv_files/styles.csv');
    const skusFilePath = path.join(__dirname, 'csv_files/skus.csv');
    const photosFilePath = path.join(__dirname, 'csv_files/photos.csv');
    const featuresFilePath = path.join(__dirname, 'csv_files/features.csv');

    // Create the "public" schema if it doesn't exist
    await pool.query('CREATE SCHEMA IF NOT EXISTS public');

    // DROP existing tables if they exist
    await pool.query('DROP TABLE IF EXISTS product CASCADE');
    await pool.query('DROP TABLE IF EXISTS styles CASCADE');
    await pool.query('DROP TABLE IF EXISTS skus CASCADE');
    await pool.query('DROP TABLE IF EXISTS photos CASCADE');
    await pool.query('DROP TABLE IF EXISTS features CASCADE');

    // Read the schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL script to create tables and indexes
    await pool.query(schemaSQL);


    // Create Indexes
   await pool.query('CREATE INDEX style_index ON styles USING hash(product_id)');
   await pool.query('CREATE INDEX photo_index ON photos USING hash(style_id)');
   await pool.query('CREATE INDEX sku_index ON skus USING hash(style_id)');
   await pool.query('CREATE INDEX product_index ON product USING hash(id)');
   await pool.query('CREATE INDEX features_index ON features USING hash(product_id)');

    await importCSV('product', 'csv_files/product.csv');
    await importCSV('styles', 'csv_files/styles.csv');
    await importCSV('features', 'csv_files/features.csv');
    await importCSV('photos', 'csv_files/photos.csv');
    await importCSV('skus', 'csv_files/skus.csv');
  } catch (error) {
    console.error('Error building the database schema:', error);
  } finally {
    await closeDB();
    console.log('Database connection closed');
  }
};

module.exports = {
  pool,
  connect: connectDB,
  build: buildDB,
  close: closeDB,
};