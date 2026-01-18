// ==================== REDIS CONNECTION ====================
// Redis client for caching and sessions

const redis = require('redis');
const config = require('./config');

let client = null;

// Only connect to Redis if enabled
if (config.redis.enabled) {
  client = redis.createClient({
    socket: {
      host: config.redis.host,
      port: config.redis.port,
    },
    password: config.redis.password || undefined,
  });

  client.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  client.on('error', (err) => {
    console.error('❌ Redis error:', err);
  });

  // Connect to Redis
  client.connect().catch((err) => {
    console.error('❌ Failed to connect to Redis:', err);
    console.log('⚠️  Running without Redis - some features may be limited');
  });
} else {
  console.log('⚠️  Redis disabled - running without caching');
}

module.exports = client;
