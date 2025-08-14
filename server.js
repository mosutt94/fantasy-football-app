/**
 * Fantasy Football Auction Draft App - Main Server
 * Express.js server with PostgreSQL database integration
 */

const express = require('express');
require('dotenv').config();
const { testConnection } = require('./db');

// Import route modules
const playersRoutes = require('./routes/players');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS middleware for development (allows requests from any origin)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fantasy Football Auction App is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/players', playersRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Fantasy Football Auction Draft API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      players: '/api/players',
      playerById: '/api/players/:id',
      playersByPosition: '/api/players/position/:position'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedPath: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global Error Handler:', error.message);
  
  res.status(error.status || 500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Start server function
const startServer = async () => {
  try {
    // Test database connection before starting server
    await testConnection();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log('🏈 ===============================================');
      console.log('🏈 Fantasy Football Auction Draft App Started!');
      console.log('🏈 ===============================================');
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log('🏈 ===============================================');
      console.log('📡 Available endpoints:');
      console.log(`   GET  http://localhost:${PORT}/`);
      console.log(`   GET  http://localhost:${PORT}/health`);
      console.log(`   GET  http://localhost:${PORT}/api/players`);
      console.log(`   GET  http://localhost:${PORT}/api/players/:id`);
      console.log(`   GET  http://localhost:${PORT}/api/players/position/:position`);
      console.log('🏈 ===============================================');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure PostgreSQL is running and database credentials are correct');
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

// Export app for testing purposes
module.exports = app;
