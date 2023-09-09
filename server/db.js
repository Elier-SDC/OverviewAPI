require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

const closeDB = async () => {
  try {
    await pool.end();
    console.log('Pool has ended');
  } catch (error) {
    console.error('Error closing the pool:', error);
  }
};

const buildDB = async () => {
  try {

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

    // COPY existing data into tables
    await pool.query(`COPY product FROM '${process.env.PRODUCTPATH}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY styles FROM '${process.env.STYLESPATH}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY skus FROM '${process.env.SKUSPATH}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY photos FROM '${process.env.PHOTOSPATH}' DELIMITER ',' NULL AS 'null' CSV HEADER`);
    await pool.query(`COPY features FROM '${process.env.FEATURESPATH}' DELIMITER ',' NULL AS 'null' CSV HEADER`);

    console.log('Database schema and data imported successfully.');
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