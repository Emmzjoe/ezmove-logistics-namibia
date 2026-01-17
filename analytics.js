// ==================== GOOGLE ANALYTICS 4 INTEGRATION ====================
// Analytics tracking for user behavior and business metrics

class Analytics {
  constructor() {
    this.config = window.AppConfig;
    this.initialized = false;
    this.queue = []; // Queue events until GA is ready

    // Initialize if analytics is enabled
    if (this.config && this.config.isFeatureEnabled('ANALYTICS')) {
      this.initialize();
    } else {
      console.log('📊 Analytics: Disabled in configuration');
    }
  }

  initialize() {
    const measurementId = this.config.GA_MEASUREMENT_ID;

    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.warn('📊 Analytics: No measurement ID configured');
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false // We'll send page views manually
    });

    this.initialized = true;

    console.log('📊 Analytics: Initialized with ID:', measurementId);

    // Process queued events
    this.queue.forEach(({ event, params }) => {
      this._sendEvent(event, params);
    });
    this.queue = [];
  }

  _sendEvent(eventName, params = {}) {
    if (!this.initialized || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('event', eventName, params);
  }

  _trackEvent(eventName, params = {}) {
    if (!this.initialized) {
      // Queue event for later
      this.queue.push({ event: eventName, params });
      return;
    }

    this._sendEvent(eventName, params);

    // Log in development
    if (this.config && this.config.isDevelopment()) {
      console.log('📊 Analytics Event:', eventName, params);
    }
  }

  // ==================== PAGE TRACKING ====================

  trackPageView(pageName, params = {}) {
    this._trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params
    });
  }

  // ==================== USER EVENTS ====================

  trackUserRegistration(userType, userId) {
    this._trackEvent('sign_up', {
      method: 'email',
      user_type: userType,
      user_id: userId
    });
  }

  trackUserLogin(userType, userId) {
    this._trackEvent('login', {
      method: 'email',
      user_type: userType,
      user_id: userId
    });
  }

  trackUserLogout(userType, userId) {
    this._trackEvent('logout', {
      user_type: userType,
      user_id: userId
    });
  }

  // ==================== JOB EVENTS ====================

  trackJobCreated(jobData) {
    this._trackEvent('job_created', {
      job_id: jobData.id,
      job_number: jobData.job_number,
      vehicle_type: jobData.vehicle_type,
      load_type: jobData.load_type,
      price: jobData.total_price,
      currency: 'NAD',
      distance_km: jobData.distance,
      is_scheduled: !!jobData.scheduled_pickup
    });
  }

  trackJobAccepted(jobData, driverId) {
    this._trackEvent('job_accepted', {
      job_id: jobData.id,
      job_number: jobData.job_number,
      driver_id: driverId,
      price: jobData.total_price,
      currency: 'NAD'
    });
  }

  trackJobStarted(jobData) {
    this._trackEvent('job_started', {
      job_id: jobData.id,
      job_number: jobData.job_number,
      driver_id: jobData.driver_id
    });
  }

  trackJobCompleted(jobData) {
    this._trackEvent('job_completed', {
      job_id: jobData.id,
      job_number: jobData.job_number,
      driver_id: jobData.driver_id,
      price: jobData.total_price,
      currency: 'NAD',
      has_photo_proof: !!jobData.delivery_proof,
      value: jobData.total_price // For conversion tracking
    });
  }

  trackJobCancelled(jobData, reason) {
    this._trackEvent('job_cancelled', {
      job_id: jobData.id,
      job_number: jobData.job_number,
      reason: reason,
      status_at_cancellation: jobData.status
    });
  }

  // ==================== DRIVER EVENTS ====================

  trackDriverVerified(driverId) {
    this._trackEvent('driver_verified', {
      driver_id: driverId
    });
  }

  trackDriverRejected(driverId, reason) {
    this._trackEvent('driver_rejected', {
      driver_id: driverId,
      reason: reason
    });
  }

  trackLocationShared(driverId, jobId) {
    this._trackEvent('location_shared', {
      driver_id: driverId,
      job_id: jobId
    });
  }

  // ==================== PAYMENT EVENTS ====================

  trackPaymentInitiated(paymentData) {
    this._trackEvent('begin_checkout', {
      transaction_id: paymentData.transaction_id,
      value: paymentData.amount,
      currency: 'NAD',
      payment_method: paymentData.method
    });
  }

  trackPaymentCompleted(paymentData) {
    this._trackEvent('purchase', {
      transaction_id: paymentData.transaction_id,
      value: paymentData.amount,
      currency: 'NAD',
      payment_method: paymentData.method,
      items: [{
        item_id: paymentData.job_id,
        item_name: 'Delivery Job',
        price: paymentData.amount
      }]
    });
  }

  trackPaymentFailed(paymentData, error) {
    this._trackEvent('payment_failed', {
      transaction_id: paymentData.transaction_id,
      value: paymentData.amount,
      currency: 'NAD',
      error_message: error
    });
  }

  // ==================== UI INTERACTION EVENTS ====================

  trackButtonClick(buttonName, location) {
    this._trackEvent('button_click', {
      button_name: buttonName,
      location: location
    });
  }

  trackSearch(searchTerm, resultCount) {
    this._trackEvent('search', {
      search_term: searchTerm,
      result_count: resultCount
    });
  }

  trackFormSubmission(formName, success) {
    this._trackEvent('form_submission', {
      form_name: formName,
      success: success
    });
  }

  trackError(errorMessage, location) {
    this._trackEvent('error_occurred', {
      error_message: errorMessage,
      location: location,
      user_agent: navigator.userAgent
    });
  }

  // ==================== BUSINESS METRICS ====================

  trackRevenue(amount, source) {
    this._trackEvent('revenue_generated', {
      value: amount,
      currency: 'NAD',
      source: source
    });
  }

  trackDriverEarnings(amount, driverId) {
    this._trackEvent('driver_earnings', {
      value: amount,
      currency: 'NAD',
      driver_id: driverId
    });
  }

  // ==================== CUSTOM EVENTS ====================

  trackCustomEvent(eventName, params = {}) {
    this._trackEvent(eventName, params);
  }

  // ==================== USER PROPERTIES ====================

  setUserProperties(properties) {
    if (!this.initialized || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('set', 'user_properties', properties);

    if (this.config && this.config.isDevelopment()) {
      console.log('📊 Analytics User Properties:', properties);
    }
  }

  setUserId(userId) {
    if (!this.initialized || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('set', { user_id: userId });
  }

  // ==================== E-COMMERCE EVENTS ====================

  trackViewItem(item) {
    this._trackEvent('view_item', {
      items: [item]
    });
  }

  trackAddToCart(item) {
    this._trackEvent('add_to_cart', {
      items: [item]
    });
  }

  // ==================== TIMING EVENTS ====================

  trackTiming(category, variable, value, label) {
    this._trackEvent('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }

  // Measure page load time
  trackPageLoadTime() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;

      this.trackTiming('Page Load', 'load_time', loadTime, window.location.pathname);
    }
  }
}

// Create singleton instance
const analytics = new Analytics();

// Track page load time when window loads
window.addEventListener('load', () => {
  setTimeout(() => {
    analytics.trackPageLoadTime();
  }, 0);
});

// Export to window
window.Analytics = analytics;

// Also create a simple API for easy usage
window.trackEvent = (event, params) => analytics.trackCustomEvent(event, params);
window.trackPage = (pageName, params) => analytics.trackPageView(pageName, params);

console.log('✅ Analytics service loaded');
