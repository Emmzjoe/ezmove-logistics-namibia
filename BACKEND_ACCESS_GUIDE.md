# Backend Access Guide

## 🌐 Your Backend Servers

You have **two backend servers** running:

### 1. **Existing Backend** (Port 3001) - PRODUCTION READY ✅
**Base URL**: `http://localhost:3001`

This is your **fully functional backend** with all features already implemented and working.

### 2. **New Backend** (Port 3000) - STRUCTURE ONLY
**Base URL**: `http://localhost:3000`

This is a **clean architecture backend** we just set up. It only has basic structure and health check.

---

## 📡 Existing Backend (Port 3001) - Complete API

### Base URL
```
http://localhost:3001/api
```

### Available Endpoints

#### 🔐 Authentication (`/api/auth`)
```bash
# Register Client
POST http://localhost:3001/api/auth/register/client
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "YourPassword123",
  "full_name": "John Doe",
  "phone": "+264812345678"
}

# Register Driver
POST http://localhost:3001/api/auth/register/driver
Content-Type: application/json

{
  "email": "driver@example.com",
  "password": "DriverPass123",
  "full_name": "Jane Driver",
  "phone": "+264823456789",
  "vehicle_type": "PICKUP",
  "license_plate": "N 123 ABC",
  "license_number": "DL123456",
  "vehicle_make": "Toyota",
  "vehicle_model": "Hilux"
}

# Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "YourPassword123"
}

# Get Current User
GET http://localhost:3001/api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN

# Refresh Token
POST http://localhost:3001/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

#### 📦 Jobs (`/api/jobs`)
```bash
# Create Job
POST http://localhost:3001/api/jobs
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "pickup": {
    "address": "123 Main St, Windhoek",
    "location": { "lat": -22.5609, "lng": 17.0658 }
  },
  "delivery": {
    "address": "456 Oak Ave, Windhoek",
    "location": { "lat": -22.5709, "lng": 17.0758 }
  },
  "vehicleType": "PICKUP",
  "loadType": "Furniture",
  "loadWeight": "150",
  "instructions": "Handle with care"
}

# Get All Jobs (for logged in user)
GET http://localhost:3001/api/jobs
Authorization: Bearer YOUR_ACCESS_TOKEN

# Get Specific Job
GET http://localhost:3001/api/jobs/:jobId
Authorization: Bearer YOUR_ACCESS_TOKEN

# Accept Job (Driver only)
POST http://localhost:3001/api/jobs/:jobId/accept
Authorization: Bearer YOUR_ACCESS_TOKEN

# Start Job (Driver only)
POST http://localhost:3001/api/jobs/:jobId/start
Authorization: Bearer YOUR_ACCESS_TOKEN

# Complete Job (Driver only)
POST http://localhost:3001/api/jobs/:jobId/complete
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "deliveryProof": "base64_encoded_photo_or_json"
}

# Cancel Job
POST http://localhost:3001/api/jobs/:jobId/cancel
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reason": "Customer request"
}

# Rate Job
POST http://localhost:3001/api/jobs/:jobId/rate
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "rating": 5,
  "review": "Great service!"
}
```

#### 📍 Tracking (`/api/tracking`)
```bash
# Get Job Tracking History
GET http://localhost:3001/api/tracking/job/:jobId/history
Authorization: Bearer YOUR_ACCESS_TOKEN

# Get Driver Location
GET http://localhost:3001/api/tracking/driver/:driverId/location
Authorization: Bearer YOUR_ACCESS_TOKEN

# Calculate ETA
GET http://localhost:3001/api/tracking/calculate-eta?jobId=:jobId
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### 💳 Payments (`/api/payments`)
```bash
# Payment endpoints (when implemented)
POST http://localhost:3001/api/payments/initiate
POST http://localhost:3001/api/payments/verify
```

#### 🔔 Notifications (`/api/notifications`)
```bash
# Notification endpoints
GET http://localhost:3001/api/notifications
POST http://localhost:3001/api/notifications/mark-read
```

#### ✅ Verification (`/api/verification`)
```bash
# Upload Verification Documents (Driver)
POST http://localhost:3001/api/verification/upload
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

# Get Verification Status
GET http://localhost:3001/api/verification/status
Authorization: Bearer YOUR_ACCESS_TOKEN

# Get Pending Verifications (Admin)
GET http://localhost:3001/api/verification/pending
Authorization: Bearer YOUR_ADMIN_TOKEN

# Approve Driver (Admin)
POST http://localhost:3001/api/verification/approve/:driverId
Authorization: Bearer YOUR_ADMIN_TOKEN

# Reject Driver (Admin)
POST http://localhost:3001/api/verification/reject/:driverId
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "reason": "Invalid documents"
}
```

#### 👨‍💼 Admin (`/api/admin`)
```bash
# Dashboard Stats
GET http://localhost:3001/api/admin/dashboard/stats
Authorization: Bearer YOUR_ADMIN_TOKEN

# List All Users
GET http://localhost:3001/api/admin/users
Authorization: Bearer YOUR_ADMIN_TOKEN

# Get User Details
GET http://localhost:3001/api/admin/users/:userId
Authorization: Bearer YOUR_ADMIN_TOKEN

# Suspend User
POST http://localhost:3001/api/admin/users/:userId/suspend
Authorization: Bearer YOUR_ADMIN_TOKEN

# Activate User
POST http://localhost:3001/api/admin/users/:userId/activate
Authorization: Bearer YOUR_ADMIN_TOKEN

# List All Jobs
GET http://localhost:3001/api/admin/jobs
Authorization: Bearer YOUR_ADMIN_TOKEN

# Cancel Job (Admin)
POST http://localhost:3001/api/admin/jobs/:jobId/cancel
Authorization: Bearer YOUR_ADMIN_TOKEN

# List Transactions
GET http://localhost:3001/api/admin/transactions
Authorization: Bearer YOUR_ADMIN_TOKEN

# System Health
GET http://localhost:3001/api/admin/system/health
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 🆕 New Backend (Port 3000) - Basic Structure

### Base URL
```
http://localhost:3000
```

### Currently Available Endpoints

```bash
# API Info
GET http://localhost:3000/

# Health Check
GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-18T05:09:59.267Z",
  "environment": "development",
  "uptime": 125.16
}
```

---

## 🧪 Testing with cURL

### Example: Register a Client
```bash
curl -X POST http://localhost:3001/api/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "full_name": "Test User",
    "phone": "+264812345678"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "full_name": "Test User",
      "user_type": "client"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Example: Create Job (with token)
```bash
# First, save your token
TOKEN="your-access-token-here"

# Create job
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "pickup": {
      "address": "Windhoek Central",
      "location": { "lat": -22.5609, "lng": 17.0658 }
    },
    "delivery": {
      "address": "Katutura",
      "location": { "lat": -22.5709, "lng": 17.0758 }
    },
    "vehicleType": "PICKUP",
    "loadType": "Furniture"
  }'
```

---

## 🌐 Testing with Browser

### Option 1: Direct Browser Access (GET requests only)

Open these URLs in your browser:

```
http://localhost:3001/api/auth/me
http://localhost:3001/api/jobs
http://localhost:3000/health
```

**Note:** You'll get errors for protected routes because you need authentication.

### Option 2: Use Browser DevTools

1. Open your frontend at `http://localhost:8001`
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to **Network tab**
4. Perform actions (login, create job, etc.)
5. See all API calls in the Network tab

### Option 3: Use Postman or Insomnia

Download **Postman** or **Insomnia** (free API testing tools):
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download

Import these endpoints and test easily with a GUI.

---

## 🔑 Authentication Flow

### 1. Register or Login
```bash
POST http://localhost:3001/api/auth/login
```

### 2. Save the Access Token
The response includes an `accessToken`:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Use Token in Subsequent Requests
Add to headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Which Backend Should You Use?

### Use **Existing Backend (Port 3001)** if:
- ✅ You want to test features NOW
- ✅ Your frontend needs to connect to a working API
- ✅ You need authentication, jobs, tracking, etc.

### Use **New Backend (Port 3000)** if:
- ✅ You're building new features from scratch
- ✅ You want clean architecture
- ✅ You're learning backend development

---

## 🚀 Quick Start Guide

### For Frontend Development:
```javascript
// In your frontend code, use:
const API_URL = 'http://localhost:3001/api';

// Example: Login
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
const token = data.data.accessToken;

// Example: Create Job
const jobResponse = await fetch(`${API_URL}/jobs`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(jobData)
});
```

### Test Your Connection:
```bash
# Test existing backend
curl http://localhost:3001/api/auth/me

# Test new backend
curl http://localhost:3000/health
```

---

## 📊 Backend Status

| Feature | Existing (3001) | New (3000) |
|---------|----------------|------------|
| Authentication | ✅ Working | ⏳ Not yet |
| Job Management | ✅ Working | ⏳ Not yet |
| Driver Features | ✅ Working | ⏳ Not yet |
| Admin Panel | ✅ Working | ⏳ Not yet |
| Real-time Tracking | ✅ Working | ⏳ Not yet |
| Database | ✅ Connected | ✅ Connected |
| Security | ✅ Full | ✅ Basic |

---

## 🛠️ Troubleshooting

### "Authorization failed" or "No token provided"
**Solution:** Include the `Authorization` header with your access token.

### "CORS error"
**Solution:** Backend is configured for `http://localhost:8001`. If using different port, update `.env`.

### "Connection refused"
**Solution:**
```bash
# Check if backend is running
lsof -i:3001  # For existing backend
lsof -i:3000  # For new backend

# Restart if needed
cd "/Users/emmz/Documents/Projects/E-Hail App/backend" && npm start
```

---

## 📝 Summary

**To access your backend:**

1. **Existing Backend (RECOMMENDED for now)**:
   - URL: `http://localhost:3001/api`
   - Has all features working
   - Use this for your frontend

2. **New Backend**:
   - URL: `http://localhost:3000`
   - Basic structure only
   - Use for learning/expansion

**Next steps:**
- Use Postman/Insomnia to test endpoints
- Or connect your frontend at `http://localhost:8001` to `http://localhost:3001/api`
- All API calls are already integrated in your frontend!

---

**Need help testing? Let me know which endpoint you want to try!** 🚀
