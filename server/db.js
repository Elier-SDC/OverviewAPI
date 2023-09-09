require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const csvDirectory = path.join(__dirname, 'csv_files');
const schemaPath = path.join(__dirname, 'schema.sql');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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
    const fullPath = path.join(csvDirectory, filePath);
    const copyQuery = `COPY ${tableName} FROM '${fullPath}' DELIMITER ',' NULL AS 'null' CSV HEADER`;

    await pool.query(copyQuery);
    console.log(`Data imported into ${tableName} table.`);
  } catch (error) {
    console.error(`Error importing data into ${tableName} table:`, error);
  }
};

const dropTableIfExists = async (tableName) => {
  await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
};

const buildDB = async () => {
  try {
    await connectDB();
    console.log('Connected to the database');

    // Create the "public" schema if it doesn't exist
    await pool.query('CREATE SCHEMA IF NOT EXISTS public');

    // Drop existing tables if they exist
    await dropTableIfExists('product');
    await dropTableIfExists('styles');
    await dropTableIfExists('skus');
    await dropTableIfExists('photos');
    await dropTableIfExists('features');

    // Read the schema.sql file
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL script to create tables and indexes
    await pool.query(schemaSQL);

    // Import CSVs
    const csvFileNames = ['product.csv', 'styles.csv', 'features.csv', 'photos.csv', 'skus.csv'];
    for (const fileName of csvFileNames) {
      await importCSV(fileName.replace('.csv', ''), fileName);
    }
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
