const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8001',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Initialize tracking service with Socket.IO
const TrackingService = require('./services/trackingService');
const trackingService = new TrackingService(io);
trackingService.initialize();

// Pass tracking service to controller
const trackingController = require('./controllers/trackingController');
trackingController.setTrackingService(trackingService);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`\n📡 HTTP API Endpoints:`);
      console.log(`   POST /api/auth/register/client`);
      console.log(`   POST /api/auth/register/driver`);
      console.log(`   POST /api/auth/login`);
      console.log(`   POST /api/auth/refresh`);
      console.log(`   GET  /api/auth/me (protected)`);
      console.log(`   POST /api/jobs (create job)`);
      console.log(`   GET  /api/jobs (list jobs)`);
      console.log(`   GET  /api/jobs/:id (get job)`);
      console.log(`   POST /api/jobs/:id/accept (driver accepts)`);
      console.log(`   POST /api/jobs/:id/start (driver starts)`);
      console.log(`   POST /api/jobs/:id/complete (driver completes)`);
      console.log(`   POST /api/jobs/:id/cancel (cancel job)`);
      console.log(`   POST /api/jobs/:id/rate (rate job)`);
      console.log(`   GET  /api/tracking/job/:id/history`);
      console.log(`   GET  /api/tracking/driver/:id/location`);
      console.log(`   GET  /api/tracking/calculate-eta`);
      console.log(`\n🔌 WebSocket Events:`);
      console.log(`   driver:location - Driver sends location update`);
      console.log(`   job:track - Subscribe to job tracking`);
      console.log(`   driver:location:update - Receive location updates`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
