# EZMove - E-Hailing Logistics Platform

A full-featured e-hailing logistics application for Namibia, similar to inDrive and Yango but specifically designed for goods delivery and transport services.

## 🚀 Features

### 🔐 Authentication & User Management (NEW!)
- **Client Sign-Up & Login**: Secure account creation with email/password
- **Driver Registration**: Complete driver onboarding with vehicle details
- **Session Management**: Automatic login persistence across page reloads
- **Password Security**: Password hashing and validation
- **Profile Management**: Store user information securely in localStorage
- **Demo Accounts**: Pre-loaded driver accounts for testing (see AUTHENTICATION_GUIDE.md)

### Client Features
- **User Account**: Sign up or login to access personalized dashboard
- **Request Transport**: Book pickup trucks, small trucks, flatbeds, and large trucks
- **Real-time Cost Estimation**: See pricing before confirming booking
- **Digital Waybill**: Automatic generation of load manifests for each job
- **Job Tracking**: Monitor active and completed deliveries
- **Multiple Load Types**: Support for furniture, electronics, food, construction materials, waste disposal, and more
- **Detailed Job Information**: Track distance, time, weight, volume, and special instructions
- **Order History**: View all past deliveries

### Driver Features
- **Driver Account**: Register as a driver with vehicle information
- **Driver Dashboard**: View earnings, active jobs, and statistics
- **Job Matching**: Automatic filtering of jobs based on vehicle type
- **Earnings Preview**: See potential earnings before accepting jobs
- **Job Management**: Accept, start, and complete deliveries
- **Earnings History**: Track all completed jobs and total earnings
- **Vehicle Profile**: Manage vehicle information and capacity details
- **Rating System**: Build reputation through completed jobs

### System Features
- **User Authentication**: Secure login/signup for clients and drivers
- **Data Persistence**: LocalStorage-based database for user accounts and jobs
- **Automated Vehicle Allocation**: Smart matching based on load type, size, and location
- **Pricing Algorithm**: Dynamic pricing based on distance, time, and vehicle type
  - Base Price: NAD 50
  - Per Kilometer: NAD 8
  - Per Minute: NAD 2
  - Vehicle multipliers (Pickup: 1.0x, Small Truck: 1.3x, Flatbed: 1.5x, Large Truck: 2.0x)
- **Driver Earnings**: Currently set at 80% of total job price (configurable)
- **Persistent Storage**: Uses localStorage to save jobs and driver data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Requirements

To run this application, you need:
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (can use VS Code Live Server, Python SimpleHTTPServer, or Node.js http-server)

## 🛠️ Installation & Setup

### Option 1: Using VS Code Live Server (Recommended)

1. **Install VS Code**: Download from https://code.visualstudio.com/

2. **Install Live Server Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for "Live Server"
   - Install the extension by Ritwick Dey

3. **Open the Project**:
   ```bash
   # Navigate to the project folder
   cd /path/to/ehail-logistics-app
   
   # Open in VS Code
   code .
   ```

4. **Launch the Application**:
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The application will open in your browser at `http://127.0.0.1:5500`

### Option 2: Using Python

```bash
# Python 3
cd /path/to/ehail-logistics-app
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then open http://localhost:8000 in your browser
```

### Option 3: Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Navigate to project folder
cd /path/to/ehail-logistics-app

# Start server
http-server -p 8000

# Open http://localhost:8000 in your browser
```

### Option 4: Using Claude Code

If you have Claude Code installed:

```bash
# Open the project in your terminal
cd /path/to/ehail-logistics-app

# Use Claude Code to serve the application
claude-code serve
```

## 🎯 Quick Start

### Demo Accounts

For quick testing, use these pre-loaded driver accounts:

**Driver Login Credentials:**
- Email: `johannes@ezmove.com` | Password: `driver123` (Pickup Truck)
- Email: `maria@ezmove.com` | Password: `driver123` (Small Truck)
- Email: `david@ezmove.com` | Password: `driver123` (Flatbed)

**New Users:** You can sign up as a new client or driver to create your own account!

## 📱 How to Use

### For Clients (Customers)

1. **Sign Up/Login**:
   - Click "I Need Transport" on the landing page
   - **New users**: Click "Don't have an account? Sign up"
     - Fill in your name, email, phone, and password
     - Click "Create Account"
   - **Existing users**: Enter email and password, click "Login"

2. **Request Transport**:
   - Enter pickup location
   - Enter delivery location
   - Adjust distance and estimated time sliders
   - Select vehicle type (Pickup, Small Truck, Flatbed, Large Truck)
   - Choose load type
   - Enter weight, volume, and value (optional)
   - Add special instructions if needed
   - Review the cost estimate
   - Click "Confirm Booking"

3. **Track Jobs**:
   - View active jobs in "My Jobs" tab
   - See job details and digital waybill
   - Download PDF waybill (feature coming soon)
   - Check completed jobs in "History" tab

### For Drivers

1. **Sign Up/Login**:
   - Click "I'm a Driver" on the landing page
   - **New drivers**: Click "Don't have an account? Register"
     - Fill in your name, email, phone
     - Select your vehicle type
     - Enter your license plate number
     - Create a password
     - Click "Register as Driver"
   - **Existing drivers**: Enter email and password, click "Login"
   - **Demo accounts**: Use the credentials listed above in Quick Start

2. **Dashboard**: View your statistics and vehicle info

3. **Accept Jobs**:
   - Go to "Available Jobs" tab
   - Review job details and earnings
   - Click "Accept Job" to claim it

4. **Complete Deliveries**:
   - Go to "My Jobs" tab
   - Click "Start Delivery" when ready
   - Click "Mark as Completed" when finished

5. **Track Earnings**:
   - View total earnings in dashboard
   - Check detailed earnings history in "Earnings" tab

## 🔧 Customization Guide

### Modifying Pricing

Edit the pricing constants in `ehail-logistics-app.jsx`:

```javascript
const calculatePrice = (distance, estimatedTime, vehicleType) => {
  const BASE_PRICE = 50;        // Change base price
  const PRICE_PER_KM = 8;       // Change per-kilometer rate
  const PRICE_PER_MIN = 2;      // Change per-minute rate
  // ...
};
```

### Adding New Vehicle Types

Add to the `VEHICLE_TYPES` object:

```javascript
const VEHICLE_TYPES = {
  // Existing types...
  NEW_TYPE: { 
    name: 'New Vehicle Type', 
    capacity: '10 tons', 
    icon: '🚛', 
    priceMultiplier: 2.5 
  }
};
```

### Adding New Load Types

Edit the `LOAD_TYPES` array:

```javascript
const LOAD_TYPES = [
  'Furniture', 
  'Electronics', 
  // Add new types here
  'Agricultural Products',
  'Industrial Equipment'
];
```

### Changing Driver Commission

Modify the earnings calculation:

```javascript
const calculateDriverEarnings = (totalPrice) => {
  return Math.round(totalPrice * 0.8); // Change 0.8 to desired percentage
};
```

### Adding More Mock Drivers

Add new driver objects to `MOCK_DRIVERS`:

```javascript
const MOCK_DRIVERS = [
  // Existing drivers...
  {
    id: 'DRV004',
    name: 'New Driver Name',
    phone: '+264 81 XXX XXXX',
    rating: 4.5,
    vehicleType: 'LARGE_TRUCK',
    licensePlate: 'N XXXXX WK',
    location: { lat: -22.5609, lng: 17.0658 },
    availability: true,
    completedJobs: 50
  }
];
```

### Styling Changes

The application uses Tailwind CSS. To modify colors:

1. **Primary Color (Orange)**: Search and replace `orange-` with your preferred color (e.g., `blue-`, `green-`)
2. **Secondary Color (Blue)**: Search and replace `blue-` in driver sections
3. **Custom Styles**: Add to the `<style>` section in `index.html`

### Adding New Features

The code is modular. Each major component is a separate function:
- `ClientApp` - Client interface
- `DriverApp` - Driver interface
- `NewJobForm` - Job creation form
- `JobTracking` - Tracking interface
- `DriverDashboard` - Driver dashboard

## 📂 File Structure

```
ehail-logistics-app/
│
├── index.html                    # Main HTML file with React setup
├── ehail-logistics-app.jsx       # React application code (includes authentication)
├── AUTHENTICATION_GUIDE.md       # Complete guide to the authentication system
├── START_SERVER.command          # macOS server startup script
└── README.md                     # This file
```

## 🔐 Data Storage

The application uses `localStorage` for data persistence:
- **jobs**: All job records
- **drivers**: Driver profiles and data

To clear all data:
```javascript
localStorage.clear();
```

## 🚧 Planned Features

- [ ] Real-time GPS tracking integration
- [ ] Payment gateway integration (Mobile Money, Bank Transfers)
- [ ] SMS/Email notifications
- [ ] Backend API with database
- [ ] Mobile app versions (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Driver verification system
- [ ] Customer reviews and ratings
- [ ] Multi-language support (English, Oshiwambo, Afrikaans, etc.)
- [ ] Route optimization
- [ ] In-app messaging between clients and drivers

## 🎨 Design Philosophy

- **Namibian-focused**: Built specifically for the Namibian market
- **User-friendly**: Clean, intuitive interface
- **Mobile-first**: Responsive design for all devices
- **Professional**: Production-ready UI/UX
- **Accessible**: Easy to use for all users

## 💡 Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Storage**: LocalStorage
- **Build**: Babel Standalone (for development)

## 🤝 Contributing

To add features or fix bugs:

1. Edit `ehail-logistics-app.jsx` in VS Code or Claude Code
2. Save the file
3. Refresh your browser (or Live Server will auto-reload)
4. Test your changes

## 📞 Support

For issues or questions about customization:
- Review the code comments in `ehail-logistics-app.jsx`
- Check the browser console for errors (F12)
- Use Claude Code for AI-assisted development

## 📄 License

This is a demo application built for logistics services in Namibia.

## 🌟 Credits

Built with modern web technologies and designed for the Namibian logistics market.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Built for**: Namibian Logistics Industry
