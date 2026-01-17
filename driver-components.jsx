// ==================== API-INTEGRATED DRIVER COMPONENTS ====================
// Components that use the backend API for driver operations

const { useState, useEffect } = React;

// Driver App with API integration
function DriverAppAPI({ onLogout }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const { jobs, loading, error, refetch } = window.JobHooks.useJobs('driver', currentUser.id);
  const { acceptJob, startJob, completeJob, processing } = window.JobHooks.useDriverJobActions();
  const { isSharing, startSharing, stopSharing } = window.JobHooks.useDriverLocation();

  const [currentView, setCurrentView] = useState('available');
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [jobToComplete, setJobToComplete] = useState(null);

  // Get driver profile from current user
  const driverProfile = currentUser.driverProfile || {};

  // Filter jobs for driver
  const availableJobs = jobs.filter(job =>
    job.status === 'pending' &&
    job.vehicle_type === driverProfile.vehicle_type
  );

  const myJobs = jobs.filter(job => job.driver_id === currentUser.id);
  const activeJobs = myJobs.filter(job =>
    ['accepted', 'in_progress'].includes(job.status)
  );
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  // Start sharing location when driver has active jobs
  useEffect(() => {
    if (activeJobs.length > 0 && !isSharing) {
      startSharing();
    }
  }, [activeJobs.length, isSharing, startSharing]);

  const handleAcceptJob = async (jobId) => {
    setActionError(null);
    const result = await acceptJob(jobId);

    if (result.success) {
      refetch(); // Refresh jobs
      setCurrentView('active');
    } else {
      setActionError(result.error);
    }
  };

  const handleStartJob = async (jobId) => {
    setActionError(null);
    const result = await startJob(jobId);

    if (result.success) {
      refetch();
    } else {
      setActionError(result.error);
    }
  };

  const handleCompleteJob = async (jobId, deliveryProof) => {
    setActionError(null);
    const result = await completeJob(jobId, deliveryProof);

    if (result.success) {
      setShowCompletionModal(false);
      setJobToComplete(null);
      refetch();
      stopSharing(); // Stop sharing location when job is completed
    } else {
      setActionError(result.error);
    }
  };

  const openCompletionModal = (job) => {
    setJobToComplete(job);
    setShowCompletionModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-slate-800">
                EZ<span className="text-orange-500">Move</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">
                  {currentUser.full_name || currentUser.email}
                </p>
                <p className="text-xs text-slate-500">
                  {driverProfile.vehicle_type ?
                    `${driverProfile.vehicle_type} - ${driverProfile.license_plate}` :
                    'Driver'
                  }
                </p>
              </div>
              {isSharing && (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Sharing Location
                </span>
              )}
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
              onClick={() => setCurrentView('available')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentView === 'available'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Available {availableJobs.length > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {availableJobs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('active')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentView === 'active'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              My Jobs {activeJobs.length > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeJobs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('completed')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentView === 'completed'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {(error || actionError) && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error || actionError}
          </div>
        )}

        {/* Available Jobs */}
        {currentView === 'available' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Jobs</h2>
            {availableJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No available jobs matching your vehicle type</p>
                <p className="text-sm text-slate-500 mt-2">
                  Your vehicle: {driverProfile.vehicle_type || 'Not set'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Job #{job.job_number}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Posted {new Date(job.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Available
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Pickup</p>
                        <p className="font-medium text-slate-800">{job.pickup_address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Delivery</p>
                        <p className="font-medium text-slate-800">{job.delivery_address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500">Distance</p>
                        <p className="font-medium text-slate-800">{job.distance_km?.toFixed(1) || '0'} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Load Type</p>
                        <p className="font-medium text-slate-800">{job.load_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Vehicle</p>
                        <p className="font-medium text-slate-800">{job.vehicle_type}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-slate-500">Your Earnings</p>
                        <p className="text-xl font-bold text-green-600">
                          NAD {job.driver_earnings?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        disabled={processing}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        {processing ? 'Accepting...' : 'Accept Job'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Jobs */}
        {currentView === 'active' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Active Jobs</h2>
            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No active jobs</p>
                <button
                  onClick={() => setCurrentView('available')}
                  className="mt-4 text-orange-600 hover:text-orange-700"
                >
                  View Available Jobs →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Job #{job.job_number}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {job.status === 'accepted' ? 'Accepted' : 'In Progress'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'accepted'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {job.status === 'accepted' ? 'Accepted' : 'In Progress'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Pickup</p>
                        <p className="font-medium text-slate-800">{job.pickup_address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Delivery</p>
                        <p className="font-medium text-slate-800">{job.delivery_address}</p>
                      </div>
                    </div>

                    {job.client && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Client</p>
                        <p className="font-medium text-slate-800">{job.client.full_name}</p>
                        <p className="text-sm text-slate-600">{job.client.phone}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-slate-500">Your Earnings</p>
                        <p className="text-xl font-bold text-green-600">
                          NAD {job.driver_earnings?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {job.status === 'accepted' && (
                          <button
                            onClick={() => handleStartJob(job.id)}
                            disabled={processing}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            {processing ? 'Starting...' : 'Start Delivery'}
                          </button>
                        )}
                        {job.status === 'in_progress' && (
                          <button
                            onClick={() => openCompletionModal(job)}
                            disabled={processing}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            Complete Delivery
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Jobs */}
        {currentView === 'completed' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Completed Jobs</h2>
            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No completed jobs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Job #{job.job_number}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Completed {new Date(job.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Route</p>
                        <p className="font-medium text-slate-800">
                          {job.pickup_address} → {job.delivery_address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Earned</p>
                        <p className="text-lg font-bold text-green-600">
                          NAD {job.driver_earnings?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    {job.client_rating && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-slate-500 mb-1">Client Rating</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < job.client_rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-slate-600">
                            ({job.client_rating}/5)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="spinner"></div>
              <p className="text-slate-700 font-medium">Processing...</p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal with Photo Proof */}
      {showCompletionModal && jobToComplete && window.JobCompletionModal && (
        <window.JobCompletionModal
          job={jobToComplete}
          onComplete={handleCompleteJob}
          onCancel={() => {
            setShowCompletionModal(false);
            setJobToComplete(null);
          }}
          processing={processing}
        />
      )}
    </div>
  );
}

// Export to window
window.DriverAppAPI = DriverAppAPI;
