# Quick API Reference Card

## 🎯 Backend URLs

### New Backend (Port 3000)
**Only has 2 endpoints right now:**

```bash
# API Info
GET http://localhost:3000/

# Health Check
GET http://localhost:3000/health
```

**Anything else will return:** `{"error":"Route not found"}`

---

### Existing Backend (Port 3001) ✅ FULL FEATURES

**Important:** All routes need the `/api` prefix!

#### ✅ Working Endpoints (No Auth Required)

```bash
# These work without authentication:
POST http://localhost:3001/api/auth/register/client
POST http://localhost:3001/api/auth/register/driver
POST http://localhost:3001/api/auth/login
```

#### 🔒 Protected Endpoints (Need Token)

```bash
# These need Authorization header:
GET  http://localhost:3001/api/auth/me
GET  http://localhost:3001/api/jobs
POST http://localhost:3001/api/jobs
GET  http://localhost:3001/api/admin/dashboard/stats
# ... and many more
```

---

## 🚀 Quick Test Examples

### Test New Backend (Port 3000)

```bash
# Test root
curl http://localhost:3000/

# Test health
curl http://localhost:3000/health

# Wrong route (will fail)
curl http://localhost:3000/api/test
# Returns: {"error":"Route not found","path":"/api/test"}
```

### Test Existing Backend (Port 3001)

```bash
# Register a new client
curl -X POST http://localhost:3001/api/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@test.com",
    "password": "Demo123456",
    "full_name": "Demo User",
    "phone": "+264811111111"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@test.com",
    "password": "Demo123456"
  }'

# Save the token from response, then:
TOKEN="paste-your-token-here"

# Get your user info
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Get jobs
curl http://localhost:3001/api/jobs \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Access from Browser

### Option 1: Use Your Frontend (EASIEST)

Just open: `http://localhost:8001`

The frontend is **already connected** to the backend. When you:
- Register → Calls `POST /api/auth/register/client`
- Login → Calls `POST /api/auth/login`
- Create Job → Calls `POST /api/jobs`
- View Jobs → Calls `GET /api/jobs`

**No extra setup needed!** ✨

### Option 2: Direct Browser Access

Open in browser (GET requests only):

```
✅ http://localhost:3000/
✅ http://localhost:3000/health
❌ http://localhost:3001/api/auth/me (needs token)
```

### Option 3: Browser DevTools

1. Open `http://localhost:8001`
2. Press F12 (or Cmd+Option+I on Mac)
3. Go to **Network** tab
4. Login or create a job
5. See all API calls in real-time!

---

## 🔑 Common Errors & Solutions

### Error: "Route not found"

**Cause:** Wrong URL or endpoint doesn't exist

**Solutions:**
```bash
# ❌ Wrong
http://localhost:3001/auth/login        # Missing /api
http://localhost:3000/api/jobs          # Endpoint doesn't exist yet
http://localhost:3001/api/nonexistent   # Route doesn't exist

# ✅ Correct
http://localhost:3001/api/auth/login    # Has /api prefix
http://localhost:3000/health            # Endpoint exists
http://localhost:3001/api/jobs          # Valid route
```

### Error: "No token provided"

**Cause:** Trying to access protected route without authentication

**Solution:**
```bash
# 1. Login first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# 2. Copy the accessToken from response

# 3. Use it in subsequent requests
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Error: "CORS error" (in browser)

**Cause:** Frontend on different origin than configured

**Solution:** Backend is configured for `http://localhost:8001`. If you're using a different port, update the `.env` file:

```bash
# In backend/.env
CORS_ORIGINS=http://localhost:8001,http://localhost:YOUR_PORT
```

---

## 📊 Quick Status Check

```bash
# Check all servers
lsof -i:8001  # Frontend
lsof -i:3001  # Existing backend
lsof -i:3000  # New backend

# Test connectivity
curl http://localhost:8001/     # Frontend
curl http://localhost:3001/api  # Existing backend (might error, that's ok)
curl http://localhost:3000/     # New backend
```

---

## 🎯 Which Backend for What?

### Use Existing Backend (3001) for:
- ✅ Actual development
- ✅ Testing full features
- ✅ Connecting your frontend
- ✅ User registration/login
- ✅ Job management
- ✅ Driver features
- ✅ Admin dashboard

### Use New Backend (3000) for:
- ✅ Learning clean architecture
- ✅ Building new features from scratch
- ✅ Understanding backend structure
- ✅ Future expansion

---

## 💡 Pro Tips

### 1. Use Browser for Frontend
The easiest way to use the API is through your frontend at `http://localhost:8001`

### 2. Use Postman for API Testing
Download Postman (free): https://www.postman.com/downloads/

Create a new request:
- Method: POST
- URL: `http://localhost:3001/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "test@test.com",
    "password": "Test123"
  }
  ```

### 3. Save Your Token
After login, save the `accessToken` in Postman's environment variables for easy reuse.

### 4. Check Network Tab
When using the frontend, open DevTools → Network tab to see:
- Which endpoints are being called
- What data is being sent
- What responses you're getting
- Any errors

---

## 🚀 Next Steps

1. **Test the frontend**: Open `http://localhost:8001`
2. **Register a user**: Use the registration form
3. **Login**: Use the credentials you just created
4. **Create a job**: Test the job creation flow
5. **Check Network tab**: See the API calls happening

**Everything is ready to go!** 🎉

---

**Need more help?** Check out:
- [BACKEND_ACCESS_GUIDE.md](./BACKEND_ACCESS_GUIDE.md) - Full API documentation
- [PRODUCTION_FEATURES.md](./PRODUCTION_FEATURES.md) - Frontend features
- [README.md](./ezmove-backend/README.md) - New backend setup
