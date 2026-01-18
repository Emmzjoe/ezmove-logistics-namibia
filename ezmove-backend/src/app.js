// ==================== EXPRESS APP ====================
// Main Express application configuration

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),
  });
});

// API version
app.get('/', (req, res) => {
  res.json({
    name: 'EZMove API',
    version: '1.0.0',
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/jobs', require('./routes/jobs'));
// app.use('/api/v1/drivers', require('./routes/drivers'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const error = config.nodeEnv === 'development'
    ? { message: err.message, stack: err.stack }
    : { message: err.message };

  res.status(err.status || 500).json({
    error: error.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  });
});

module.exports = app;
