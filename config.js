// ==================== CENTRALIZED CONFIGURATION ====================
// Environment-based configuration for EZMove platform

class Config {
  constructor() {
    // Determine environment
    this.env = this.getEnvironment();

    // Load environment variables (in production, these would come from build process)
    this.loadConfig();
  }

  getEnvironment() {
    // Check if running on localhost
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    return 'production';
  }

  loadConfig() {
    // In a real build process, these would be injected at build time
    // For now, we'll use sensible defaults based on environment

    if (this.env === 'development') {
      this.API_URL = 'http://localhost:3001/api';
      this.SOCKET_URL = 'http://localhost:3001';
      this.GOOGLE_MAPS_API_KEY = localStorage.getItem('GOOGLE_MAPS_API_KEY') || '';
      this.ENABLE_ANALYTICS = false;
      this.ENABLE_PWA = false;
      this.GA_MEASUREMENT_ID = '';
    } else {
      this.API_URL = 'https://api.ezmove.na/api';
      this.SOCKET_URL = 'https://api.ezmove.na';
      this.GOOGLE_MAPS_API_KEY = localStorage.getItem('GOOGLE_MAPS_API_KEY') || '';
      this.ENABLE_ANALYTICS = true;
      this.ENABLE_PWA = true;
      this.GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA ID
    }

    // Pricing Configuration (same across environments)
    this.pricing = {
      BASE_PRICE: 50,
      PRICE_PER_KM: 8,
      PRICE_PER_MIN: 2,
      PLATFORM_COMMISSION: 0.20, // 20%
    };

    // Vehicle Type Multipliers
    this.vehicleMultipliers = {
      'bakkie': 1.0,
      'pickup': 1.0,
      'van': 1.3,
      'truck': 1.8,
      'flatbed': 2.0,
    };

    // Application Info
    this.app = {
      NAME: 'EZMove',
      VERSION: '1.0.0',
      DESCRIPTION: 'On-demand logistics platform for Namibia',
      SUPPORT_EMAIL: 'support@ezmove.na',
      SUPPORT_PHONE: '+264 61 123 4567',
    };

    // API Endpoints
    this.endpoints = {
      // Auth
      REGISTER: `${this.API_URL}/auth/register`,
      LOGIN: `${this.API_URL}/auth/login`,
      VERIFY_EMAIL: `${this.API_URL}/auth/verify-email`,

      // Jobs
      JOBS: `${this.API_URL}/jobs`,
      CREATE_JOB: `${this.API_URL}/jobs`,
      UPDATE_JOB: (id) => `${this.API_URL}/jobs/${id}`,
      ACCEPT_JOB: (id) => `${this.API_URL}/jobs/${id}/accept`,
      COMPLETE_JOB: (id) => `${this.API_URL}/jobs/${id}/complete`,
      CANCEL_JOB: (id) => `${this.API_URL}/jobs/${id}/cancel`,

      // Location
      UPDATE_LOCATION: `${this.API_URL}/location/update`,
      GET_DRIVER_LOCATION: (driverId) => `${this.API_URL}/location/driver/${driverId}`,

      // Admin
      ADMIN_STATS: `${this.API_URL}/admin/stats`,
      ADMIN_USERS: `${this.API_URL}/admin/users`,
      ADMIN_VERIFY_DRIVER: (id) => `${this.API_URL}/admin/drivers/${id}/verify`,
      ADMIN_REJECT_DRIVER: (id) => `${this.API_URL}/admin/drivers/${id}/reject`,

      // Payments (placeholder for future)
      INITIATE_PAYMENT: `${this.API_URL}/payments/initiate`,
      VERIFY_PAYMENT: `${this.API_URL}/payments/verify`,
    };

    // Google Maps Configuration
    this.maps = {
      API_KEY: this.GOOGLE_MAPS_API_KEY,
      DEFAULT_CENTER: { lat: -22.5609, lng: 17.0658 }, // Windhoek
      DEFAULT_ZOOM: 13,
      COUNTRY_RESTRICTION: 'na', // Namibia
      AUTOCOMPLETE_TYPES: ['address'],
    };

    // Socket.IO Configuration
    this.socket = {
      URL: this.SOCKET_URL,
      OPTIONS: {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      },
    };

    // Feature Flags
    this.features = {
      ANALYTICS: this.ENABLE_ANALYTICS,
      PWA: this.ENABLE_PWA,
      PHOTO_PROOF: true,
      JOB_SCHEDULING: true,
      DRIVER_VERIFICATION: true,
      REAL_TIME_TRACKING: true,
      SMS_NOTIFICATIONS: false, // Enable when Twilio configured
      PAYMENT_PROCESSING: false, // Enable when payment gateway configured
    };

    // File Upload Configuration
    this.upload = {
      MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
      ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
    };

    // Timeouts and Limits
    this.limits = {
      API_TIMEOUT: 30000, // 30 seconds
      LOCATION_UPDATE_INTERVAL: 10000, // 10 seconds
      JOB_REFRESH_INTERVAL: 30000, // 30 seconds
      MAX_RETRY_ATTEMPTS: 3,
      DEBOUNCE_DELAY: 300, // 300ms for autocomplete
    };

    // Status Colors (for UI consistency)
    this.statusColors = {
      pending: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' },
      accepted: { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-500' },
      in_progress: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' },
      completed: { bg: 'bg-slate-100', text: 'text-slate-700', badge: 'bg-slate-500' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500' },
    };
  }

  // Helper method to calculate price
  calculatePrice(distance, duration, vehicleType) {
    const { BASE_PRICE, PRICE_PER_KM, PRICE_PER_MIN } = this.pricing;
    const multiplier = this.vehicleMultipliers[vehicleType] || 1.0;

    const baseAmount = BASE_PRICE + (distance * PRICE_PER_KM) + (duration * PRICE_PER_MIN);
    return Math.round(baseAmount * multiplier);
  }

  // Helper method to calculate driver earnings
  calculateDriverEarnings(totalPrice) {
    return Math.round(totalPrice * (1 - this.pricing.PLATFORM_COMMISSION));
  }

  // Helper method to get status color classes
  getStatusColors(status) {
    return this.statusColors[status] || this.statusColors.pending;
  }

  // Helper method to validate file upload
  validateFile(file, type = 'image') {
    if (type === 'image') {
      if (file.size > this.upload.MAX_PHOTO_SIZE) {
        return { valid: false, error: 'Image size must be less than 5MB' };
      }
      if (!this.upload.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
      }
    } else if (type === 'document') {
      if (file.size > this.upload.MAX_DOCUMENT_SIZE) {
        return { valid: false, error: 'Document size must be less than 10MB' };
      }
      if (!this.upload.ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        return { valid: false, error: 'Only PDF, JPEG, and PNG documents are allowed' };
      }
    }
    return { valid: true };
  }

  // Check if a feature is enabled
  isFeatureEnabled(featureName) {
    return this.features[featureName] || false;
  }

  // Get environment name
  getEnvironment() {
    return this.env;
  }

  // Check if in development mode
  isDevelopment() {
    return this.env === 'development';
  }

  // Check if in production mode
  isProduction() {
    return this.env === 'production';
  }
}

// Create singleton instance
const config = new Config();

// Export to window for global access
window.AppConfig = config;

// Also export for ES6 imports if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

// Log configuration in development
if (config.isDevelopment()) {
  console.log('📋 EZMove Configuration Loaded:', {
    environment: config.env,
    apiUrl: config.API_URL,
    features: config.features,
    version: config.app.VERSION,
  });
}
