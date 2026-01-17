// ==================== PWA REGISTRATION ====================
// Register service worker and handle PWA installation

class PWAManager {
  constructor() {
    this.config = window.AppConfig;
    this.deferredPrompt = null;
    this.isInstalled = false;

    // Check if PWA is enabled
    if (this.config && this.config.isFeatureEnabled('PWA')) {
      this.initialize();
    } else {
      console.log('📱 PWA: Disabled in configuration');
    }
  }

  async initialize() {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('📱 PWA: Service Workers not supported');
      return;
    }

    // Register service worker
    await this.registerServiceWorker();

    // Set up install prompt handler
    this.setupInstallPrompt();

    // Check if already installed
    this.checkIfInstalled();

    // Set up update checker
    this.setupUpdateChecker();

    console.log('📱 PWA: Initialized successfully');
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('📱 PWA: Service Worker registered:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            this.showUpdateNotification();
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('📱 PWA: Service Worker registration failed:', error);
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();

      // Save the event for later use
      this.deferredPrompt = e;

      console.log('📱 PWA: Install prompt available');

      // Show custom install button/banner
      this.showInstallBanner();
    });

    // Track successful installation
    window.addEventListener('appinstalled', () => {
      console.log('📱 PWA: App installed successfully');
      this.isInstalled = true;
      this.hideInstallBanner();

      // Track installation in analytics
      if (window.Analytics) {
        window.Analytics.trackCustomEvent('pwa_installed', {
          platform: this.getPlatform()
        });
      }
    });
  }

  showInstallBanner() {
    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Create install banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 transform transition-transform';
    banner.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-slate-800 mb-1">Install EZMove</h3>
          <p class="text-sm text-slate-600">Get quick access and offline features</p>
        </div>
        <button id="pwa-install-close" class="flex-shrink-0 text-slate-400 hover:text-slate-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="flex gap-2 mt-4">
        <button id="pwa-install-button" class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
          Install Now
        </button>
        <button id="pwa-install-later" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Later
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    // Handle install button click
    document.getElementById('pwa-install-button').addEventListener('click', () => {
      this.promptInstall();
    });

    // Handle close button
    document.getElementById('pwa-install-close').addEventListener('click', () => {
      this.hideInstallBanner();
      localStorage.setItem('pwa-install-dismissed', 'true');
    });

    // Handle later button
    document.getElementById('pwa-install-later').addEventListener('click', () => {
      this.hideInstallBanner();
    });
  }

  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('📱 PWA: No install prompt available');
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log('📱 PWA: Install prompt outcome:', outcome);

    // Track the outcome
    if (window.Analytics) {
      window.Analytics.trackCustomEvent('pwa_install_prompt', {
        outcome: outcome
      });
    }

    // Clear the deferredPrompt
    this.deferredPrompt = null;

    // Hide the banner
    this.hideInstallBanner();
  }

  checkIfInstalled() {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('📱 PWA: Running in standalone mode');

      // Add class to body for PWA-specific styling
      document.body.classList.add('pwa-installed');
    }

    // iOS Safari
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('📱 PWA: Running on iOS standalone');
      document.body.classList.add('pwa-installed');
    }
  }

  setupUpdateChecker() {
    // Check for updates every hour
    setInterval(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  showUpdateNotification() {
    if (window.toast) {
      const toastId = window.toast.info(
        'A new version is available! Reload to update.',
        10000
      );

      // Show reload button in notification
      // (This would require extending the toast component)
    }
  }

  async updateServiceWorker() {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration && registration.waiting) {
      // Tell the waiting service worker to activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload the page when the new service worker is activated
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  getPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }

    if (/Win/.test(userAgent)) {
      return 'Windows';
    }

    if (/Mac/.test(userAgent)) {
      return 'macOS';
    }

    if (/Linux/.test(userAgent)) {
      return 'Linux';
    }

    return 'Unknown';
  }

  // Public API
  isAppInstalled() {
    return this.isInstalled;
  }

  showInstallPrompt() {
    return this.promptInstall();
  }
}

// Create singleton instance
const pwaManager = new PWAManager();

// Export to window
window.PWAManager = pwaManager;

console.log('✅ PWA Manager loaded');
