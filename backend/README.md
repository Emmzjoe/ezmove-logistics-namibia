# EZMove Backend API

Production-ready backend for EZMove E-Hailing Logistics Platform

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **Cache:** Redis 7+
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.IO
- **ORM:** Sequelize

## Prerequisites

1. **PostgreSQL** - Install PostgreSQL 14 or later
   ```bash
   # macOS (Homebrew)
   brew install postgresql@14
   brew services start postgresql@14
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Redis** (Optional but recommended)
   ```bash
   # macOS
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt-get install redis-server
   
   # Windows
   # Use WSL or download from https://redis.io/download
   ```

3. **Node.js 18+**
   ```bash
   node --version  # Should be v18 or higher
   ```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Create PostgreSQL database
createdb ezmove_db

# Or using psql:
psql -U postgres
CREATE DATABASE ezmove_db;
\q
```

### 3. Configure Environment Variables

```bash
# Copy the example .env file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

**Important:** Update these values in `.env`:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate a secure random string
- API keys for services you'll use

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## Database Setup

The database will auto-sync in development mode. On first run, Sequelize will create all necessary tables.

To reset the database (WARNING: This deletes all data):

```bash
# Drop and recreate database
dropdb ezmove_db
createdb ezmove_db

# Restart the server to recreate tables
npm run dev
```

## API Endpoints

### Authentication

#### Register Client
```http
POST /api/auth/register/client
Content-Type: application/json

{
  "email": "john@example.com",
  "phone": "+264811234567",
  "password": "SecurePassword123",
  "fullName": "John Doe",
  "address": "Windhoek, Namibia"
}
```

#### Register Driver
```http
POST /api/auth/register/driver
Content-Type: application/json

{
  "email": "driver@example.com",
  "phone": "+264819876543",
  "password": "SecurePassword123",
  "fullName": "Jane Driver",
  "vehicleType": "PICKUP",
  "licensePlate": "N 12345 WK",
  "licenseNumber": "DL123456",
  "licenseExpiry": "2026-12-31",
  "vehicleRegistration": "VR789012",
  "insuranceProvider": "Santam Namibia",
  "insurancePolicy": "POL123456",
  "insuranceExpiry": "2026-06-30"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "fullName": "John Doe",
    "userType": "client"
  },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize database config
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── DriverProfile.js     # Driver profile model
│   │   ├── Job.js               # Job model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   └── authRoutes.js        # Auth routes
│   ├── services/
│   │   └── authService.js       # Auth utility functions
│   └── server.js                # Express app & server startup
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Example environment file
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

See `.env.example` for all available configuration options.

### Critical Variables

- `JWT_SECRET` - Must be a long random string (generate with: `openssl rand -hex 64`)
- `DB_PASSWORD` - Your PostgreSQL password
- `FRONTEND_URL` - Your frontend URL for CORS

## Next Steps

After setting up the backend:

1. ✅ Backend infrastructure is ready
2. ⏭️ Integrate with frontend (update API URLs)
3. ⏭️ Add job management endpoints
4. ⏭️ Implement GPS tracking with Socket.IO
5. ⏭️ Add payment integration (MTN MoMoPay)
6. ⏭️ Set up SMS notifications
7. ⏭️ Create admin dashboard

## Testing the API

Use Postman, Insomnia, or curl to test the endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Register a client
curl -X POST http://localhost:3001/api/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+264811111111",
    "password": "Test123456",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

## Security Features

- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT token authentication
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection protection (Sequelize ORM)

## Deployment

See separate deployment guide for production setup instructions.

## Support

For issues or questions, check the main project documentation or contact the development team.
