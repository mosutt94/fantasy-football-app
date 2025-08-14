/**
 * Database connection configuration for Fantasy Football Auction App
 * Uses PostgreSQL with connection pooling for optimal performance
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool instance with database configuration from environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // Connection pool settings for production optimization
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection on startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test query to verify database is accessible
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database timestamp:', result.rows[0].now);
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
};

// Export the pool for use in other modules
module.exports = {
  pool,
  testConnection
};
