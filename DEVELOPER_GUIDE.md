# Developer Guide - EZMove

This guide will help you customize and extend the EZMove application.

## 🏗️ Architecture Overview

### Component Hierarchy

```
EHailLogisticsApp (Root)
├── LandingPage
│   └── User type selection
│
├── ClientApp
│   ├── ClientHome
│   ├── NewJobForm
│   ├── JobsList
│   └── JobTracking
│
└── DriverApp
    ├── DriverLogin
    ├── DriverDashboard
    ├── AvailableJobs
    ├── DriverActiveJobs
    └── DriverEarnings
```

### Data Flow

1. **State Management**: Uses React's `useState` for component state
2. **Data Persistence**: `localStorage` for jobs and driver data
3. **Props Drilling**: Parent components pass data and callbacks to children

## 🔧 Common Customizations

### 1. Adding a New Job Status

**File**: `ehail-logistics-app.jsx`

**Current statuses**: 'pending', 'accepted', 'in-progress', 'completed', 'cancelled'

**To add a new status (e.g., 'on-hold')**:

```javascript
// 1. Update the job creation/update logic
const handleStatusUpdate = (jobId, newStatus) => {
  setJobs(jobs.map(j => 
    j.id === jobId 
      ? {...j, status: newStatus}
      : j
  ));
};

// 2. Add UI elements for the new status
<button
  onClick={() => updateStatus(job.id, 'on-hold')}
  className="bg-yellow-500 text-white px-4 py-2 rounded"
>
  Put On Hold
</button>

// 3. Update status badge colors in JobsList component
{job.status === 'on-hold' && (
  <span className="bg-purple-100 text-purple-700">ON HOLD</span>
)}
```

### 2. Implementing Real-Time Location Tracking

**Integration with Google Maps API**:

```javascript
// 1. Add Google Maps script to index.html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>

// 2. Create a new Map component
function LiveMap({ origin, destination, driverLocation }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: -22.5609, lng: 17.0658 }, // Windhoek
        zoom: 12
      });
      setMap(newMap);
    }
  }, []);

  // Add markers for origin, destination, driver
  useEffect(() => {
    if (map && driverLocation) {
      new google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: '🚛'
      });
    }
  }, [map, driverLocation]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}

// 3. Use in JobTracking component
<LiveMap 
  origin={job.origin} 
  destination={job.destination}
  driverLocation={currentDriverLocation}
/>
```

### 3. Adding Payment Integration

**Example: Mobile Money Integration**

```javascript
// 1. Add payment state to NewJobForm
const [paymentMethod, setPaymentMethod] = useState('cash');

// 2. Add payment selection UI
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Payment Method</label>
  <div className="grid grid-cols-3 gap-3">
    <button
      onClick={() => setPaymentMethod('cash')}
      className={`p-3 border-2 rounded-lg ${
        paymentMethod === 'cash' ? 'border-orange-500' : 'border-gray-300'
      }`}
    >
      Cash
    </button>
    <button
      onClick={() => setPaymentMethod('mobile-money')}
      className={`p-3 border-2 rounded-lg ${
        paymentMethod === 'mobile-money' ? 'border-orange-500' : 'border-gray-300'
      }`}
    >
      Mobile Money
    </button>
    <button
      onClick={() => setPaymentMethod('bank-transfer')}
      className={`p-3 border-2 rounded-lg ${
        paymentMethod === 'bank-transfer' ? 'border-orange-500' : 'border-gray-300'
      }`}
    >
      Bank Transfer
    </button>
  </div>
</div>

// 3. Process payment before job confirmation
const processPayment = async (amount, method) => {
  if (method === 'mobile-money') {
    // Integrate with MTC Mobile Money or TN Mobile API
    const response = await fetch('https://payment-api.example.com/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount,
        phone: userPhone,
        provider: 'mtc' // or 'tn'
      })
    });
    return response.json();
  }
  return { success: true }; // Cash payment
};
```

### 4. Adding User Authentication

**Simple authentication system**:

```javascript
// 1. Create auth context
const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Call your backend API
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('authToken', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. Use in components
function ClientApp() {
  const { user, logout } = useContext(AuthContext);
  
  if (!user) {
    return <LoginPage />;
  }
  
  // ... rest of component
}
```

### 5. Adding Backend API Integration

**Replace localStorage with API calls**:

```javascript
// 1. Create API helper functions
const API_BASE_URL = 'https://your-backend-api.com';

const api = {
  // Jobs
  createJob: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(jobData)
    });
    return response.json();
  },

  getJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.json();
  },

  updateJobStatus: async (jobId, status) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  // Drivers
  getDrivers: async () => {
    const response = await fetch(`${API_BASE_URL}/drivers`);
    return response.json();
  }
};

// 2. Use in components
function ClientApp() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await api.getJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleCreateJob = async (jobData) => {
    try {
      const newJob = await api.createJob(jobData);
      setJobs([...jobs, newJob]);
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  // ... rest of component
}
```

### 6. Adding Notifications

**Push notifications or SMS**:

```javascript
// 1. Browser notifications
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

const showNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/logo.png',
      badge: '/badge.png'
    });
  }
};

// 2. Use in job updates
const handleJobAccepted = (job) => {
  showNotification(
    'Job Accepted!',
    `Your delivery from ${job.origin} to ${job.destination} has been accepted.`
  );
};

// 3. SMS notifications (backend integration)
const sendSMS = async (phone, message) => {
  await fetch('/api/sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message })
  });
};
```

### 7. Adding Rating System

```javascript
// 1. Add rating component
function RatingComponent({ rating, onRate }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= rating 
              ? 'text-yellow-500 fill-current' 
              : 'text-gray-300'
          }`}
          onClick={() => onRate(star)}
        />
      ))}
    </div>
  );
}

// 2. Add to completed job screen
function CompletedJobRating({ job, onSubmitRating }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmitRating(job.id, { rating, review });
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Rate Your Experience</h3>
      <RatingComponent rating={rating} onRate={setRating} />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience..."
        className="w-full mt-4 p-3 border rounded-lg"
        rows="3"
      />
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg disabled:bg-gray-300"
      >
        Submit Rating
      </button>
    </div>
  );
}
```

### 8. Adding Document Upload

```javascript
// 1. Create file upload component
function DocumentUpload({ onUpload }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    onUpload(data.urls);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <input
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600">
          Click to upload documents
        </span>
      </label>
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">
            {files.length} file(s) selected
          </p>
          <button
            onClick={handleUpload}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🎨 Styling Guide

### Tailwind Color Palette

Current theme colors:
- **Primary**: Orange (`orange-500`, `orange-600`)
- **Secondary**: Blue (`blue-500`, `blue-600`)
- **Success**: Green (`green-500`, `green-600`)
- **Warning**: Yellow (`yellow-500`, `yellow-600`)
- **Danger**: Red (`red-500`, `red-600`)
- **Neutral**: Slate (`slate-50` to `slate-900`)

### Custom Color Scheme

To change the entire color scheme:

```javascript
// Find and replace in ehail-logistics-app.jsx:
// orange-500 → purple-500
// orange-600 → purple-600
// blue-500 → teal-500
// blue-600 → teal-600

// Or create a custom Tailwind config in index.html:
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#FF6B35',
          secondary: '#004E89',
          accent: '#F7B32B'
        }
      }
    }
  }
</script>
```

## 🧪 Testing

### Manual Testing Checklist

**Client Flow:**
- [ ] Can select client type on landing page
- [ ] Can create a new job with all fields
- [ ] Price calculation is correct
- [ ] Job appears in "My Jobs"
- [ ] Can view job details and waybill
- [ ] Can navigate between tabs
- [ ] Can logout and return to landing page

**Driver Flow:**
- [ ] Can select driver type on landing page
- [ ] Can login as different drivers
- [ ] Dashboard shows correct statistics
- [ ] Available jobs are filtered by vehicle type
- [ ] Can accept a job
- [ ] Job appears in active jobs
- [ ] Can start delivery
- [ ] Can complete delivery
- [ ] Earnings are calculated correctly

### Browser Console Testing

```javascript
// Check localStorage data
console.log('Jobs:', JSON.parse(localStorage.getItem('jobs')));
console.log('Drivers:', JSON.parse(localStorage.getItem('drivers')));

// Clear all data
localStorage.clear();

// Manually create a test job
const testJob = {
  id: 'TEST001',
  origin: 'Test Origin',
  destination: 'Test Destination',
  price: 500,
  status: 'pending'
};
const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
jobs.push(testJob);
localStorage.setItem('jobs', JSON.stringify(jobs));
```

## 🚀 Deployment

### Option 1: GitHub Pages

```bash
# 1. Create a new repository on GitHub
# 2. Push your code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ezmove.git
git push -u origin main

# 3. Enable GitHub Pages in repository settings
# 4. Your app will be live at https://yourusername.github.io/ezmove
```

### Option 2: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Follow the prompts
```

### Option 3: Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow the prompts
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🐛 Common Issues & Solutions

### Issue: App doesn't load
**Solution**: Check browser console for errors. Make sure you're running a local server.

### Issue: Changes not appearing
**Solution**: Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R). Check if Live Server is auto-reloading.

### Issue: Data not persisting
**Solution**: Check localStorage in DevTools (Application tab). Make sure localStorage is enabled.

### Issue: Styling looks broken
**Solution**: Verify Tailwind CSS CDN is loading. Check network tab in DevTools.

## 💬 Support

For development questions:
1. Check this guide first
2. Review code comments
3. Use Claude Code for AI-assisted development
4. Check browser console for errors

---

Happy coding! 🚀
