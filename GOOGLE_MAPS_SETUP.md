# Google Maps API Setup Guide

## Overview
EZMove now includes Google Maps integration for address autocomplete, geocoding, and route calculation. This guide will help you set up the Google Maps API.

## Features Enabled
- ✅ Address autocomplete (as you type)
- ✅ Geocoding (convert addresses to coordinates)
- ✅ Route calculation (distance and duration)
- ✅ Automatic price calculation based on real routes
- ✅ Fallback to mock data when API is not configured

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `EZMove Logistics`
4. Click "Create"

### 2. Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
   - **Directions API**

Click "Enable" for each API.

### 3. Create API Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Your API key will be generated (looks like: `AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
4. Click "Edit API key" to configure restrictions

### 4. Restrict Your API Key (Important for Security)

**Application Restrictions:**
- Select "HTTP referrers (web sites)"
- Add these referrers:
  ```
  http://localhost:8001/*
  http://localhost:8000/*
  https://yourdomain.com/*
  ```

**API Restrictions:**
- Select "Restrict key"
- Select these APIs:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Directions API

Click "Save"

### 5. Add API Key to Your Application

#### Option A: Frontend Only (Development)

Open `index.html` and replace the placeholder API key:

```html
<!-- Find this line (around line 13): -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&libraries=places&callback=Function.prototype"></script>

<!-- Replace with your actual API key: -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places&callback=Function.prototype"></script>
```

#### Option B: Backend Configuration (Production)

1. Add to `backend/.env`:
```env
GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

2. Create an endpoint in backend to serve the key securely:
```javascript
// backend/src/routes/configRoutes.js
router.get('/maps-config', authenticate, (req, res) => {
  res.json({
    apiKey: process.env.GOOGLE_MAPS_API_KEY
  });
});
```

3. Update frontend to fetch the key from backend

### 6. Test the Integration

1. Start your servers:
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
python3 -m http.server 8001
```

2. Open http://localhost:8001

3. Navigate to "Create New Job"

4. Start typing in the "Pickup Location" field:
   - If Maps API is working: You'll see autocomplete suggestions
   - If not configured: You'll see mock Namibian locations (fallback mode)

5. Select an address from suggestions

6. The app will:
   - Geocode the address to get coordinates
   - Calculate the route distance and duration
   - Display estimated price based on real route

## Pricing

Google Maps Platform offers a **$200 free credit per month**.

### Cost Breakdown (as of 2024):
- **Maps JavaScript API**: $7 per 1000 loads
- **Places API (Autocomplete)**: $2.83 per 1000 requests
- **Geocoding API**: $5 per 1000 requests
- **Directions API**: $5 per 1000 requests

### Example Monthly Usage:
- 1000 job creations = ~$20
- With $200 free credit = **~10,000 jobs per month FREE**

## Fallback Mode

The app works **without** Google Maps API:

**With API:**
- Real address autocomplete
- Accurate geocoding
- Precise route calculation
- Traffic-aware estimates

**Without API (Fallback):**
- Mock Namibian location suggestions
- Default Windhoek coordinates
- Haversine distance calculation
- Basic time estimates

This means the app is functional immediately, even before setting up Google Maps!

## Troubleshooting

### Issue: "This page can't load Google Maps correctly"

**Solution:** Check your API key:
1. Verify the key in `index.html` is correct
2. Check API key restrictions in Google Cloud Console
3. Ensure all required APIs are enabled
4. Check browser console for specific error messages

### Issue: Autocomplete not working

**Solution:**
1. Check browser console for errors
2. Verify "Places API" is enabled
3. Check HTTP referrer restrictions
4. Clear browser cache and reload

### Issue: "You have exceeded your request quota"

**Solution:**
1. Check usage in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing (required after free tier)
3. Set up budget alerts
4. Implement caching to reduce requests

### Issue: CORS errors

**Solution:**
1. Verify HTTP referrers in API key restrictions
2. Make sure you're accessing via `http://localhost:8001` not `file://`
3. Check that callback parameter is set: `&callback=Function.prototype`

## Best Practices

### 1. Caching
Cache geocoded addresses to reduce API calls:
```javascript
const addressCache = {};

async function geocodeWithCache(address) {
  if (addressCache[address]) {
    return addressCache[address];
  }

  const result = await MapsService.geocodeAddress(address);
  addressCache[address] = result;
  return result;
}
```

### 2. Request Throttling
Limit autocomplete requests:
```javascript
let autocompleteTimer;

function handleAddressInput(input) {
  clearTimeout(autocompleteTimer);
  autocompleteTimer = setTimeout(() => {
    fetchSuggestions(input);
  }, 300); // Wait 300ms after user stops typing
}
```

### 3. Error Handling
Always have fallbacks:
```javascript
try {
  const route = await MapsService.calculateRoute(origin, dest);
} catch (error) {
  console.error('Maps API error:', error);
  // Use Haversine distance as fallback
  const distance = MapsService.calculateDistance(...);
}
```

### 4. Monitor Usage
Set up budget alerts in Google Cloud:
1. Go to "Billing" → "Budgets & alerts"
2. Create budget for Maps Platform APIs
3. Set alert at 50%, 75%, 90% of budget

## Alternative: Mapbox

If you prefer Mapbox over Google Maps:

**Pros:**
- Better pricing (free tier: 100,000 requests/month)
- Modern developer experience
- Great documentation

**Cons:**
- Less accurate in some regions
- Fewer users = less business data

To switch to Mapbox, replace the Maps service implementation with Mapbox SDK.

## Production Deployment

Before going live:

1. **Update API Key Restrictions:**
   - Add your production domain
   - Remove localhost referrers
   - Keep restrictions enabled

2. **Enable Billing:**
   - Add a payment method
   - Set budget alerts
   - Monitor usage regularly

3. **Implement Caching:**
   - Cache geocoded addresses in database
   - Store common routes
   - Use CDN for static maps

4. **Rate Limiting:**
   - Limit API calls per user
   - Implement request queuing
   - Add exponential backoff

## Support

For Google Maps API issues:
- [Documentation](https://developers.google.com/maps/documentation)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps)
- [Google Maps Platform Support](https://developers.google.com/maps/support)

For EZMove integration issues:
- Check browser console for errors
- Review `maps-service.js` implementation
- Test with fallback mode first

---

**Next Steps:**
1. Get your Google Maps API key
2. Add it to `index.html`
3. Test address autocomplete
4. Create a job and verify pricing calculation
5. Monitor your usage in Google Cloud Console

The Maps integration will make your platform feel professional and production-ready! 🗺️
