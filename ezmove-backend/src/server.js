// ==================== SERVER ====================
// Main server entry point

const app = require('./app');
const config = require('./config/config');
const db = require('./config/database');
const redis = require('./config/redis');

const PORT = config.port;

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🚀 EZMove Backend Server`);
      console.log(`🚀 ========================================`);
      console.log(`🚀 Port: ${PORT}`);
      console.log(`🚀 Environment: ${config.nodeEnv}`);
      console.log(`🚀 Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
      console.log(`🚀 Redis: ${config.redis.enabled ? 'Enabled' : 'Disabled'}`);
      console.log('🚀 ========================================');
      console.log('');
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
        db.pool.end(() => {
          console.log('✅ Database pool closed');
          if (redis) {
            redis.quit(() => {
              console.log('✅ Redis connection closed');
              process.exit(0);
            });
          } else {
            process.exit(0);
          }
        });
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
