// ==================== API SERVICE LAYER ====================
// This module handles all backend API communication

const API_BASE_URL = 'http://localhost:3001/api';

// Token management
const TokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  },
  isAuthenticated: () => !!TokenManager.getAccessToken()
};

// HTTP request helper with automatic token refresh
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = TokenManager.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle 401 - Token expired, try to refresh
    if (response.status === 401 && !options.skipRefresh) {
      const refreshed = await AuthAPI.refreshToken();
      if (refreshed) {
        // Retry the original request with new token
        return apiRequest(endpoint, { ...options, skipRefresh: true });
      } else {
        // Refresh failed, logout user
        TokenManager.clearTokens();
        window.location.reload();
        throw new Error('Session expired. Please login again.');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// ==================== AUTHENTICATION API ====================

const AuthAPI = {
  // Register new client
  registerClient: async (userData) => {
    const response = await apiRequest('/auth/register/client', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        business_name: userData.businessName
      })
    });

    if (response.success) {
      TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Register new driver
  registerDriver: async (driverData) => {
    const response = await apiRequest('/auth/register/driver', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        full_name: driverData.fullName,
        email: driverData.email,
        phone: driverData.phone,
        password: driverData.password,
        vehicle_type: driverData.vehicleType,
        license_plate: driverData.licensePlate,
        license_number: driverData.licenseNumber
      })
    });

    if (response.success) {
      TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Login
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password })
    });

    if (response.success) {
      TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ refreshToken })
      });

      if (response.success) {
        TokenManager.setTokens(response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await apiRequest('/auth/me', {
      method: 'GET'
    });

    if (response.success) {
      localStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return response;
  },

  // Logout
  logout: () => {
    TokenManager.clearTokens();
  }
};

// ==================== JOB API ====================

const JobAPI = {
  // Create new job
  createJob: async (jobData) => {
    return await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        pickup_address: jobData.pickupAddress,
        pickup_lat: jobData.pickupLocation.lat,
        pickup_lng: jobData.pickupLocation.lng,
        delivery_address: jobData.deliveryAddress,
        delivery_lat: jobData.deliveryLocation.lat,
        delivery_lng: jobData.deliveryLocation.lng,
        load_type: jobData.loadType,
        load_weight: jobData.loadWeight,
        load_dimensions: jobData.loadDimensions,
        vehicle_type: jobData.vehicleType,
        special_instructions: jobData.specialInstructions,
        scheduled_pickup: jobData.scheduledPickup
      })
    });
  },

  // Get all jobs (with filters)
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/jobs${query}`, {
      method: 'GET'
    });
  },

  // Get single job details
  getJob: async (jobId) => {
    return await apiRequest(`/jobs/${jobId}`, {
      method: 'GET'
    });
  },

  // Driver accepts job
  acceptJob: async (jobId) => {
    return await apiRequest(`/jobs/${jobId}/accept`, {
      method: 'POST'
    });
  },

  // Driver starts job
  startJob: async (jobId) => {
    return await apiRequest(`/jobs/${jobId}/start`, {
      method: 'POST'
    });
  },

  // Driver completes job
  completeJob: async (jobId, proof) => {
    return await apiRequest(`/jobs/${jobId}/complete`, {
      method: 'POST',
      body: JSON.stringify({
        delivery_proof: proof
      })
    });
  },

  // Cancel job
  cancelJob: async (jobId, reason) => {
    return await apiRequest(`/jobs/${jobId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  // Rate job
  rateJob: async (jobId, rating, review) => {
    return await apiRequest(`/jobs/${jobId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, review })
    });
  }
};

// ==================== TRACKING API ====================

const TrackingAPI = {
  // Get job tracking history
  getJobHistory: async (jobId) => {
    return await apiRequest(`/tracking/job/${jobId}/history`, {
      method: 'GET'
    });
  },

  // Get driver current location
  getDriverLocation: async (driverId) => {
    return await apiRequest(`/tracking/driver/${driverId}/location`, {
      method: 'GET'
    });
  },

  // Calculate ETA
  calculateETA: async (from, to) => {
    return await apiRequest('/tracking/calculate-eta', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// ==================== PAYMENT API ====================

const PaymentAPI = {
  // Initiate payment
  initiatePayment: async (jobId, phone) => {
    return await apiRequest('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({
        job_id: jobId,
        phone
      })
    });
  },

  // Check payment status
  checkPaymentStatus: async (jobId) => {
    return await apiRequest(`/payments/status/${jobId}`, {
      method: 'GET'
    });
  },

  // Get payment history
  getPaymentHistory: async () => {
    return await apiRequest('/payments/history', {
      method: 'GET'
    });
  }
};

// ==================== VERIFICATION API ====================

const VerificationAPI = {
  // Upload verification documents
  uploadDocuments: async (files) => {
    const formData = new FormData();

    Object.keys(files).forEach(docType => {
      if (files[docType]) {
        formData.append(docType, files[docType]);
      }
    });

    const token = TokenManager.getAccessToken();
    const response = await fetch(`${API_BASE_URL}/verification/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    return await response.json();
  },

  // Get verification status
  getVerificationStatus: async () => {
    return await apiRequest('/verification/status', {
      method: 'GET'
    });
  },

  // Admin: Get pending verifications
  getPendingVerifications: async () => {
    return await apiRequest('/verification/pending', {
      method: 'GET'
    });
  },

  // Admin: Approve driver
  approveDriver: async (driverId, notes) => {
    return await apiRequest(`/verification/approve/${driverId}`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  },

  // Admin: Reject driver
  rejectDriver: async (driverId, reason) => {
    return await apiRequest(`/verification/reject/${driverId}`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
};

// ==================== ADMIN API ====================

const AdminAPI = {
  // Get all users
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/admin/users${query}`, {
      method: 'GET'
    });
  },

  // Get user details
  getUserDetails: async (userId) => {
    return await apiRequest(`/admin/users/${userId}`, {
      method: 'GET'
    });
  },

  // Suspend user
  suspendUser: async (userId, reason) => {
    return await apiRequest(`/admin/users/${userId}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  // Activate user
  activateUser: async (userId) => {
    return await apiRequest(`/admin/users/${userId}/activate`, {
      method: 'POST'
    });
  },

  // Get all jobs
  getAllJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/admin/jobs${query}`, {
      method: 'GET'
    });
  },

  // Cancel job (admin)
  cancelJob: async (jobId, reason) => {
    return await apiRequest(`/admin/jobs/${jobId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  // Get dashboard stats
  getDashboardStats: async (period = '30d') => {
    return await apiRequest(`/admin/dashboard/stats?period=${period}`, {
      method: 'GET'
    });
  },

  // Get transactions
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/admin/transactions${query}`, {
      method: 'GET'
    });
  },

  // Get system health
  getSystemHealth: async () => {
    return await apiRequest('/admin/system/health', {
      method: 'GET'
    });
  }
};

// ==================== WEBSOCKET CONNECTION ====================

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    const token = TokenManager.getAccessToken();
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      return;
    }

    // Import socket.io client from CDN (add to HTML if not present)
    if (typeof io === 'undefined') {
      console.error('Socket.IO client not loaded');
      return;
    }

    this.socket = io('http://localhost:3001', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to job tracking
  trackJob(jobId, callback) {
    if (!this.socket) this.connect();

    this.socket.emit('job:track', { jobId });
    this.socket.on('driver:location:update', callback);

    this.listeners.set(jobId, callback);
  }

  // Unsubscribe from job tracking
  untrackJob(jobId) {
    const callback = this.listeners.get(jobId);
    if (callback && this.socket) {
      this.socket.off('driver:location:update', callback);
      this.listeners.delete(jobId);
    }
  }

  // Update driver location (driver only)
  updateLocation(latitude, longitude) {
    if (!this.socket) this.connect();

    this.socket.emit('driver:location', {
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
const wsService = new WebSocketService();

// ==================== EXPORT ====================

window.API = {
  Auth: AuthAPI,
  Job: JobAPI,
  Tracking: TrackingAPI,
  Payment: PaymentAPI,
  Verification: VerificationAPI,
  Admin: AdminAPI,
  TokenManager,
  WebSocket: wsService
};
