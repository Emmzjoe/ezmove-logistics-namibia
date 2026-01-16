// ==================== API-INTEGRATED JOB COMPONENTS ====================
// Components that use the backend API for job operations

const { useState } = React;

// Wrapper for NewJobForm that integrates with API
function NewJobFormAPI({ onSuccess, onCancel }) {
  const { createJob, creating, error } = window.JobHooks.useCreateJob();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (localJob) => {
    setSubmitting(true);
    setApiError(null);

    try {
      // Transform local job format to API format
      const apiJobData = {
        pickup: {
          address: localJob.origin,
          location: { lat: -22.5609, lng: 17.0658 } // TODO: Get actual coordinates
        },
        delivery: {
          address: localJob.destination,
          location: { lat: -22.5709, lng: 17.0758 } // TODO: Get actual coordinates
        },
        loadType: localJob.loadType,
        loadWeight: localJob.weight || '0 kg',
        loadDimensions: localJob.volume || 'Not specified',
        vehicleType: localJob.vehicleType,
        specialInstructions: localJob.instructions || '',
        scheduledPickup: null
      };

      const result = await createJob(apiJobData);

      if (result.success) {
        onSuccess(result.job);
      } else {
        setApiError(result.error || 'Failed to create job');
      }
    } catch (err) {
      setApiError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Use the existing NewJobForm component but wrap the onSubmit
  return (
    <div>
      {(apiError || error) && (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {apiError || error}
          </div>
        </div>
      )}

      {/* Render the original NewJobForm */}
      {typeof window.NewJobForm !== 'undefined' ? (
        <window.NewJobForm
          drivers={[]} // Not needed for API version
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-slate-600">Loading form...</p>
          </div>
        </div>
      )}

      {(submitting || creating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="spinner"></div>
              <p className="text-slate-700 font-medium">Creating your job...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Client App with API integration
function ClientAppAPI({ onLogout }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const { jobs, loading, error, refetch } = window.JobHooks.useJobs('client', currentUser.id);
  const [currentView, setCurrentView] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter jobs for this client
  const myJobs = jobs.filter(job =>
    job.client_id === currentUser.id && job.status !== 'cancelled'
  );
  const activeJobs = myJobs.filter(job =>
    ['pending', 'accepted', 'in_progress'].includes(job.status)
  );
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  const handleJobCreated = (newJob) => {
    refetch(); // Refresh job list
    setCurrentView('jobs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your jobs...</p>
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
              <span className="text-sm text-slate-600">
                {currentUser.full_name || currentUser.email}
              </span>
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
              My Jobs {activeJobs.length > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeJobs.length}
                </span>
              )}
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
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {currentView === 'home' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome back!</h2>
              <p className="text-slate-600 mb-6">
                You have {activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''}.
              </p>
              <button
                onClick={() => setCurrentView('new-job')}
                className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                + Create New Job
              </button>
            </div>

            {activeJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Active Jobs</h3>
                <div className="space-y-3">
                  {activeJobs.slice(0, 3).map(job => (
                    <div
                      key={job.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedJob(job);
                        setCurrentView('jobs');
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800">
                            {job.pickup_address} → {job.delivery_address}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Job #{job.job_number}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                          job.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'new-job' && (
          <NewJobFormAPI
            onSuccess={handleJobCreated}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'jobs' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Active Jobs</h2>
            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No active jobs</p>
                <button
                  onClick={() => setCurrentView('new-job')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Create Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Job #{job.job_number}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Created {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
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

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-slate-500">Total Price</p>
                        <p className="text-xl font-bold text-orange-600">
                          NAD {job.total_price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      {job.driver && (
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Driver</p>
                          <p className="font-medium text-slate-800">
                            {job.driver.full_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'history' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Completed Jobs</h2>
            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No completed jobs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Job #{job.job_number}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {job.pickup_address} → {job.delivery_address}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Completed {new Date(job.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-slate-800">
                        NAD {job.total_price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Export to window
window.ClientAppAPI = ClientAppAPI;
window.NewJobFormAPI = NewJobFormAPI;
