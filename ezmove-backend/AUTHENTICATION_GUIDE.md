# Authentication API Guide

## Status: ✅ WORKING

All authentication endpoints are now fully functional and tested.

## Available Endpoints

Base URL: `http://localhost:3000/api/v1/auth`

### 1. Register Client

**Endpoint:** `POST /api/v1/auth/register/client`

**Description:** Register a new client user

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "Password123",
  "full_name": "John Doe",
  "phone": "+264811234567"
}
```

**Validation Rules:**
- `email`: Valid email format required
- `password`: Minimum 8 characters
- `phone`: Namibian format (+264XXXXXXXXX)
- All fields are required

**Success Response (201):**
```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "client@example.com",
      "full_name": "John Doe",
      "phone": "+264811234567",
      "user_type": "client",
      "created_at": "2026-01-18T11:34:04.117Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400`: Missing required fields or invalid format
- `409`: User already exists
- `500`: Registration failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "Password123",
    "full_name": "John Doe",
    "phone": "+264811234567"
  }'
```

---

### 2. Register Driver

**Endpoint:** `POST /api/v1/auth/register/driver`

**Description:** Register a new driver (requires verification before becoming active)

**Request Body:**
```json
{
  "email": "driver@example.com",
  "password": "Password123",
  "full_name": "Jane Driver",
  "phone": "+264822222222",
  "vehicle_type": "PICKUP",
  "license_plate": "N 123 ABC",
  "license_number": "DL123456",
  "license_expiry": "2027-12-31",
  "vehicle_make": "Toyota",
  "vehicle_model": "Hilux",
  "vehicle_year": 2020
}
```

**Required Fields:**
- email
- password
- full_name
- phone
- vehicle_type
- license_plate
- license_number

**Optional Fields:**
- license_expiry
- vehicle_make
- vehicle_model
- vehicle_year

**Valid Vehicle Types:**
- BIKE
- CAR
- VAN
- PICKUP
- TRUCK

**Success Response (201):**
```json
{
  "success": true,
  "message": "Driver registered successfully. Pending verification.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "driver@example.com",
      "full_name": "Jane Driver",
      "phone": "+264822222222",
      "user_type": "driver",
      "created_at": "2026-01-18T11:40:22.514Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400`: Missing required fields, invalid format, or invalid vehicle type
- `409`: User, license plate, or license number already exists
- `500`: Registration failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register/driver \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@example.com",
    "password": "Password123",
    "full_name": "Jane Driver",
    "phone": "+264822222222",
    "vehicle_type": "PICKUP",
    "license_plate": "N 123 ABC",
    "license_number": "DL123456",
    "vehicle_make": "Toyota",
    "vehicle_model": "Hilux"
  }'
```

---

### 3. Login

**Endpoint:** `POST /api/v1/auth/login`

**Description:** Login with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "User Name",
      "phone": "+264811234567",
      "user_type": "client",
      "status": "active"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials or account not active
- `500`: Login failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

---

### 4. Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Description:** Get current authenticated user's information

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "User Name",
      "phone": "+264811234567",
      "user_type": "client",
      "status": "active",
      "profile_photo": null,
      "email_verified": false,
      "phone_verified": false,
      "created_at": "2026-01-18T11:34:04.117Z",
      "vehicle_type": null,
      "license_plate": null,
      "verification_status": null,
      "rating": null,
      "total_jobs": null,
      "total_earnings": null,
      "availability_status": null
    }
  }
}
```

**For Driver Users:**
The response includes driver-specific fields:
- `vehicle_type`: PICKUP, CAR, etc.
- `license_plate`: Vehicle license plate
- `verification_status`: pending, verified, or rejected
- `rating`: Driver rating (0-5)
- `total_jobs`: Number of jobs completed
- `total_earnings`: Total earnings
- `availability_status`: online, offline, or busy

**Error Responses:**
- `401`: No token provided, invalid token, or token expired
- `500`: Failed to get user

**Example:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### 5. Refresh Access Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Description:** Get a new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "User Name",
      "phone": "+264811234567",
      "user_type": "client",
      "status": "active"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Notes:**
- Old refresh token is automatically revoked
- New refresh token is provided
- Both access and refresh tokens are renewed

**Error Responses:**
- `400`: Refresh token not provided
- `401`: Invalid, expired, or revoked refresh token
- `500`: Token refresh failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

---

### 6. Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Logout user by revoking refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `400`: Refresh token not provided
- `500`: Logout failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

---

## Token Information

### Access Token
- **Expiry:** 15 minutes
- **Use:** Include in `Authorization` header for protected endpoints
- **Format:** `Authorization: Bearer <accessToken>`

### Refresh Token
- **Expiry:** 7 days
- **Use:** Obtain new access tokens without re-login
- **Storage:** Store securely (e.g., httpOnly cookie in production)

### Token Payload
Both tokens contain:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "userType": "client",
  "iat": 1768736044,
  "exp": 1768736944
}
```

---

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter (when using frontend validation)
- At least one number (when using frontend validation)
- Hashed with bcrypt (12 rounds)

### Phone Number Format
- Must be Namibian format: `+264XXXXXXXXX`
- Example: `+264811234567`

### Email Format
- Must be valid email format
- Converted to lowercase
- Trimmed of whitespace

### Account Status
- Users must have `status = 'active'` to login
- Suspended users cannot login
- Drivers must be verified to accept jobs (but can login)

---

## Error Handling

All endpoints follow consistent error format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Common Error Codes
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (invalid/expired credentials)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (duplicate email/phone)
- `500` - Internal Server Error

---

## Testing the API

### Complete Registration and Login Flow

1. **Register a client:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","full_name":"Test User","phone":"+264811234567"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

3. **Save the tokens from response**

4. **Get current user:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

5. **Refresh token:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

6. **Logout:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## Integration with Frontend

### Storing Tokens
```javascript
// After successful login or registration
const { accessToken, refreshToken, user } = response.data;

// Store in localStorage (for development)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

### Making Authenticated Requests
```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Handling Token Expiration
```javascript
// If you get 401 with TOKEN_EXPIRED code
if (error.code === 'TOKEN_EXPIRED') {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const { accessToken: newToken } = response.data;
  localStorage.setItem('accessToken', newToken);

  // Retry original request with new token
}
```

---

## Database Tables Used

### users
- `id` - UUID
- `email` - VARCHAR(255) UNIQUE
- `phone` - VARCHAR(20) UNIQUE
- `password_hash` - VARCHAR(255)
- `full_name` - VARCHAR(255)
- `user_type` - ENUM (client, driver, admin)
- `status` - ENUM (active, inactive, suspended)
- `profile_photo` - VARCHAR(500)
- `email_verified` - BOOLEAN
- `phone_verified` - BOOLEAN
- `last_login` - TIMESTAMP
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### driver_profiles
- `id` - UUID
- `user_id` - UUID (references users.id)
- `vehicle_type` - ENUM (BIKE, CAR, VAN, PICKUP, TRUCK)
- `license_plate` - VARCHAR(50) UNIQUE
- `license_number` - VARCHAR(100) UNIQUE
- `license_expiry` - DATE
- `vehicle_make` - VARCHAR(100)
- `vehicle_model` - VARCHAR(100)
- `vehicle_year` - INTEGER
- `verification_status` - ENUM (pending, verified, rejected)
- `rating` - DECIMAL(3,2)
- `total_jobs` - INTEGER
- `total_earnings` - DECIMAL(10,2)
- `availability_status` - VARCHAR(20)
- And more...

### refresh_tokens
- `id` - UUID
- `user_id` - UUID (references users.id)
- `token` - VARCHAR(500) UNIQUE
- `expires_at` - TIMESTAMP
- `revoked` - BOOLEAN
- `revoked_at` - TIMESTAMP
- `created_at` - TIMESTAMP

---

## Admin User

A default admin user is created during migration:

- **Email:** admin@ezmove.na
- **Password:** Admin123456
- **Phone:** +264811234567
- **Type:** admin

**⚠️ IMPORTANT:** Change this password in production!

---

## Next Steps

Now that authentication is working, you can:

1. **Implement Job Routes** - Create, list, accept, complete jobs
2. **Add Driver Routes** - Location updates, availability status
3. **Create Admin Routes** - User management, dashboard statistics
4. **Integrate with Frontend** - Connect your React app to these endpoints
5. **Add Real-time Features** - Socket.IO for live tracking
6. **Implement Payments** - Payment gateway integration

---

**Documentation updated:** 2026-01-18
**Status:** ✅ All endpoints tested and working
**Base URL:** http://localhost:3000/api/v1/auth
