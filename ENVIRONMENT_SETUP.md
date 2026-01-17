# Environment Configuration Guide

## Overview

EZMove uses centralized configuration to manage environment-specific settings, making it easy to switch between development and production environments.

## Files

- **`.env.development`** - Development environment variables
- **`.env.production`** - Production environment variables
- **`.env.example`** - Template file (commit this to git)
- **`config.js`** - Centralized configuration singleton

## Quick Start

### 1. Create Your Environment File

```bash
# For development
cp .env.example .env.development

# For production
cp .env.example .env.production
```

### 2. Configure Your Settings

Edit `.env.development` and add your actual values:

```env
# API Configuration
API_URL=http://localhost:3001/api
SOCKET_URL=http://localhost:3001

# Google Maps API Key
GOOGLE_MAPS_API_KEY=AIzaSyB...your-actual-key...

# Enable/disable features
ENABLE_ANALYTICS=false
ENABLE_PWA=false
```

### 3. Load Configuration

The configuration is automatically loaded when the application starts. The `config.js` file detects whether you're on `localhost` or a production domain and loads the appropriate settings.

## Configuration Details

### API URLs

The application automatically uses the correct API URL based on environment:

- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.ezmove.na/api`

### Pricing Configuration

All pricing is centralized and consistent across environments:

```javascript
// Access pricing in your code
const config = window.AppConfig;
const price = config.calculatePrice(distance, duration, vehicleType);
```

**Default Values:**
- Base Price: NAD 50
- Price per KM: NAD 8
- Price per Minute: NAD 2
- Platform Commission: 20%

**Vehicle Multipliers:**
- Bakkie/Pickup: 1.0x
- Van: 1.3x
- Truck: 1.8x
- Flatbed: 2.0x

### Feature Flags

Control which features are enabled:

```javascript
if (window.AppConfig.isFeatureEnabled('ANALYTICS')) {
  // Initialize analytics
}

if (window.AppConfig.isFeatureEnabled('PWA')) {
  // Register service worker
}
```

**Available Features:**
- `ANALYTICS` - Google Analytics tracking
- `PWA` - Progressive Web App features
- `PHOTO_PROOF` - Photo proof of delivery (always enabled)
- `JOB_SCHEDULING` - Schedule jobs for later (always enabled)
- `DRIVER_VERIFICATION` - Driver verification system (always enabled)
- `REAL_TIME_TRACKING` - Real-time location tracking (always enabled)
- `SMS_NOTIFICATIONS` - SMS notifications (disabled until Twilio configured)
- `PAYMENT_PROCESSING` - Payment gateway (disabled until configured)

## Using the Configuration

### In JavaScript Files

```javascript
// Get the config singleton
const config = window.AppConfig;

// Get API endpoints
const endpoint = config.endpoints.CREATE_JOB;

// Calculate pricing
const price = config.calculatePrice(15.5, 25, 'pickup');

// Calculate driver earnings
const earnings = config.calculateDriverEarnings(200);

// Validate file uploads
const validation = config.validateFile(file, 'image');
if (!validation.valid) {
  console.error(validation.error);
}

// Check environment
if (config.isDevelopment()) {
  console.log('Running in development mode');
}

// Get status colors for UI
const colors = config.getStatusColors('in_progress');
// Returns: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' }
```

### In React Components

```jsx
function MyComponent() {
  const config = window.AppConfig;

  const handleCreateJob = async () => {
    const response = await fetch(config.endpoints.CREATE_JOB, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
  };

  return (
    <div className={config.getStatusColors(job.status).bg}>
      Price: NAD {config.calculatePrice(distance, duration, vehicleType)}
    </div>
  );
}
```

## Configuration Properties

### `config.API_URL`
Base URL for all API requests

### `config.SOCKET_URL`
Socket.IO server URL for real-time features

### `config.pricing`
Object containing pricing configuration:
- `BASE_PRICE`
- `PRICE_PER_KM`
- `PRICE_PER_MIN`
- `PLATFORM_COMMISSION`

### `config.vehicleMultipliers`
Object mapping vehicle types to price multipliers

### `config.endpoints`
All API endpoints:
- `REGISTER`, `LOGIN`, `VERIFY_EMAIL`
- `JOBS`, `CREATE_JOB`, `UPDATE_JOB`, etc.
- `UPDATE_LOCATION`, `GET_DRIVER_LOCATION`
- `ADMIN_STATS`, `ADMIN_USERS`, etc.

### `config.maps`
Google Maps configuration:
- `API_KEY`
- `DEFAULT_CENTER` (Windhoek coordinates)
- `DEFAULT_ZOOM`
- `COUNTRY_RESTRICTION`
- `AUTOCOMPLETE_TYPES`

### `config.socket`
Socket.IO configuration:
- `URL`
- `OPTIONS` (reconnection settings)

### `config.features`
Feature flags object

### `config.upload`
File upload limits and allowed types

### `config.limits`
Timeouts and rate limits:
- `API_TIMEOUT`
- `LOCATION_UPDATE_INTERVAL`
- `JOB_REFRESH_INTERVAL`
- `MAX_RETRY_ATTEMPTS`
- `DEBOUNCE_DELAY`

### `config.statusColors`
UI color classes for each job status

## Helper Methods

### `calculatePrice(distance, duration, vehicleType)`
Calculate job price based on distance (km), duration (minutes), and vehicle type.

```javascript
const price = config.calculatePrice(15.5, 25, 'pickup');
// Returns: 272 (NAD)
```

### `calculateDriverEarnings(totalPrice)`
Calculate driver earnings after platform commission.

```javascript
const earnings = config.calculateDriverEarnings(200);
// Returns: 160 (NAD) - 80% of 200
```

### `getStatusColors(status)`
Get Tailwind CSS color classes for a job status.

```javascript
const colors = config.getStatusColors('accepted');
// Returns: { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-500' }
```

### `validateFile(file, type)`
Validate file uploads.

```javascript
const validation = config.validateFile(photoFile, 'image');
if (!validation.valid) {
  alert(validation.error); // "Image size must be less than 5MB"
}
```

### `isFeatureEnabled(featureName)`
Check if a feature is enabled.

```javascript
if (config.isFeatureEnabled('ANALYTICS')) {
  trackEvent('job_created');
}
```

### `isDevelopment()` / `isProduction()`
Check current environment.

```javascript
if (config.isDevelopment()) {
  console.log('Debug info:', data);
}
```

## Changing Configuration Values

### Pricing Updates

To change pricing across the entire platform:

1. Update `.env.development` or `.env.production`
2. Reload the application
3. All calculations will use new values

**Example:**
```env
# Increase base price to NAD 60
BASE_PRICE=60

# Increase per-km rate to NAD 10
PRICE_PER_KM=10
```

### Adding New Endpoints

Add new endpoints to `config.js`:

```javascript
// In config.js endpoints section
this.endpoints = {
  // ... existing endpoints
  NEW_FEATURE: `${this.API_URL}/new-feature`,
  GET_REPORT: (id) => `${this.API_URL}/reports/${id}`,
};
```

Then use in your code:

```javascript
const response = await fetch(config.endpoints.NEW_FEATURE);
```

### Adding New Feature Flags

Add to `config.js` features section:

```javascript
this.features = {
  // ... existing features
  MY_NEW_FEATURE: process.env.ENABLE_MY_FEATURE || false,
};
```

Add to `.env.development`:

```env
ENABLE_MY_FEATURE=true
```

Use in code:

```javascript
if (config.isFeatureEnabled('MY_NEW_FEATURE')) {
  // Enable feature
}
```

## Environment Detection

The configuration automatically detects the environment:

- **Development**: Running on `localhost` or `127.0.0.1`
- **Production**: Any other domain

You can override this by manually setting values in `localStorage`:

```javascript
// Temporarily use production API in development
localStorage.setItem('API_URL_OVERRIDE', 'https://api.ezmove.na/api');
```

## Security Best Practices

### Never Commit Secrets

- ✅ **DO** commit: `.env.example`
- ❌ **DON'T** commit: `.env.development`, `.env.production`

The `.gitignore` file already excludes these files.

### API Key Storage

For Google Maps API key:

**Development:**
Store in `localStorage` for quick testing:
```javascript
localStorage.setItem('GOOGLE_MAPS_API_KEY', 'AIzaSyB...');
```

**Production:**
- Use environment variables injected at build time
- Or serve from backend API with proper authentication
- Never expose production keys in frontend code

### Sensitive Configuration

Move sensitive config to backend:

```javascript
// Backend: /api/config
router.get('/config', authenticate, (req, res) => {
  res.json({
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    // Only send non-sensitive config to frontend
  });
});
```

## Migration from Hardcoded Values

The following values have been migrated to config:

### Before (Hardcoded):
```javascript
const BASE_PRICE = 50;
const PRICE_PER_KM = 8;
const API_URL = 'http://localhost:3001/api';
```

### After (Centralized):
```javascript
const config = window.AppConfig;
const BASE_PRICE = config.pricing.BASE_PRICE;
const PRICE_PER_KM = config.pricing.PRICE_PER_KM;
const API_URL = config.API_URL;
```

## Troubleshooting

### Config Not Loaded

**Symptom:** `window.AppConfig is undefined`

**Solution:**
1. Check that `config.js` is loaded before other scripts in `index.html`
2. Check browser console for errors
3. Verify `config.js` exists in the project root

### Wrong Environment Detected

**Symptom:** Production API used in development

**Solution:**
1. Check `window.location.hostname` in browser console
2. Verify you're accessing via `http://localhost:8001`
3. Clear `localStorage` to remove any overrides

### Pricing Calculation Wrong

**Symptom:** Unexpected prices

**Solution:**
1. Check `.env` file has correct pricing values
2. Reload application to pick up changes
3. Check console: `console.log(window.AppConfig.pricing)`

## Example: Full Job Creation Flow

```javascript
// Using centralized configuration throughout

const config = window.AppConfig;

// 1. Get addresses from Maps API (configured via config)
const suggestions = await MapsService.getAddressSuggestions(input);

// 2. Calculate route
const route = await MapsService.calculateRoute(pickup, delivery);

// 3. Calculate price using config
const price = config.calculatePrice(
  route.distance.km,
  route.duration.minutes,
  'pickup'
);

// 4. Calculate driver earnings
const driverEarnings = config.calculateDriverEarnings(price);

// 5. Create job via API (endpoint from config)
const response = await fetch(config.endpoints.CREATE_JOB, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pickup_address: pickup.address,
    delivery_address: delivery.address,
    total_price: price,
    driver_earnings: driverEarnings,
    // ... other fields
  })
});
```

## Next Steps

1. Copy `.env.example` to `.env.development`
2. Add your Google Maps API key
3. Customize pricing if needed
4. Run the application and verify configuration loads
5. Check browser console for config debug info (development only)

---

**Configuration Status:** ✅ Production Ready

For questions or issues, refer to the main [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) documentation.
