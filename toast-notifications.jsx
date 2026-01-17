// ==================== TOAST NOTIFICATION SYSTEM ====================
// Lightweight toast notification system (similar to react-hot-toast)

const { useState, useEffect, createContext, useContext } = React;

// Toast Context
const ToastContext = createContext(null);

// Toast Types
const TOAST_TYPES = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    iconBg: 'bg-green-600'
  },
  error: {
    icon: '✕',
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    iconBg: 'bg-red-600'
  },
  warning: {
    icon: '⚠',
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    iconBg: 'bg-yellow-600'
  },
  info: {
    icon: 'ℹ',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    iconBg: 'bg-blue-600'
  },
  loading: {
    icon: '⟳',
    bgColor: 'bg-slate-700',
    textColor: 'text-white',
    iconBg: 'bg-slate-800'
  }
};

// Individual Toast Component
function Toast({ id, message, type = 'info', duration = 4000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const style = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    if (type === 'loading') return; // Loading toasts don't auto-close

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 mb-2
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div
        className={`
          ${style.bgColor} ${style.textColor}
          rounded-lg shadow-lg overflow-hidden
          min-w-[300px] max-w-md
        `}
      >
        <div className="flex items-center gap-3 p-4">
          {/* Icon */}
          <div className={`
            ${style.iconBg} w-8 h-8 rounded-full flex items-center justify-center
            flex-shrink-0
            ${type === 'loading' ? 'animate-spin' : ''}
          `}>
            <span className="text-lg font-bold">{style.icon}</span>
          </div>

          {/* Message */}
          <div className="flex-1 text-sm font-medium">
            {message}
          </div>

          {/* Close Button */}
          {type !== 'loading' && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {type !== 'loading' && (
          <div className="h-1 bg-black/20">
            <div
              className="h-full bg-white/30 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Toast Container Component
function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="flex flex-col items-end pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}

// Toast Provider Component
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateToast = (id, updates) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    removeAllToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook to use toast
function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const toast = {
    success: (message, duration) => context.addToast(message, 'success', duration),
    error: (message, duration) => context.addToast(message, 'error', duration),
    warning: (message, duration) => context.addToast(message, 'warning', duration),
    info: (message, duration) => context.addToast(message, 'info', duration),
    loading: (message) => context.addToast(message, 'loading'),
    dismiss: (id) => context.removeToast(id),
    promise: async (promise, messages) => {
      const loadingId = context.addToast(
        messages.loading || 'Loading...',
        'loading'
      );

      try {
        const result = await promise;
        context.removeToast(loadingId);
        context.addToast(messages.success || 'Success!', 'success');
        return result;
      } catch (error) {
        context.removeToast(loadingId);
        context.addToast(
          messages.error || error.message || 'Something went wrong',
          'error'
        );
        throw error;
      }
    }
  };

  return toast;
}

// Simple toast API (for non-React usage)
const toastAPI = {
  _provider: null,

  setProvider(provider) {
    this._provider = provider;
  },

  success(message, duration = 4000) {
    if (this._provider) {
      return this._provider.addToast(message, 'success', duration);
    }
    console.log('[Toast] Success:', message);
  },

  error(message, duration = 4000) {
    if (this._provider) {
      return this._provider.addToast(message, 'error', duration);
    }
    console.error('[Toast] Error:', message);
  },

  warning(message, duration = 4000) {
    if (this._provider) {
      return this._provider.addToast(message, 'warning', duration);
    }
    console.warn('[Toast] Warning:', message);
  },

  info(message, duration = 4000) {
    if (this._provider) {
      return this._provider.addToast(message, 'info', duration);
    }
    console.info('[Toast] Info:', message);
  },

  loading(message) {
    if (this._provider) {
      return this._provider.addToast(message, 'loading');
    }
    console.log('[Toast] Loading:', message);
  },

  dismiss(id) {
    if (this._provider) {
      this._provider.removeToast(id);
    }
  },

  async promise(promise, messages) {
    const loadingId = this.loading(messages.loading || 'Loading...');

    try {
      const result = await promise;
      this.dismiss(loadingId);
      this.success(messages.success || 'Success!');
      return result;
    } catch (error) {
      this.dismiss(loadingId);
      this.error(messages.error || error.message || 'Something went wrong');
      throw error;
    }
  }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Show toast notification
    if (window.toast) {
      window.toast.error(
        error.message || 'An unexpected error occurred'
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler
function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    if (window.toast) {
      window.toast.error(
        event.reason?.message || 'An unexpected error occurred'
      );
    }

    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    if (window.toast && event.error) {
      window.toast.error(
        event.error.message || 'An unexpected error occurred'
      );
    }
  });
}

// Initialize global error handling
setupGlobalErrorHandling();

// ==================== EXPORTS ====================

window.ToastProvider = ToastProvider;
window.useToast = useToast;
window.ErrorBoundary = ErrorBoundary;
window.toast = toastAPI;

console.log('✅ Toast notification system loaded');
