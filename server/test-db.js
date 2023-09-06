const { pool, connect, build, close } = require('./db');

async function testDatabase() {
  try {

    // Connect to the database Build and build the database schema and tables
    await build();
    console.log('Database schema and tables created');

    // Close the database connection
    await close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // release the database connection
    pool.end();
  }
}

testDatabase();
