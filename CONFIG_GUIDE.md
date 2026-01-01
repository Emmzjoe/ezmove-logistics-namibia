# Configuration Guide

This file contains configuration templates for when you're ready to integrate with backend APIs.

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=https://api.swifthaul.na
REACT_APP_API_KEY=your_api_key_here

# Google Maps API (for real-time tracking)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Payment Gateway
REACT_APP_PAYMENT_API_URL=https://payment.swifthaul.na
REACT_APP_PAYMENT_API_KEY=your_payment_key

# Mobile Money Integration (Namibia)
REACT_APP_MTC_API_KEY=your_mtc_key
REACT_APP_TN_MOBILE_API_KEY=your_tn_mobile_key

# SMS Service (for notifications)
REACT_APP_SMS_API_KEY=your_sms_api_key
REACT_APP_SMS_SENDER_ID=EZMove

# App Configuration
REACT_APP_NAME=EZMove
REACT_APP_SUPPORT_EMAIL=support@ezmove.na
REACT_APP_SUPPORT_PHONE=+264 81 234 5678
```

## Backend API Endpoints

When you build your backend, use these endpoint structures:

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

### Jobs (Client)
```
GET    /api/jobs                   - Get all jobs for current user
GET    /api/jobs/:id               - Get specific job details
POST   /api/jobs                   - Create new job
PATCH  /api/jobs/:id               - Update job
DELETE /api/jobs/:id               - Cancel job
GET    /api/jobs/:id/waybill       - Get waybill PDF
GET    /api/jobs/:id/track         - Get real-time tracking data
```

### Jobs (Driver)
```
GET    /api/driver/jobs/available  - Get available jobs
GET    /api/driver/jobs/active     - Get driver's active jobs
GET    /api/driver/jobs/history    - Get completed jobs
POST   /api/driver/jobs/:id/accept - Accept a job
POST   /api/driver/jobs/:id/start  - Start delivery
POST   /api/driver/jobs/:id/complete - Complete delivery
POST   /api/driver/jobs/:id/location - Update driver location
```

### Drivers
```
GET    /api/drivers                - Get all drivers (admin)
GET    /api/drivers/nearby         - Get drivers near location
GET    /api/drivers/:id            - Get driver profile
POST   /api/drivers                - Register new driver
PATCH  /api/drivers/:id            - Update driver profile
POST   /api/drivers/:id/verify     - Verify driver (admin)
POST   /api/drivers/:id/documents  - Upload driver documents
```

### Vehicles
```
GET    /api/vehicles               - Get all vehicles
GET    /api/vehicles/:id           - Get vehicle details
POST   /api/vehicles               - Register new vehicle
PATCH  /api/vehicles/:id           - Update vehicle
DELETE /api/vehicles/:id           - Remove vehicle
```

### Payments
```
POST   /api/payments/initiate      - Start payment
POST   /api/payments/verify        - Verify payment status
GET    /api/payments/history       - Get payment history
POST   /api/payments/refund        - Request refund
```

### Ratings & Reviews
```
POST   /api/ratings                - Submit rating
GET    /api/ratings/driver/:id     - Get driver ratings
GET    /api/ratings/job/:id        - Get job ratings
```

### Notifications
```
GET    /api/notifications          - Get user notifications
PATCH  /api/notifications/:id/read - Mark as read
POST   /api/notifications/preferences - Update notification settings
```

### Analytics (Admin)
```
GET    /api/analytics/overview     - Dashboard overview
GET    /api/analytics/revenue      - Revenue statistics
GET    /api/analytics/jobs         - Job statistics
GET    /api/analytics/drivers      - Driver statistics
GET    /api/analytics/clients      - Client statistics
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20) UNIQUE NOT NULL,
  user_type ENUM('client', 'driver', 'admin'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Drivers Table
```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  license_number VARCHAR(50) UNIQUE,
  license_expiry DATE,
  id_number VARCHAR(50) UNIQUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_jobs INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id),
  vehicle_type ENUM('PICKUP', 'SMALL_TRUCK', 'FLATBED', 'LARGE_TRUCK'),
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  make VARCHAR(50),
  model VARCHAR(50),
  year INT,
  capacity VARCHAR(50),
  color VARCHAR(30),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  distance DECIMAL(10, 2),
  estimated_time INT,
  load_type VARCHAR(100),
  weight VARCHAR(50),
  volume VARCHAR(50),
  value DECIMAL(10, 2),
  instructions TEXT,
  vehicle_type ENUM('PICKUP', 'SMALL_TRUCK', 'FLATBED', 'LARGE_TRUCK'),
  price DECIMAL(10, 2) NOT NULL,
  driver_earnings DECIMAL(10, 2),
  status ENUM('pending', 'accepted', 'in-progress', 'completed', 'cancelled'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'mobile_money', 'bank_transfer', 'card'),
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'refunded'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### Ratings Table
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  rater_id UUID REFERENCES users(id),
  ratee_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Mobile Money Integration (Namibia)

### MTC Mobile Money
```javascript
// Example integration
const initiateMTCPayment = async (amount, phone) => {
  const response = await fetch('https://api.mtc.com.na/payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MTC_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      msisdn: phone,
      reference: 'SWIFTHAUL-' + Date.now()
    })
  });
  return response.json();
};
```

### Telecom Namibia Mobile
```javascript
const initiateTNPayment = async (amount, phone) => {
  const response = await fetch('https://api.telecom.na/payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TN_MOBILE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      phone_number: phone,
      merchant_id: 'SWIFTHAUL'
    })
  });
  return response.json();
};
```

## SMS Integration

```javascript
const sendSMS = async (phone, message) => {
  const response = await fetch('https://api.sms-provider.na/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: phone,
      message: message,
      sender_id: 'EZMove'
    })
  });
  return response.json();
};
```

## Google Maps Integration

```javascript
// Initialize map
const initMap = () => {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -22.5609, lng: 17.0658 }, // Windhoek
    zoom: 12
  });
  return map;
};

// Geocode address
const geocodeAddress = async (address) => {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        resolve(results[0].geometry.location);
      } else {
        reject(status);
      }
    });
  });
};

// Calculate route
const calculateRoute = async (origin, destination) => {
  const directionsService = new google.maps.DirectionsService();
  return new Promise((resolve, reject) => {
    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK') {
        resolve(result);
      } else {
        reject(status);
      }
    });
  });
};
```

## WebSocket for Real-time Updates

```javascript
// Server-side (Node.js with Socket.io)
io.on('connection', (socket) => {
  socket.on('join-job', (jobId) => {
    socket.join(`job-${jobId}`);
  });

  socket.on('driver-location', (data) => {
    io.to(`job-${data.jobId}`).emit('location-update', data.location);
  });

  socket.on('job-status-update', (data) => {
    io.to(`job-${data.jobId}`).emit('status-changed', data.status);
  });
});

// Client-side
const socket = io(process.env.REACT_APP_API_URL);

socket.on('connect', () => {
  socket.emit('join-job', jobId);
});

socket.on('location-update', (location) => {
  updateDriverMarker(location);
});

socket.on('status-changed', (status) => {
  updateJobStatus(status);
});
```

## Security Best Practices

1. **Always use HTTPS** in production
2. **Implement JWT** for authentication
3. **Validate all inputs** on both client and server
4. **Use environment variables** for sensitive data
5. **Implement rate limiting** on API endpoints
6. **Hash passwords** with bcrypt (minimum 10 rounds)
7. **Sanitize user input** to prevent XSS attacks
8. **Use CORS** properly to restrict API access
9. **Implement CSRF** protection
10. **Regular security audits** and dependency updates

---

This configuration guide will help you when you're ready to build the backend and integrate with real services!
