# 🚀 E-Hail Logistics - Quick Start

## What You've Got

A **complete, production-ready** e-hailing logistics application for Namibia with:

✅ Client app for requesting deliveries  
✅ Driver app for accepting jobs  
✅ Real-time tracking with Socket.io  
✅ Digital waybills and load manifests  
✅ Automated pricing calculations  
✅ Full authentication system  
✅ SQLite database with demo data  
✅ Modern React UI with Tailwind CSS  
✅ RESTful API with Express.js  

## 🎯 Start in 3 Steps

### 1. Setup (One-time)

Open the `ehail-logistics` folder in **VS Code** or **Claude Code**, then run:

```bash
./setup.sh
```

Or manually:
```bash
# Install server dependencies
cd server && npm install && npm run init-db

# Install client dependencies  
cd ../client && npm install
```

### 2. Start Servers (Every time)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 3. Open & Test

Visit: **http://localhost:5173**

**Demo Accounts:**
- Client: `client@test.na` / `client123`
- Driver: `driver@test.na` / `driver123`
- Admin: `admin@ehail.na` / `admin123`

## 🎮 Try It Out

1. **As Client:**
   - Login with client account
   - Click "New Booking"
   - Fill in pickup/delivery addresses
   - Create booking
   - See price estimate

2. **As Driver (new tab/browser):**
   - Login with driver account
   - Toggle "Online"
   - See available trips
   - Accept a trip
   - Start trip → Complete trip
