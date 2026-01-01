# Project Structure Guide

## 📁 Current Structure (Single Page App)

```
swifthaul-logistics/
├── index.html                    # Main HTML file with React & Tailwind setup
├── ehail-logistics-app.jsx       # Complete React application (all components)
├── README.md                     # Project overview and features
├── QUICK_START.md               # 5-minute setup guide
├── DEVELOPER_GUIDE.md           # Detailed customization instructions
├── CONFIG_GUIDE.md              # API integration templates
├── package.json                 # Node.js package configuration
└── .gitignore                   # Git ignore rules
```

## 📁 Recommended Structure (For Scaling)

When your app grows, reorganize like this:

```
swifthaul-logistics/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── client/
│   │   │   ├── ClientApp.jsx
│   │   │   ├── ClientHome.jsx
│   │   │   ├── NewJobForm.jsx
│   │   │   ├── JobsList.jsx
│   │   │   └── JobTracking.jsx
│   │   │
│   │   ├── driver/
│   │   │   ├── DriverApp.jsx
│   │   │   ├── DriverLogin.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── AvailableJobs.jsx
│   │   │   ├── DriverActiveJobs.jsx
│   │   │   └── DriverEarnings.jsx
│   │   │
│   │   ├── shared/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── RatingComponent.jsx
│   │   │   ├── Map.jsx
│   │   │   └── Notification.jsx
│   │   │
│   │   └── LandingPage.jsx
│   │
│   ├── utils/
│   │   ├── pricing.js           # Pricing calculations
│   │   ├── storage.js           # localStorage helpers
│   │   ├── api.js               # API calls
│   │   ├── constants.js         # App constants
│   │   └── helpers.js           # Utility functions
│   │
│   ├── hooks/
│   │   ├── useAuth.js           # Authentication hook
│   │   ├── useJobs.js           # Jobs management hook
│   │   ├── useDrivers.js        # Drivers management hook
│   │   └── useGeolocation.js    # Geolocation hook
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication context
│   │   ├── JobContext.jsx       # Jobs context
│   │   └── DriverContext.jsx    # Drivers context
│   │
│   ├── services/
│   │   ├── authService.js       # Authentication service
│   │   ├── jobService.js        # Jobs API service
│   │   ├── driverService.js     # Drivers API service
│   │   ├── paymentService.js    # Payment integration
│   │   ├── notificationService.js # Notifications
│   │   └── mapService.js        # Maps integration
│   │
│   ├── styles/
│   │   ├── global.css           # Global styles
│   │   ├── tailwind.css         # Tailwind imports
│   │   └── components.css       # Component-specific styles
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   └── vehicles/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── config/
│   │   ├── app.config.js        # App configuration
│   │   ├── api.config.js        # API configuration
│   │   └── map.config.js        # Maps configuration
│   │
│   ├── types/
│   │   ├── job.types.js         # Job type definitions
│   │   ├── driver.types.js      # Driver type definitions
│   │   └── user.types.js        # User type definitions
│   │
│   ├── App.jsx                  # Main App component
│   ├── index.js                 # Entry point
│   └── setupTests.js            # Test configuration
│
├── tests/
│   ├── components/
│   ├── utils/
│   └── integration/
│
├── docs/
│   ├── API.md                   # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── CONTRIBUTING.md          # Contribution guidelines
│
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # Project documentation
```

## 🔄 Migration Path

### Step 1: Create Modular Structure

Split `ehail-logistics-app.jsx` into separate files:

```bash
# Create directories
mkdir -p src/{components/{client,driver,shared},utils,hooks,context,services,styles,assets,config,types}

# Move components to separate files
# Example for ClientApp:
```

**src/components/client/ClientApp.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import ClientHome from './ClientHome';
import NewJobForm from './NewJobForm';
import JobsList from './JobsList';
import JobTracking from './JobTracking';

export default function ClientApp({ jobs, setJobs, drivers, onLogout }) {
  // Component logic here
}
```

### Step 2: Extract Utilities

**src/utils/pricing.js:**
```javascript
export const VEHICLE_TYPES = {
  PICKUP: { name: 'Pickup Truck', capacity: '1 ton', icon: '🚙', priceMultiplier: 1.0 },
  // ...
};

export const calculatePrice = (distance, estimatedTime, vehicleType) => {
  const BASE_PRICE = 50;
  const PRICE_PER_KM = 8;
  const PRICE_PER_MIN = 2;
  const multiplier = VEHICLE_TYPES[vehicleType]?.priceMultiplier || 1.0;
  return Math.round((BASE_PRICE + (distance * PRICE_PER_KM) + (estimatedTime * PRICE_PER_MIN)) * multiplier);
};

export const calculateDriverEarnings = (totalPrice) => {
  return Math.round(totalPrice * 0.8);
};
```

**src/utils/storage.js:**
```javascript
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage error:', e);
    return defaultValue;
  }
};
```

### Step 3: Create Custom Hooks

**src/hooks/useJobs.js:**
```javascript
import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export function useJobs() {
  const [jobs, setJobs] = useState(loadFromStorage('jobs', []));

  useEffect(() => {
    saveToStorage('jobs', jobs);
  }, [jobs]);

  const createJob = (jobData) => {
    setJobs([...jobs, jobData]);
  };

  const updateJob = (jobId, updates) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  return { jobs, createJob, updateJob };
}
```

### Step 4: Add Context for State Management

**src/context/AuthContext.jsx:**
```javascript
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    // Login logic
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Step 5: Create API Service Layer

**src/services/api.js:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

export default new ApiService();
```

**src/services/jobService.js:**
```javascript
import api from './api';

export const jobService = {
  getJobs: () => api.get('/jobs'),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.patch(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getWaybill: (id) => api.get(`/jobs/${id}/waybill`)
};
```

## 🎨 Component Design Patterns

### 1. Container/Presentational Pattern

**Container (Smart Component):**
```javascript
// ClientJobsContainer.jsx
function ClientJobsContainer() {
  const { jobs, loading } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);

  if (loading) return <LoadingSpinner />;

  return (
    <JobsList 
      jobs={jobs}
      onSelectJob={setSelectedJob}
    />
  );
}
```

**Presentational (Dumb Component):**
```javascript
// JobsList.jsx
function JobsList({ jobs, onSelectJob }) {
  return (
    <div className="grid gap-4">
      {jobs.map(job => (
        <JobCard 
          key={job.id}
          job={job}
          onClick={() => onSelectJob(job)}
        />
      ))}
    </div>
  );
}
```

### 2. Compound Components Pattern

```javascript
function JobCard({ job }) {
  return (
    <div className="job-card">
      <JobCard.Header job={job} />
      <JobCard.Body job={job} />
      <JobCard.Footer job={job} />
    </div>
  );
}

JobCard.Header = ({ job }) => (
  <div className="job-card-header">
    <h3>{job.id}</h3>
    <StatusBadge status={job.status} />
  </div>
);

JobCard.Body = ({ job }) => (
  <div className="job-card-body">
    <Location origin={job.origin} destination={job.destination} />
    <JobDetails job={job} />
  </div>
);

JobCard.Footer = ({ job }) => (
  <div className="job-card-footer">
    <Price amount={job.price} />
  </div>
);
```

### 3. Render Props Pattern

```javascript
function WithJobData({ jobId, children }) {
  const [job, loading, error] = useJobData(jobId);

  return children({ job, loading, error });
}

// Usage:
<WithJobData jobId={selectedJobId}>
  {({ job, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <JobDetails job={job} />;
  }}
</WithJobData>
```

## 🧪 Testing Structure

### Unit Tests
```javascript
// src/utils/__tests__/pricing.test.js
import { calculatePrice, calculateDriverEarnings } from '../pricing';

describe('Pricing Calculations', () => {
  test('calculates correct price for pickup truck', () => {
    const price = calculatePrice(15, 30, 'PICKUP');
    expect(price).toBe(230); // 50 + (15*8) + (30*2)
  });

  test('calculates correct driver earnings', () => {
    const earnings = calculateDriverEarnings(230);
    expect(earnings).toBe(184); // 80% of 230
  });
});
```

### Component Tests
```javascript
// src/components/__tests__/JobCard.test.jsx
import { render, screen } from '@testing-library/react';
import JobCard from '../JobCard';

describe('JobCard', () => {
  const mockJob = {
    id: 'JOB001',
    origin: 'Windhoek CBD',
    destination: 'Eros',
    price: 230,
    status: 'pending'
  };

  test('renders job information correctly', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('JOB001')).toBeInTheDocument();
    expect(screen.getByText('Windhoek CBD')).toBeInTheDocument();
    expect(screen.getByText('NAD 230')).toBeInTheDocument();
  });
});
```

## 📦 Build Process

### Development
```bash
npm run dev           # Start development server
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Deploy to hosting
```

## 🚀 Deployment Options

### 1. Static Hosting (Current Setup)
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### 2. Full-Stack Deployment
- Frontend: Vercel/Netlify
- Backend: Heroku/DigitalOcean/AWS
- Database: PostgreSQL/MongoDB Atlas

### 3. Containerized Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

This structure will help you scale from a single-file app to a production-ready application!
