# Authentication System Guide - EZMove

This guide explains the new authentication and user registration system implemented in EZMove.

## Overview

EZMove now includes a complete authentication system with user registration (sign-up) and login functionality for both **Clients** and **Drivers**. User data is stored locally in the browser's `localStorage`, which serves as a simple database for this demo application.

## Features

### Client Authentication
- ✅ **Sign Up**: New clients can create accounts with:
  - Full Name
  - Email Address
  - Phone Number
  - Password (minimum 6 characters)
  - Optional Address
- ✅ **Login**: Existing clients can log in with email and password
- ✅ **Session Persistence**: Users stay logged in even after refreshing the page
- ✅ **Validation**: Email and phone uniqueness checks
- ✅ **Secure Passwords**: Password confirmation and basic hashing

### Driver Authentication
- ✅ **Sign Up**: New drivers can register with:
  - Full Name
  - Email Address
  - Phone Number
  - Vehicle Type (Pickup, Small Truck, Flatbed, Large Truck)
  - License Plate Number
  - Password (minimum 6 characters)
- ✅ **Login**: Existing drivers can log in with email and password
- ✅ **Session Persistence**: Drivers stay logged in across page reloads
- ✅ **Validation**: Email, phone, and license plate uniqueness checks
- ✅ **Automatic Profile Creation**: New drivers start with 5.0 rating and 0 completed jobs

## Data Storage

### LocalStorage Keys

The application uses the following `localStorage` keys to store data:

1. **`clients`** - Array of all registered client accounts
2. **`drivers`** - Array of all registered driver accounts
3. **`currentSession`** - Current logged-in user session
4. **`jobs`** - All transport jobs (existing functionality)

### Client Data Structure

```javascript
{
  id: "CLT1234567890",           // Unique client ID
  name: "John Doe",              // Full name
  email: "john@example.com",     // Email (unique)
  phone: "+264 81 234 5678",     // Phone number (unique)
  passwordHash: "******",        // Hashed password (base64)
  address: "Windhoek, Namibia",  // Optional address
  createdAt: "2024-12-14T..."    // Registration timestamp
}
```

### Driver Data Structure

```javascript
{
  id: "DRV1234567890",           // Unique driver ID
  name: "Maria Nghipandua",      // Full name
  email: "maria@example.com",    // Email (unique)
  phone: "+264 81 876 5432",     // Phone number (unique)
  passwordHash: "******",        // Hashed password (base64)
  vehicleType: "SMALL_TRUCK",    // One of: PICKUP, SMALL_TRUCK, FLATBED, LARGE_TRUCK
  licensePlate: "N 67890 WK",    // License plate (unique)
  rating: 5.0,                   // Initial rating
  location: {                    // GPS coordinates
    lat: -22.5609,
    lng: 17.0658
  },
  availability: true,            // Driver availability status
  completedJobs: 0,              // Number of completed deliveries
  createdAt: "2024-12-14T..."    // Registration timestamp
}
```

## Demo Accounts

For testing purposes, three demo driver accounts are pre-loaded:

### Driver 1: Johannes Shikongo
- **Email**: `johannes@ezmove.com`
- **Password**: `driver123`
- **Vehicle**: Pickup Truck (N 12345 WK)
- **Rating**: 4.8 ⭐

### Driver 2: Maria Nghipandua
- **Email**: `maria@ezmove.com`
- **Password**: `driver123`
- **Vehicle**: Small Truck (N 67890 WK)
- **Rating**: 4.9 ⭐

### Driver 3: David Angula
- **Email**: `david@ezmove.com`
- **Password**: `driver123`
- **Vehicle**: Flatbed (N 24680 WK)
- **Rating**: 4.7 ⭐

## User Flows

### Client Registration Flow

1. User clicks "I Need Transport" on landing page
2. Click "Don't have an account? Sign up"
3. Fill in registration form:
   - Full Name
   - Email Address
   - Phone Number
   - Address (optional)
   - Password
   - Confirm Password
4. Submit form
5. System validates:
   - Email not already registered
   - Phone not already registered
   - Passwords match
   - Password is at least 6 characters
6. Account created and user is automatically logged in
7. Redirected to Client Dashboard

### Client Login Flow

1. User clicks "I Need Transport" on landing page
2. Enter email and password
3. Click "Login"
4. System validates credentials
5. User is logged in and redirected to Client Dashboard

### Driver Registration Flow

1. User clicks "I'm a Driver" on landing page
2. Click "Don't have an account? Register"
3. Fill in registration form:
   - Full Name
   - Email Address
   - Phone Number
   - Vehicle Type (select from 4 options)
   - License Plate Number
   - Password
   - Confirm Password
4. Submit form
5. System validates:
   - Email not already registered
   - Phone not already registered
   - License plate not already registered
   - Passwords match
   - Password is at least 6 characters
6. Driver account created with initial 5.0 rating
7. User is automatically logged in
8. Redirected to Driver Dashboard

### Driver Login Flow

1. User clicks "I'm a Driver" on landing page
2. Enter email and password
3. Click "Login"
4. System validates credentials
5. User is logged in and redirected to Driver Dashboard

## Password Security

**IMPORTANT**: The current implementation uses a simple Base64 encoding for passwords, which is **NOT secure** for production use. This is for demonstration purposes only.

### Current Implementation (Demo Only)
```javascript
const hashPassword = (password) => {
  return btoa(password);  // Base64 encoding - NOT SECURE
};
```

### Production Recommendations

For a production application, you should:

1. **Use a Backend Server**: Never store passwords in browser localStorage
2. **Proper Hashing**: Use bcrypt, scrypt, or Argon2 on the server side
3. **HTTPS Only**: Ensure all authentication happens over HTTPS
4. **JWT Tokens**: Use JSON Web Tokens for session management
5. **Password Requirements**: Enforce strong password policies
6. **Rate Limiting**: Prevent brute force attacks
7. **2FA**: Consider adding two-factor authentication

Example backend implementation:
```javascript
// Backend (Node.js + bcrypt)
const bcrypt = require('bcrypt');

// Hash password on registration
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);

// Verify password on login
const isValid = await bcrypt.compare(password, passwordHash);
```

## Session Management

### How Sessions Work

1. When a user logs in, a session object is stored in `localStorage`:
```javascript
{
  type: 'client',  // or 'driver'
  userId: 'CLT1234567890'
}
```

2. On page load, the app checks for an existing session
3. If found, the user is automatically logged in
4. Session persists until user clicks "Logout"

### Logout Process

1. User clicks "Logout" button in header
2. Session is cleared from `localStorage`
3. User is redirected to landing page
4. User must login again to access their account

## Validation Rules

### Email
- Required for both clients and drivers
- Must be valid email format
- Must be unique (not already registered)

### Phone Number
- Required for both clients and drivers
- Suggested format: `+264 81 234 5678`
- Must be unique (not already registered)

### Password
- Required for both clients and drivers
- Minimum 6 characters
- Must match confirmation password during signup

### License Plate (Drivers Only)
- Required for driver registration
- Auto-converted to uppercase
- Format example: `N 12345 WK`
- Must be unique (not already registered)

### Vehicle Type (Drivers Only)
- Required for driver registration
- Must select one of: Pickup Truck, Small Truck, Flatbed, Large Truck

## Error Handling

The system provides clear error messages for:

- ❌ **Account not found**: Email not registered
- ❌ **Incorrect password**: Wrong password for account
- ❌ **Email already registered**: Account with this email exists
- ❌ **Phone already registered**: Account with this phone exists
- ❌ **License plate already registered**: Vehicle already registered
- ❌ **Passwords do not match**: Confirmation doesn't match password
- ❌ **Password too short**: Less than 6 characters

## API Functions

### Authentication Functions

```javascript
// Client authentication
authenticateClient(email, password)
// Returns: { success: boolean, user?: object, error?: string }

// Client registration
registerClient({ name, email, phone, password, address })
// Returns: { success: boolean, user?: object, error?: string }

// Driver authentication
authenticateDriver(email, password)
// Returns: { success: boolean, user?: object, error?: string }

// Driver registration
registerDriver({ name, email, phone, password, vehicleType, licensePlate })
// Returns: { success: boolean, user?: object, error?: string }
```

### Example Usage

```javascript
// Register a new client
const result = registerClient({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+264 81 234 5678',
  password: 'mypassword',
  address: 'Windhoek, Namibia'
});

if (result.success) {
  console.log('Registration successful!', result.user);
} else {
  console.error('Registration failed:', result.error);
}
```

## Data Management

### Viewing Stored Data

You can view all stored data in the browser console:

```javascript
// View all clients
console.log(JSON.parse(localStorage.getItem('clients')));

// View all drivers
console.log(JSON.parse(localStorage.getItem('drivers')));

// View current session
console.log(JSON.parse(localStorage.getItem('currentSession')));
```

### Clearing Data

To reset the application and remove all user accounts:

```javascript
// Clear all data
localStorage.clear();

// Or clear specific data
localStorage.removeItem('clients');
localStorage.removeItem('drivers');
localStorage.removeItem('currentSession');
```

## Migrating to Production

When moving to a production environment with a real backend:

### 1. Backend API Endpoints

Create these API endpoints:

- `POST /api/auth/client/register` - Client sign-up
- `POST /api/auth/client/login` - Client login
- `POST /api/auth/driver/register` - Driver sign-up
- `POST /api/auth/driver/login` - Driver login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### 2. Database Schema

**Clients Table:**
```sql
CREATE TABLE clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Drivers Table:**
```sql
CREATE TABLE drivers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  license_plate VARCHAR(50) UNIQUE NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  availability BOOLEAN DEFAULT TRUE,
  completed_jobs INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Frontend Changes

Replace localStorage calls with API calls:

```javascript
// Before (localStorage)
const result = registerClient(clientData);

// After (API)
const response = await fetch('/api/auth/client/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clientData)
});
const result = await response.json();
```

## Troubleshooting

### Issue: Can't login after signing up
**Solution**: Check browser console for errors. Clear localStorage and try again.

### Issue: "Email already registered" but I'm new
**Solution**: The email might have been used in a previous test. Clear localStorage or use a different email.

### Issue: Session lost after page refresh
**Solution**: Check that `currentSession` exists in localStorage. This could indicate a browser restriction or incognito mode.

### Issue: Password doesn't work
**Solution**: Passwords are case-sensitive. Make sure Caps Lock is off.

## Security Best Practices

When implementing this in production:

1. ✅ **Never store passwords in plain text or localStorage**
2. ✅ **Use HTTPS for all requests**
3. ✅ **Implement CSRF protection**
4. ✅ **Add rate limiting on login attempts**
5. ✅ **Use secure, httpOnly cookies for sessions**
6. ✅ **Implement password reset functionality**
7. ✅ **Add email verification**
8. ✅ **Monitor for suspicious login patterns**
9. ✅ **Regularly update dependencies**
10. ✅ **Conduct security audits**

## Support

For questions about the authentication system:
1. Check this guide first
2. Review the code in `ehail-logistics-app.jsx`
3. Check browser console for errors
4. Test with demo accounts first

---

**Version**: 1.1.0 (Authentication Update)
**Last Updated**: December 2024
**Status**: Demo/Development (Not for Production Use)
