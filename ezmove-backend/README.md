# EZMove Backend - Production Ready

Professional Node.js/Express backend for the EZMove logistics platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev

# Start production server
npm start
```

## 📁 Project Structure

```
ezmove-backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.js    # Centralized config
│   │   ├── database.js  # PostgreSQL connection
│   │   └── redis.js     # Redis connection
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/          # Utility functions
│   ├── socket/         # Socket.IO handlers
│   ├── db/
│   │   └── migrations/ # Database migrations
│   ├── tests/          # Test files
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
├── .gitignore
└── package.json
```

## ✅ Current Status

### Completed
- ✅ Project setup with all dependencies
- ✅ PostgreSQL database connection
- ✅ Redis support (optional)
- ✅ Express app with security middleware (helmet, cors)
- ✅ Environment-based configuration
- ✅ Health check endpoint
- ✅ Error handling
- ✅ Logging (Morgan)
- ✅ Graceful shutdown

### Ready to Add
- ⏳ Authentication routes (JWT)
- ⏳ Job management routes
- ⏳ Driver routes
- ⏳ Admin routes
- ⏳ Real-time tracking (Socket.IO)
- ⏳ File uploads
- ⏳ Payment integration
- ⏳ SMS/Email notifications

## 🔧 Configuration

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ezmove_db
DB_USER=your-user
DB_PASSWORD=your-password

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_ENABLED=false  # Set to false to run without Redis

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Email
SENDGRID_API_KEY=your-key
FROM_EMAIL=noreply@ezmove.na
FROM_NAME=EZMove

# SMS
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=your-number

# CORS
CORS_ORIGINS=http://localhost:8001,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Generate JWT Secrets

```bash
# Generate access token secret
openssl rand -base64 32

# Generate refresh token secret
openssl rand -base64 32
```

## 🗄️ Database

### Current Database
This backend connects to the same PostgreSQL database as the existing backend:
- Database: `ezmove_db`
- Host: `localhost:5432`
- User: `emmz`

### Database Schema
All tables are already created in the existing database:
- `users`
- `driver_profiles`
- `jobs`
- `job_tracking`
- `transactions`
- `notifications`

## 📡 API Endpoints

### Currently Available

```
GET  /                 - API info
GET  /health          - Health check
```

### Coming Soon

```
# Authentication
POST /api/v1/auth/register/client
POST /api/v1/auth/register/driver
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me

# Jobs
POST /api/v1/jobs
GET  /api/v1/jobs
GET  /api/v1/jobs/:id
POST /api/v1/jobs/:id/accept
POST /api/v1/jobs/:id/complete
POST /api/v1/jobs/:id/cancel

# Drivers
GET  /api/v1/drivers
GET  /api/v1/drivers/:id
PUT  /api/v1/drivers/:id
POST /api/v1/drivers/:id/verify

# Admin
GET  /api/v1/admin/stats
GET  /api/v1/admin/users
GET  /api/v1/admin/jobs
```

## 🛠️ Dependencies

### Production
- **express** - Web framework
- **pg** - PostgreSQL client
- **redis** - Redis client (optional)
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **helmet** - Security headers
- **cors** - CORS middleware
- **morgan** - HTTP logging
- **socket.io** - Real-time communication
- **uuid** - UUID generation
- **dotenv** - Environment variables
- **express-rate-limit** - Rate limiting

### Development
- **nodemon** - Auto-restart on changes
- **jest** - Testing framework
- **supertest** - HTTP testing
- **eslint** - Code linting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔒 Security Features

- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT authentication (ready to implement)
- ✅ Environment-based configuration
- ✅ SQL injection protection (parameterized queries)

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-18T05:08:08.026Z",
  "environment": "development",
  "uptime": 13.92
}
```

### Database Connection
The server automatically tests the database connection on startup.

## 🚀 Deployment

### Prerequisites
1. PostgreSQL database
2. Node.js 18+
3. Redis (optional)

### Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment: `cp .env.example .env` and edit
4. Run migrations (if needed)
5. Start server: `npm start`

### Environment-Specific

**Development:**
```bash
NODE_ENV=development npm run dev
```

**Production:**
```bash
NODE_ENV=production npm start
```

## 🔄 Migration from Existing Backend

This new backend is designed to eventually replace the existing backend at `/backend`.

### Why New Backend?
1. **Clean architecture** - Better organized code structure
2. **Modern practices** - Latest security and performance patterns
3. **Scalability** - Designed for production from the start
4. **Maintainability** - Clear separation of concerns

### Migration Path
1. ✅ Phase 1: Setup (DONE)
2. ⏳ Phase 2: Implement authentication
3. ⏳ Phase 3: Migrate job management
4. ⏳ Phase 4: Add real-time features
5. ⏳ Phase 5: Switch frontend to new backend
6. ⏳ Phase 6: Decommission old backend

## 📝 Scripts

```json
{
  "start": "node src/server.js",           // Production
  "dev": "nodemon src/server.js",          // Development with auto-reload
  "test": "jest",                          // Run tests
  "test:watch": "jest --watch"             // Watch mode
}
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: role "postgres" does not exist
```
**Solution**: Update `DB_USER` in `.env` to match your PostgreSQL user

### Redis Connection Error
```
Redis error: connect ECONNREFUSED
```
**Solution**: Set `REDIS_ENABLED=false` in `.env` to run without Redis

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change `PORT` in `.env` or kill the process using that port

## 📚 Documentation

- [API Documentation](./docs/API.md) - Coming soon
- [Database Schema](./docs/DATABASE.md) - Coming soon
- [Authentication](./docs/AUTH.md) - Coming soon

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

ISC

---

**Status**: ✅ Backend structure ready for development

**Next Steps**:
1. Implement authentication routes
2. Add job management endpoints
3. Set up Socket.IO for real-time tracking
4. Add file upload for driver verification
