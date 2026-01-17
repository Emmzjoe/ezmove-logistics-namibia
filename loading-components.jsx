// ==================== LOADING COMPONENTS ====================
// Skeleton loaders and loading states for better UX

const { useState, useEffect } = React;

// ==================== LOADING SPINNER ====================

function LoadingSpinner({ size = 'md', color = 'orange' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colors = {
    orange: 'border-orange-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-500 border-t-transparent',
    green: 'border-green-500 border-t-transparent'
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${colors[color]}
        rounded-full animate-spin
      `}
    />
  );
}

// ==================== SKELETON LOADER ====================

function Skeleton({ className = '', variant = 'rectangular' }) {
  const variants = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    rounded: 'rounded-xl'
  };

  return (
    <div
      className={`
        bg-slate-200 animate-pulse
        ${variants[variant]}
        ${className}
      `}
    />
  );
}

// ==================== JOB CARD SKELETON ====================

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="w-32 h-5 mb-2" variant="text" />
          <Skeleton className="w-48 h-4" variant="text" />
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton className="w-16 h-3 mb-2" variant="text" />
          <Skeleton className="w-full h-5" variant="text" />
        </div>
        <div>
          <Skeleton className="w-16 h-3 mb-2" variant="text" />
          <Skeleton className="w-full h-5" variant="text" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <Skeleton className="w-20 h-3 mb-2" variant="text" />
          <Skeleton className="w-24 h-6" variant="text" />
        </div>
        <Skeleton className="w-28 h-10 rounded-lg" />
      </div>
    </div>
  );
}

// ==================== DRIVER CARD SKELETON ====================

function DriverCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-16 h-16" variant="circular" />
        <div className="flex-1">
          <Skeleton className="w-32 h-5 mb-2" variant="text" />
          <Skeleton className="w-48 h-4" variant="text" />
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="w-20 h-3 mb-2" variant="text" />
          <Skeleton className="w-full h-5" variant="text" />
        </div>
        <div>
          <Skeleton className="w-20 h-3 mb-2" variant="text" />
          <Skeleton className="w-full h-5" variant="text" />
        </div>
      </div>
    </div>
  );
}

// ==================== LIST SKELETON ====================

function ListSkeleton({ count = 3, CardComponent = JobCardSkeleton }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardComponent key={index} />
      ))}
    </div>
  );
}

// ==================== FULL PAGE LOADER ====================

function FullPageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

// ==================== BUTTON LOADING STATE ====================

function ButtonLoader({ children, loading, disabled, onClick, className = '', variant = 'primary' }) {
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-lg font-medium transition-colors
        ${variants[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" color="white" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ==================== CONTENT LOADER ====================

function ContentLoader({ loading, error, children, skeleton: SkeletonComponent }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (loading) {
    return SkeletonComponent ? <SkeletonComponent /> : <ListSkeleton />;
  }

  return children;
}

// ==================== TABLE SKELETON ====================

function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-100 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="w-full h-5" variant="text" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="w-full h-5" variant="text" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== STATS CARD SKELETON ====================

function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-20 h-4" variant="text" />
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" variant="text" />
      <Skeleton className="w-32 h-3" variant="text" />
    </div>
  );
}

// ==================== EMPTY STATE ====================

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-slate-600 mb-6">
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
}

// ==================== PROGRESS BAR ====================

function ProgressBar({ progress = 0, showLabel = true, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-slate-700">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// ==================== SHIMMER EFFECT ====================

function ShimmerEffect({ className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

// Add shimmer animation to style
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
document.head.appendChild(shimmerStyle);

// ==================== LOADING OVERLAY ====================

function LoadingOverlay({ visible, message = 'Loading...' }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-8 max-w-sm mx-4">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-slate-700 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== EXPORTS ====================

window.LoadingComponents = {
  LoadingSpinner,
  Skeleton,
  JobCardSkeleton,
  DriverCardSkeleton,
  ListSkeleton,
  FullPageLoader,
  ButtonLoader,
  ContentLoader,
  TableSkeleton,
  StatsCardSkeleton,
  EmptyState,
  ProgressBar,
  ShimmerEffect,
  LoadingOverlay
};

// Export individual components for convenience
window.LoadingSpinner = LoadingSpinner;
window.Skeleton = Skeleton;
window.JobCardSkeleton = JobCardSkeleton;
window.DriverCardSkeleton = DriverCardSkeleton;
window.ListSkeleton = ListSkeleton;
window.FullPageLoader = FullPageLoader;
window.ButtonLoader = ButtonLoader;
window.ContentLoader = ContentLoader;
window.TableSkeleton = TableSkeleton;
window.StatsCardSkeleton = StatsCardSkeleton;
window.EmptyState = EmptyState;
window.ProgressBar = ProgressBar;
window.ShimmerEffect = ShimmerEffect;
window.LoadingOverlay = LoadingOverlay;

console.log('✅ Loading components loaded');
