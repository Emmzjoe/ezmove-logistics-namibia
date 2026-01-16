// React and icons will be loaded from CDN
const { useState, useEffect } = React;

// ==================== ICON COMPONENTS (Placeholders) ====================
// Simple SVG icon components to replace lucide-react imports
const Icon = ({ children, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {children}
  </svg>
);

const ChevronRight = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></Icon>
);

const Truck = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></Icon>
);

const Package = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></Icon>
);

const MapPin = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></Icon>
);

const Clock = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

const DollarSign = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

const X = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></Icon>
);

const Navigation = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></Icon>
);

const Star = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></Icon>
);

const Weight = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></Icon>
);

const Ruler = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></Icon>
);

const AlertCircle = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

const CheckCircle = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

const LogOut = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></Icon>
);

const FileText = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></Icon>
);

const TrendingUp = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></Icon>
);

const User = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></Icon>
);

const Mail = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></Icon>
);

const Lock = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></Icon>
);

const Phone = ({ className }) => (
  <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></Icon>
);

// ==================== DATA MODELS & UTILITIES ====================

const VEHICLE_TYPES = {
  PICKUP: { name: 'Pickup Truck', capacity: '1 ton', icon: '🚙', priceMultiplier: 1.0 },
  SMALL_TRUCK: { name: 'Small Truck', capacity: '2 tons', icon: '🚚', priceMultiplier: 1.3 },
  FLATBED: { name: 'Flatbed', capacity: '3 tons', icon: '🛻', priceMultiplier: 1.5 },
  LARGE_TRUCK: { name: 'Large Truck', capacity: '5 tons', icon: '🚛', priceMultiplier: 2.0 }
};

const LOAD_TYPES = [
  'Furniture', 'Electronics', 'Food & Beverages', 'Clothing', 
  'Construction Materials', 'Waste/Disposal', 'General Cargo', 'Other'
];

// Pricing algorithm: Base price + (distance * rate) + (time * rate) + vehicle multiplier
const calculatePrice = (distance, estimatedTime, vehicleType) => {
  const BASE_PRICE = 50; // NAD
  const PRICE_PER_KM = 8; // NAD
  const PRICE_PER_MIN = 2; // NAD
  const multiplier = VEHICLE_TYPES[vehicleType]?.priceMultiplier || 1.0;
  
  const total = (BASE_PRICE + (distance * PRICE_PER_KM) + (estimatedTime * PRICE_PER_MIN)) * multiplier;
  return Math.round(total);
};

// Calculate driver earnings (80% of total price for now)
const calculateDriverEarnings = (totalPrice) => {
  return Math.round(totalPrice * 0.8);
};

// Mock data for available drivers
// Default password for demo drivers: "driver123"
const MOCK_DRIVERS = [
  {
    id: 'DRV001',
    name: 'Johannes Shikongo',
    email: 'johannes@ezmove.com',
    phone: '+264 81 234 5678',
    passwordHash: btoa('driver123'),
    rating: 4.8,
    vehicleType: 'PICKUP',
    licensePlate: 'N 12345 WK',
    location: { lat: -22.5609, lng: 17.0658 },
    availability: true,
    completedJobs: 156,
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'DRV002',
    name: 'Maria Nghipandua',
    email: 'maria@ezmove.com',
    phone: '+264 81 876 5432',
    passwordHash: btoa('driver123'),
    rating: 4.9,
    vehicleType: 'SMALL_TRUCK',
    licensePlate: 'N 67890 WK',
    location: { lat: -22.5709, lng: 17.0758 },
    availability: true,
    completedJobs: 203,
    createdAt: '2024-01-10T10:00:00.000Z'
  },
  {
    id: 'DRV003',
    name: 'David Angula',
    email: 'david@ezmove.com',
    phone: '+264 81 345 6789',
    passwordHash: btoa('driver123'),
    rating: 4.7,
    vehicleType: 'FLATBED',
    licensePlate: 'N 24680 WK',
    location: { lat: -22.5509, lng: 17.0558 },
    availability: true,
    completedJobs: 98,
    createdAt: '2024-02-01T10:00:00.000Z'
  }
];

// ==================== STORAGE HELPERS ====================

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage error:', e);
    return defaultValue;
  }
};

// ==================== AUTHENTICATION HELPERS ====================

// Simple password hashing (in production, use proper backend hashing)
const hashPassword = (password) => {
  // This is a simple hash for demo purposes only
  // In production, handle this on the backend with bcrypt or similar
  return btoa(password);
};

const verifyPassword = (password, hash) => {
  return btoa(password) === hash;
};

// Authentication functions
const authenticateClient = (email, password) => {
  const clients = loadFromStorage('clients', []);
  const client = clients.find(c => c.email === email);

  if (!client) {
    return { success: false, error: 'Account not found' };
  }

  if (!verifyPassword(password, client.passwordHash)) {
    return { success: false, error: 'Incorrect password' };
  }

  return { success: true, user: client };
};

const registerClient = (clientData) => {
  const clients = loadFromStorage('clients', []);

  // Check if email already exists
  if (clients.find(c => c.email === clientData.email)) {
    return { success: false, error: 'Email already registered' };
  }

  // Check if phone already exists
  if (clients.find(c => c.phone === clientData.phone)) {
    return { success: false, error: 'Phone number already registered' };
  }

  const newClient = {
    id: `CLT${Date.now()}`,
    name: clientData.name,
    email: clientData.email,
    phone: clientData.phone,
    passwordHash: hashPassword(clientData.password),
    createdAt: new Date().toISOString(),
    address: clientData.address || '',
  };

  clients.push(newClient);
  saveToStorage('clients', clients);

  return { success: true, user: newClient };
};

const authenticateDriver = (email, password) => {
  const drivers = loadFromStorage('drivers', MOCK_DRIVERS);
  const driver = drivers.find(d => d.email === email);

  if (!driver) {
    return { success: false, error: 'Account not found' };
  }

  if (!verifyPassword(password, driver.passwordHash)) {
    return { success: false, error: 'Incorrect password' };
  }

  return { success: true, user: driver };
};

const registerDriver = (driverData) => {
  const drivers = loadFromStorage('drivers', MOCK_DRIVERS);

  // Check if email already exists
  if (drivers.find(d => d.email === driverData.email)) {
    return { success: false, error: 'Email already registered' };
  }

  // Check if phone already exists
  if (drivers.find(d => d.phone === driverData.phone)) {
    return { success: false, error: 'Phone number already registered' };
  }

  // Check if license plate already exists
  if (drivers.find(d => d.licensePlate === driverData.licensePlate)) {
    return { success: false, error: 'License plate already registered' };
  }

  const newDriver = {
    id: `DRV${Date.now()}`,
    name: driverData.name,
    email: driverData.email,
    phone: driverData.phone,
    passwordHash: hashPassword(driverData.password),
    vehicleType: driverData.vehicleType,
    licensePlate: driverData.licensePlate,
    rating: 5.0,
    location: { lat: -22.5609, lng: 17.0658 },
    availability: true,
    completedJobs: 0,
    createdAt: new Date().toISOString(),
  };

  drivers.push(newDriver);
  saveToStorage('drivers', drivers);

  return { success: true, user: newDriver };
};

// ==================== MAIN APP COMPONENT ====================

function EHailLogisticsApp() {
  // Initialize drivers with MOCK_DRIVERS if not in storage
  const initializeDrivers = () => {
    const stored = loadFromStorage('drivers', null);
    if (!stored || stored.length === 0) {
      saveToStorage('drivers', MOCK_DRIVERS);
      return MOCK_DRIVERS;
    }
    return stored;
  };

  const [userType, setUserType] = useState(null); // 'client' or 'driver'
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState(loadFromStorage('jobs', []));
  const [drivers, setDrivers] = useState(initializeDrivers());

  useEffect(() => {
    saveToStorage('jobs', jobs);
  }, [jobs]);

  useEffect(() => {
    saveToStorage('drivers', drivers);
  }, [drivers]);

  const handleLogout = () => {
    setUserType(null);
    setCurrentUser(null);
    localStorage.removeItem('currentSession');
  };

  const handleClientLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentSession', JSON.stringify({ type: 'client', userId: user.id }));
  };

  const handleDriverLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentSession', JSON.stringify({ type: 'driver', userId: user.id }));
  };

  // Check for existing session on mount
  useEffect(() => {
    const session = loadFromStorage('currentSession');
    if (session) {
      if (session.type === 'client') {
        const clients = loadFromStorage('clients', []);
        const user = clients.find(c => c.id === session.userId);
        if (user) {
          setUserType('client');
          setCurrentUser(user);
        }
      } else if (session.type === 'driver') {
        const drivers = loadFromStorage('drivers', MOCK_DRIVERS);
        const user = drivers.find(d => d.id === session.userId);
        if (user) {
          setUserType('driver');
          setCurrentUser(user);
        }
      }
    }
  }, []);

  if (!userType) {
    return <LandingPage onSelectType={setUserType} />;
  }

  if (userType === 'client') {
    if (!currentUser) {
      // Use API-integrated auth if available, otherwise fallback to local
      const ClientAuthComponent = window.ClientAuth || ClientAuth_OLD;
      return <ClientAuthComponent onLogin={handleClientLogin} onBack={() => setUserType(null)} />;
    }
    return <ClientApp jobs={jobs} setJobs={setJobs} drivers={drivers} currentUser={currentUser} onLogout={handleLogout} />;
  }

  if (userType === 'driver') {
    if (!currentUser) {
      // Use API-integrated auth if available, otherwise fallback to local
      const DriverAuthComponent = window.DriverAuth || DriverAuth_OLD;
      return <DriverAuthComponent onLogin={handleDriverLogin} onBack={() => setUserType(null)} />;
    }
    return <DriverApp jobs={jobs} setJobs={setJobs} currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />;
  }

  return null;
}

// ==================== LANDING PAGE ====================

function LandingPage({ onSelectType }) {
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl">
                <Truck className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">EZ</span>
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Move</span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-slate-200 font-light mb-3">
            Namibia's Premier Logistics Platform
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Seamless connections between businesses and professional transport drivers
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">24/7</div>
              <div className="text-sm text-slate-400 mt-1">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">500+</div>
              <div className="text-sm text-slate-400 mt-1">Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">Fast</div>
              <div className="text-sm text-slate-400 mt-1">Reliable</div>
            </div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Client Card */}
          <div
            onClick={() => onSelectType('client')}
            className="group cursor-pointer relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02]">
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <User className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Book Transport</h2>
                  <p className="text-orange-400 text-sm">For Clients & Businesses</p>
                </div>
              </div>

              <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                Ship goods anywhere in Namibia with verified professional drivers
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-orange-500/20 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Instant Quotes</div>
                    <div className="text-sm text-slate-400">See prices before booking</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-orange-500/20 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Live Tracking</div>
                    <div className="text-sm text-slate-400">Monitor your delivery in real-time</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-orange-500/20 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Digital Documentation</div>
                    <div className="text-sm text-slate-400">Automated waybills & receipts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-orange-500/20 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Verified Drivers</div>
                    <div className="text-sm text-slate-400">Background-checked professionals</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-lg group-hover:shadow-xl group-hover:shadow-orange-500/50 flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Get Started as Client
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Driver Card */}
          <div
            onClick={() => onSelectType('driver')}
            className="group cursor-pointer relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Drive & Earn</h2>
                  <p className="text-blue-400 text-sm">For Professional Drivers</p>
                </div>
              </div>

              <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                Join our network and earn money with your vehicle on your schedule
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-blue-500/20 rounded-full p-1">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Transparent Earnings</div>
                    <div className="text-sm text-slate-400">See your pay before accepting</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-blue-500/20 rounded-full p-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Flexible Schedule</div>
                    <div className="text-sm text-slate-400">Work when you want, where you want</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-blue-500/20 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Smart Job Matching</div>
                    <div className="text-sm text-slate-400">Automatic filtering by vehicle type</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-blue-500/20 rounded-full p-1">
                    <Star className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Build Your Rating</div>
                    <div className="text-sm text-slate-400">Grow your reputation & earnings</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-lg group-hover:shadow-xl group-hover:shadow-blue-500/50 flex items-center justify-center gap-2">
                <Truck className="w-5 h-5" />
                Join as Driver
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Verified</div>
                <div className="text-xs text-slate-400">Drivers</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
                <Lock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Secure</div>
                <div className="text-xs text-slate-400">Payments</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Rated</div>
                <div className="text-xs text-slate-400">Service</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4">
                <Navigation className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">GPS</div>
                <div className="text-xs text-slate-400">Tracking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500">
          <p className="text-sm mb-2">
            &copy; 2025 EZMove Logistics. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built for Namibian Logistics Industry
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== CLIENT AUTHENTICATION ====================

// NOTE: This function is replaced by the API-integrated version in auth-integration.jsx
// Keeping this as fallback for compatibility
function ClientAuth_OLD({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      // Login
      const result = authenticateClient(formData.email, formData.password);
      setLoading(false);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } else {
      // Sign up
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = registerClient(formData);
      setLoading(false);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-orange-200 hover:text-white transition-colors"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-12 h-12" />
            <h1 className="text-4xl font-bold">
              EZ<span className="text-orange-300">Move</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-orange-200">
            {isLogin ? 'Login to book transport' : 'Sign up to get started'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800"
                placeholder="john@example.com"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800"
                  placeholder="+264 81 234 5678"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address (Optional)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800"
                  placeholder="Windhoek, Namibia"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800"
                placeholder={isLogin ? 'Enter password' : 'At least 6 characters'}
                minLength={isLogin ? undefined : 6}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800"
                  placeholder="Re-enter password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-bold text-lg transition-colors"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  address: ''
                });
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CLIENT APP ====================

function ClientApp({ jobs, setJobs, drivers, currentUser, onLogout }) {
  const [currentView, setCurrentView] = useState('home'); // home, new-job, jobs, tracking
  const [selectedJob, setSelectedJob] = useState(null);

  const myJobs = jobs.filter(job => job.status !== 'cancelled');
  const activeJobs = myJobs.filter(job => ['pending', 'accepted', 'in-progress'].includes(job.status));
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-slate-800">EZ<span className="text-orange-500">Move</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentView === 'home' 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentView === 'jobs' 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              My Jobs {activeJobs.length > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{activeJobs.length}</span>}
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentView === 'history' 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <ClientHome 
            activeJobs={activeJobs}
            onNewJob={() => setCurrentView('new-job')}
            onViewJobs={() => setCurrentView('jobs')}
          />
        )}
        
        {currentView === 'new-job' && (
          <NewJobForm
            drivers={drivers}
            onSubmit={(job) => {
              setJobs([...jobs, job]);
              setCurrentView('jobs');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'jobs' && (
          <JobsList 
            jobs={activeJobs}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setCurrentView('tracking');
            }}
            title="Active Jobs"
          />
        )}

        {currentView === 'history' && (
          <JobsList 
            jobs={completedJobs}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setCurrentView('tracking');
            }}
            title="Completed Jobs"
          />
        )}
        
        {currentView === 'tracking' && selectedJob && (
          <JobTracking 
            job={selectedJob}
            onBack={() => setCurrentView('jobs')}
          />
        )}
      </main>
    </div>
  );
}

function ClientHome({ activeJobs, onNewJob, onViewJobs }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quick Action */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Need to move something?</h2>
        <p className="text-orange-100 mb-6 text-lg">Get a quote in seconds and book your transport</p>
        <button
          onClick={onNewJob}
          className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
        >
          <Package className="w-5 h-5" />
          Request Transport Now
        </button>
      </div>

      {/* Active Jobs Summary */}
      {activeJobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Active Deliveries</h3>
            <button 
              onClick={onViewJobs}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {activeJobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  {VEHICLE_TYPES[job.vehicleType]?.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{job.origin} → {job.destination}</p>
                  <p className="text-sm text-slate-500 capitalize">{job.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">NAD {job.price}</p>
                  <p className="text-xs text-slate-500">{job.distance} km</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Navigation className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Real-Time Tracking</h3>
          <p className="text-slate-600 text-sm">Monitor your delivery from pickup to drop-off</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Digital Waybills</h3>
          <p className="text-slate-600 text-sm">Automatic documentation for every shipment</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Verified Drivers</h3>
          <p className="text-slate-600 text-sm">All drivers are background-checked and rated</p>
        </div>
      </div>
    </div>
  );
}

function NewJobForm({ drivers, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    distance: 15,
    estimatedTime: 30,
    loadType: 'General Cargo',
    weight: '',
    volume: '',
    value: '',
    instructions: '',
    vehicleType: 'PICKUP'
  });

  const [showEstimate, setShowEstimate] = useState(false);

  const price = calculatePrice(formData.distance, formData.estimatedTime, formData.vehicleType);
  const availableDrivers = drivers.filter(d => d.vehicleType === formData.vehicleType && d.availability);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const job = {
      id: `JOB${Date.now()}`,
      ...formData,
      price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      waybill: {
        jobId: `JOB${Date.now()}`,
        date: new Date().toISOString(),
        origin: formData.origin,
        destination: formData.destination,
        loadType: formData.loadType,
        weight: formData.weight,
        volume: formData.volume,
        value: formData.value,
        instructions: formData.instructions
      }
    };

    onSubmit(job);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Request Transport</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup & Delivery */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Pickup Location
              </label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({...formData, origin: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Windhoek CBD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Delivery Location
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Eros, Windhoek"
              />
            </div>
          </div>

          {/* Distance & Time Sliders */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Distance: {formData.distance} km
              </label>
              <input
                type="range"
                min="1"
                max="500"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estimated Time: {formData.estimatedTime} min
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Truck className="w-4 h-4 inline mr-1" />
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(VEHICLE_TYPES).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, vehicleType: type})}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.vehicleType === type
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{VEHICLE_TYPES[type].icon}</div>
                  <div className="text-xs font-medium text-slate-700">{VEHICLE_TYPES[type].name}</div>
                  <div className="text-xs text-slate-500">{VEHICLE_TYPES[type].capacity}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Load Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Package className="w-4 h-4 inline mr-1" />
                Load Type
              </label>
              <select
                value={formData.loadType}
                onChange={(e) => setFormData({...formData, loadType: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {LOAD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Weight className="w-4 h-4 inline mr-1" />
                Estimated Weight
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 500 kg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Ruler className="w-4 h-4 inline mr-1" />
                Volume/Size
              </label>
              <input
                type="text"
                value={formData.volume}
                onChange={(e) => setFormData({...formData, volume: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 2m x 1m x 1m"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Estimated Value (NAD)
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Any special handling requirements..."
            />
          </div>

          {/* Price Estimate */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 font-medium">Estimated Cost</span>
              <span className="text-3xl font-bold text-orange-600">NAD {price}</span>
            </div>
            <div className="text-sm text-slate-600">
              {availableDrivers.length} driver{availableDrivers.length !== 1 ? 's' : ''} available nearby
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JobsList({ jobs, onSelectJob, title }) {
  if (jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Jobs Yet</h3>
          <p className="text-slate-600">Your {title.toLowerCase()} will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
      <div className="space-y-4">
        {jobs.map(job => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  {VEHICLE_TYPES[job.vehicleType]?.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{job.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      job.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {job.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-1">
                    <MapPin className="w-4 h-4 inline text-green-500" /> {job.origin}
                  </p>
                  <p className="text-slate-600">
                    <MapPin className="w-4 h-4 inline text-red-500" /> {job.destination}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">NAD {job.price}</p>
                <p className="text-sm text-slate-500">{job.distance} km</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-slate-500 mb-1">Load Type</p>
                <p className="text-sm font-medium text-slate-700">{job.loadType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Vehicle</p>
                <p className="text-sm font-medium text-slate-700">{VEHICLE_TYPES[job.vehicleType]?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm font-medium text-slate-700">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobTracking({ job, onBack }) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800"
      >
        ← Back to Jobs
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Job Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Job Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Job ID</p>
              <p className="font-bold text-slate-800">{job.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-700' :
                job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                job.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {job.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Pickup</p>
                  <p className="font-medium text-slate-800">{job.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Delivery</p>
                  <p className="font-medium text-slate-800">{job.destination}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Distance</p>
                  <p className="font-medium text-slate-800">{job.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Time</p>
                  <p className="font-medium text-slate-800">{job.estimatedTime} min</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-slate-500 mb-1">Load Type</p>
              <p className="font-medium text-slate-800">{job.loadType}</p>
            </div>

            {job.weight && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Weight</p>
                <p className="font-medium text-slate-800">{job.weight}</p>
              </div>
            )}

            {job.instructions && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Special Instructions</p>
                <p className="font-medium text-slate-800">{job.instructions}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-slate-500 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-orange-600">NAD {job.price}</p>
            </div>
          </div>
        </div>

        {/* Digital Waybill */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Digital Waybill</h3>
            <FileText className="w-6 h-6 text-orange-500" />
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6 font-mono text-sm">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-slate-500 text-xs">Waybill No.</p>
                <p className="font-bold">{job.waybill.jobId}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Date</p>
                <p className="font-bold">{new Date(job.waybill.date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-3 mb-3">
              <p className="text-slate-500 text-xs mb-1">Route</p>
              <p className="font-medium">{job.waybill.origin}</p>
              <p className="text-slate-400 text-xs my-1">↓</p>
              <p className="font-medium">{job.waybill.destination}</p>
            </div>

            <div className="border-t border-slate-200 pt-3 mb-3">
              <p className="text-slate-500 text-xs mb-1">Cargo Details</p>
              <p className="font-medium">Type: {job.waybill.loadType}</p>
              {job.waybill.weight && <p className="font-medium">Weight: {job.waybill.weight}</p>}
              {job.waybill.volume && <p className="font-medium">Volume: {job.waybill.volume}</p>}
              {job.waybill.value && <p className="font-medium">Value: NAD {job.waybill.value}</p>}
            </div>

            {job.waybill.instructions && (
              <div className="border-t border-slate-200 pt-3">
                <p className="text-slate-500 text-xs mb-1">Instructions</p>
                <p className="font-medium text-xs">{job.waybill.instructions}</p>
              </div>
            )}
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium">
            Download PDF Waybill
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== DRIVER APP ====================

function DriverApp({ jobs, setJobs, currentUser, setCurrentUser, onLogout }) {
  const [view, setView] = useState(currentUser ? 'dashboard' : 'login');
  const [selectedJob, setSelectedJob] = useState(null);

  if (!currentUser) {
    return (
      <DriverLogin
        onLogin={(driver) => {
          setCurrentUser(driver);
          setView('dashboard');
        }}
      />
    );
  }

  const availableJobs = jobs.filter(job => job.status === 'pending');
  const matchingAvailableJobs = availableJobs.filter(job => job.vehicleType === currentUser.vehicleType);
  const myJobs = jobs.filter(job => job.driverId === currentUser.id);
  const activeJobs = myJobs.filter(job => ['accepted', 'in-progress'].includes(job.status));
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  const totalEarnings = completedJobs.reduce((sum, job) => sum + calculateDriverEarnings(job.price), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Driver Dashboard</h1>
                <p className="text-sm text-blue-100">{currentUser.name}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setView('dashboard')}
              className={`px-6 py-3 font-medium transition-colors ${
                view === 'dashboard' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('available')}
              className={`px-6 py-3 font-medium transition-colors ${
                view === 'available'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Available Jobs {matchingAvailableJobs.length > 0 && <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{matchingAvailableJobs.length}</span>}
            </button>
            <button
              onClick={() => setView('active')}
              className={`px-6 py-3 font-medium transition-colors ${
                view === 'active' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              My Jobs {activeJobs.length > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{activeJobs.length}</span>}
            </button>
            <button
              onClick={() => setView('earnings')}
              className={`px-6 py-3 font-medium transition-colors ${
                view === 'earnings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Earnings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <DriverDashboard 
            driver={currentUser}
            activeJobs={activeJobs}
            totalEarnings={totalEarnings}
            completedJobs={completedJobs.length}
            onViewAvailable={() => setView('available')}
          />
        )}

        {view === 'available' && (
          <AvailableJobs
            jobs={availableJobs}
            driver={currentUser}
            onAcceptJob={(job) => {
              setJobs(jobs.map(j =>
                j.id === job.id
                  ? {...j, status: 'accepted', driverId: currentUser.id, acceptedAt: new Date().toISOString()}
                  : j
              ));
              setView('active');
            }}
          />
        )}

        {view === 'active' && (
          <DriverActiveJobs
            jobs={activeJobs}
            onUpdateStatus={(jobId, newStatus) => {
              setJobs(jobs.map(j =>
                j.id === jobId
                  ? {...j, status: newStatus, ...(newStatus === 'completed' ? {completedAt: new Date().toISOString()} : {})}
                  : j
              ));
            }}
          />
        )}

        {view === 'earnings' && (
          <DriverEarnings 
            completedJobs={completedJobs}
            totalEarnings={totalEarnings}
          />
        )}
      </main>
    </div>
  );
}

// ==================== DRIVER AUTHENTICATION ====================

// NOTE: This function is replaced by the API-integrated version in auth-integration.jsx
// Keeping this as fallback for compatibility
function DriverAuth_OLD({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'PICKUP',
    licensePlate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      // Login
      const result = authenticateDriver(formData.email, formData.password);
      setLoading(false);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } else {
      // Sign up
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = registerDriver(formData);
      setLoading(false);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="w-12 h-12" />
            <h1 className="text-4xl font-bold">
              EZ<span className="text-blue-300">Move</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? 'Driver Login' : 'Become a Driver'}
          </h2>
          <p className="text-blue-200">
            {isLogin ? 'Login to start earning' : 'Sign up to start delivering'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                placeholder="john@example.com"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  placeholder="+264 81 234 5678"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <Truck className="w-4 h-4 inline mr-1" />
                  Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(VEHICLE_TYPES).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, vehicleType: type})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.vehicleType === type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{VEHICLE_TYPES[type].icon}</div>
                      <div className="text-xs font-medium text-slate-700">{VEHICLE_TYPES[type].name}</div>
                      <div className="text-xs text-slate-500">{VEHICLE_TYPES[type].capacity}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  License Plate Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 font-mono"
                  placeholder="N 12345 WK"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                placeholder={isLogin ? 'Enter password' : 'At least 6 characters'}
                minLength={isLogin ? undefined : 6}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  placeholder="Re-enter password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-bold text-lg transition-colors"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register as Driver')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  vehicleType: 'PICKUP',
                  licensePlate: ''
                });
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Don't have an account? Register" : 'Already registered? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverDashboard({ driver, activeJobs, totalEarnings, completedJobs, onViewAvailable }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Total Earnings</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">NAD {totalEarnings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Active Jobs</span>
            <Package className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeJobs.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{completedJobs}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Rating</span>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{driver.rating}</p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Your Vehicle</h3>
        <div className="flex items-center gap-6">
          <div className="text-6xl">{VEHICLE_TYPES[driver.vehicleType]?.icon}</div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-slate-800 mb-2">{VEHICLE_TYPES[driver.vehicleType]?.name}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">License Plate</p>
                <p className="font-medium text-slate-800">{driver.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Capacity</p>
                <p className="font-medium text-slate-800">{VEHICLE_TYPES[driver.vehicleType]?.capacity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Ready to earn?</h3>
        <p className="text-blue-100 mb-6">Check available jobs and start delivering</p>
        <button
          onClick={onViewAvailable}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-bold transition-colors"
        >
          View Available Jobs
        </button>
      </div>
    </div>
  );
}

function AvailableJobs({ jobs, driver, onAcceptJob }) {
  const matchingJobs = jobs.filter(job => job.vehicleType === driver.vehicleType);

  if (matchingJobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Available Jobs</h3>
          <p className="text-slate-600">Check back soon for new delivery opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Jobs for Your Vehicle</h2>
      <div className="space-y-4">
        {matchingJobs.map(job => {
          const earnings = calculateDriverEarnings(job.price);
          
          return (
            <div key={job.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{job.origin} → {job.destination}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.distance} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      ~{job.estimatedTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {job.loadType}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">You'll Earn</p>
                  <p className="text-3xl font-bold text-green-600">NAD {earnings}</p>
                </div>
              </div>

              {job.instructions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Special Instructions
                  </p>
                  <p className="text-sm text-yellow-700">{job.instructions}</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 mb-4">
                {job.weight && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Weight</p>
                    <p className="text-sm font-medium text-slate-700">{job.weight}</p>
                  </div>
                )}
                {job.volume && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Volume</p>
                    <p className="text-sm font-medium text-slate-700">{job.volume}</p>
                  </div>
                )}
                {job.value && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Value</p>
                    <p className="text-sm font-medium text-slate-700">NAD {job.value}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Client Pays</p>
                  <p className="text-sm font-medium text-slate-700">NAD {job.price}</p>
                </div>
              </div>

              <button
                onClick={() => onAcceptJob(job)}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold transition-colors"
              >
                Accept Job - Earn NAD {earnings}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DriverActiveJobs({ jobs, onUpdateStatus }) {
  if (jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Jobs</h3>
          <p className="text-slate-600">Accept a job to start earning</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Active Jobs</h2>
      <div className="space-y-6">
        {jobs.map(job => {
          const earnings = calculateDriverEarnings(job.price);
          
          return (
            <div key={job.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{job.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {job.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-1">
                    <MapPin className="w-4 h-4 inline text-green-500" /> {job.origin}
                  </p>
                  <p className="text-slate-600">
                    <MapPin className="w-4 h-4 inline text-red-500" /> {job.destination}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Your Earnings</p>
                  <p className="text-3xl font-bold text-green-600">NAD {earnings}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Distance</p>
                  <p className="font-medium text-slate-800">{job.distance} km</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Load Type</p>
                  <p className="font-medium text-slate-800">{job.loadType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Vehicle</p>
                  <p className="font-medium text-slate-800">{VEHICLE_TYPES[job.vehicleType]?.name}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {job.status === 'accepted' && (
                  <button
                    onClick={() => onUpdateStatus(job.id, 'in-progress')}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium transition-colors"
                  >
                    Start Delivery
                  </button>
                )}
                {job.status === 'in-progress' && (
                  <button
                    onClick={() => onUpdateStatus(job.id, 'completed')}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DriverEarnings({ completedJobs, totalEarnings }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Total Earnings</h2>
        <p className="text-5xl font-bold">NAD {totalEarnings}</p>
        <p className="text-green-100 mt-2">From {completedJobs.length} completed deliveries</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Earnings</h3>
        {completedJobs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No completed jobs yet
          </div>
        ) : (
          <div className="space-y-3">
            {completedJobs.slice().reverse().map(job => {
              const earnings = calculateDriverEarnings(job.price);
              return (
                <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{job.origin} → {job.destination}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(job.completedAt).toLocaleDateString()} • {job.distance} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">+NAD {earnings}</p>
                    <p className="text-xs text-slate-500">Client paid: NAD {job.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Make the component globally available for the HTML file
window.EHailLogisticsApp = EHailLogisticsApp;