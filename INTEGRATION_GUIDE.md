# Frontend-Backend Integration Guide

## Overview
This guide explains how the EZMove frontend has been integrated with the backend API.

## Architecture

### Backend API
- **Base URL**: `http://localhost:3001/api`
- **Authentication**: JWT tokens (access + refresh)
- **Real-time**: Socket.IO WebSocket connection
- **Database**: PostgreSQL with Sequelize ORM

### Frontend Stack
- **Framework**: React 18 (CDN)
- **State Management**: React Hooks + API calls
- **Styling**: TailwindCSS
- **Real-time**: Socket.IO client

## Key Integration Components

### 1. API Service Layer (`api-service.js`)

The API service layer provides a clean interface for all backend communication:

```javascript
// Authentication
await window.API.Auth.login(email, password);
await window.API.Auth.registerClient(userData);
await window.API.Auth.registerDriver(driverData);

// Jobs
await window.API.Job.createJob(jobData);
await window.API.Job.getJobs({ status: 'pending' });
await window.API.Job.acceptJob(jobId);

// Tracking
await window.API.Tracking.getJobHistory(jobId);
await window.API.Tracking.getDriverLocation(driverId);

// Payments
await window.API.Payment.initiatePayment(jobId, phone);
await window.API.Payment.checkPaymentStatus(jobId);

// Verification
await window.API.Verification.uploadDocuments(files);
await window.API.Verification.getVerificationStatus();

// Admin
await window.API.Admin.getUsers({ userType: 'driver' });
await window.API.Admin.getDashboardStats('30d');
```

### 2. Authentication Flow

**Before (localStorage only):**
```javascript
// User data stored in localStorage
const user = { id: '123', name: 'John' };
localStorage.setItem('currentUser', JSON.stringify(user));
```

**After (API integration):**
```javascript
// Login through API
const response = await window.API.Auth.login(email, password);
// Tokens stored automatically
// User data synced with backend
```

**Token Management:**
- Access tokens stored in `localStorage.accessToken`
- Refresh tokens stored in `localStorage.refreshToken`
- Automatic token refresh on 401 responses
- Auto-logout on refresh failure

### 3. Real-time Tracking with WebSockets

```javascript
// Connect to WebSocket
window.API.WebSocket.connect();

// Track a job
window.API.WebSocket.trackJob(jobId, (locationData) => {
  console.log('Driver location:', locationData);
});

// Update driver location (drivers only)
window.API.WebSocket.updateLocation(latitude, longitude);

// Disconnect
window.API.WebSocket.disconnect();
```

### 4. Updated Authentication Components

The authentication components in `auth-integration.jsx` replace the localStorage-based versions:

**Features:**
- API-based registration and login
- Proper error handling
- Loading states
- Token management
- User type validation

### 5. File Structure

```
E-Hail App/
├── index.html                  # Main HTML with CDN scripts
├── api-service.js              # API communication layer
├── auth-integration.jsx        # Updated auth components
├── ehail-logistics-app.jsx     # Main app (uses API components)
├── backend/
│   ├── src/
│   │   ├── controllers/        # API controllers
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── models/             # Database models
│   │   └── server.js           # Express server
│   └── package.json
└── INTEGRATION_GUIDE.md        # This file
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:3001`

### 2. Start Frontend Server
```bash
python3 -m http.server 8001
```
Frontend runs on: `http://localhost:8001`

### 3. Access the Application
Open browser to: `http://localhost:8001`

## API Endpoints

### Authentication
- `POST /api/auth/register/client` - Register new client
- `POST /api/auth/register/driver` - Register new driver
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - List jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/accept` - Accept job (driver)
- `POST /api/jobs/:id/start` - Start job (driver)
- `POST /api/jobs/:id/complete` - Complete job (driver)
- `POST /api/jobs/:id/cancel` - Cancel job
- `POST /api/jobs/:id/rate` - Rate job

### Tracking
- `GET /api/tracking/job/:id/history` - Job tracking history
- `GET /api/tracking/driver/:id/location` - Driver location
- `GET /api/tracking/calculate-eta` - Calculate ETA

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/payments/status/:jobId` - Check payment status
- `GET /api/payments/history` - Payment history

### Verification (Driver)
- `POST /api/verification/upload` - Upload documents
- `GET /api/verification/status` - Get verification status

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - User details
- `POST /api/admin/users/:id/suspend` - Suspend user
- `POST /api/admin/users/:id/activate` - Activate user
- `GET /api/admin/jobs` - List all jobs
- `POST /api/admin/jobs/:id/cancel` - Cancel job
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/transactions` - Transaction list
- `GET /api/admin/system/health` - System health

## WebSocket Events

### Client → Server
- `driver:location` - Driver sends location update
- `job:track` - Subscribe to job tracking

### Server → Client
- `driver:location:update` - Receive driver location updates

## Migration from localStorage to API

### User Registration
**Before:**
```javascript
const newUser = { ...formData, id: generateId() };
localStorage.setItem('users', JSON.stringify([...users, newUser]));
```

**After:**
```javascript
const response = await window.API.Auth.registerClient(formData);
// User stored in database, tokens managed automatically
```

### Creating a Job
**Before:**
```javascript
const newJob = { ...jobData, id: generateId() };
localStorage.setItem('jobs', JSON.stringify([...jobs, newJob]));
```

**After:**
```javascript
const response = await window.API.Job.createJob(jobData);
const job = response.data;
// Job stored in database with proper relationships
```

### Fetching Jobs
**Before:**
```javascript
const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
```

**After:**
```javascript
const response = await window.API.Job.getJobs({ status: 'pending' });
const jobs = response.data.jobs;
```

## Error Handling

All API calls include proper error handling:

```javascript
try {
  const response = await window.API.Job.createJob(jobData);
  if (response.success) {
    // Handle success
  }
} catch (error) {
  console.error('Job creation failed:', error.message);
  // Show error to user
}
```

## Security Features

1. **JWT Authentication**: All protected routes require valid access tokens
2. **Token Refresh**: Automatic token refresh on expiration
3. **Password Hashing**: bcrypt with salt rounds
4. **Input Validation**: Server-side validation on all inputs
5. **Rate Limiting**: Protection against brute force attacks
6. **CORS**: Configured for specific frontend origin
7. **Helmet**: Security headers enabled

## Testing the Integration

### 1. Test User Registration
1. Navigate to `http://localhost:8001`
2. Select "I'm a Client" or "I'm a Driver"
3. Click "Register" tab
4. Fill in registration form
5. Submit - should create user in database

### 2. Test Login
1. Use registered credentials
2. Login should succeed and store tokens
3. Check localStorage for `accessToken` and `refreshToken`

### 3. Test Job Creation
1. Login as client
2. Create a new delivery job
3. Job should be stored in PostgreSQL database
4. Check backend console for SQL queries

### 4. Test Real-time Tracking
1. Login as driver and accept a job
2. Open browser console
3. WebSocket should connect automatically
4. Location updates should broadcast to clients

## Next Steps

To complete the integration:

1. **Replace localStorage job operations with API calls**
   - Update `ClientApp` to fetch jobs from API
   - Update `DriverApp` to fetch available jobs from API
   - Implement real-time job updates

2. **Integrate payment flow**
   - Connect MTN MoMoPay API
   - Handle payment callbacks
   - Update UI with payment status

3. **Add driver verification UI**
   - Document upload interface
   - Status tracking
   - Admin approval interface

4. **Admin dashboard**
   - User management interface
   - Job monitoring
   - Analytics and reports

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Run `npm install` to ensure dependencies are installed

### Frontend auth not working
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify `api-service.js` is loaded before React components

### WebSocket connection fails
- Check Socket.IO client is loaded from CDN
- Verify access token is present
- Check backend WebSocket configuration

## Environment Variables

Backend `.env` file should include:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ezmove_db
DB_USER=emmz
DB_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-here

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8001

# External Services (optional for testing)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

MTN_MOMO_API_KEY=
MTN_MOMO_API_SECRET=
MTN_MOMO_SUBSCRIPTION_KEY=

GOOGLE_MAPS_API_KEY=
```

## Support

For issues or questions:
1. Check backend console for errors
2. Check browser console for frontend errors
3. Review API responses in Network tab
4. Verify database entries in PostgreSQL

---

**Status**: Frontend integration in progress
**Last Updated**: 2026-01-16
