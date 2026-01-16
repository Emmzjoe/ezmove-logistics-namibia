// ==================== JOB MANAGEMENT INTEGRATION ====================
// This file contains hooks and utilities for job management with API integration

const { useState, useEffect, useCallback } = React;

// Custom hook for managing jobs with API integration
function useJobs(userType, userId) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await window.API.Job.getJobs();

      if (response.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (window.API?.TokenManager?.isAuthenticated()) {
      fetchJobs();
    }
  }, [fetchJobs]);

  // Refresh jobs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.API?.TokenManager?.isAuthenticated()) {
        fetchJobs();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}

// Custom hook for creating jobs
function useCreateJob() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createJob = async (jobData) => {
    try {
      setCreating(true);
      setError(null);

      // Map frontend format to backend format
      const apiJobData = {
        pickupAddress: jobData.pickup.address,
        pickupLocation: jobData.pickup.location,
        deliveryAddress: jobData.delivery.address,
        deliveryLocation: jobData.delivery.location,
        loadType: jobData.loadType,
        loadWeight: jobData.loadWeight,
        loadDimensions: jobData.loadDimensions,
        vehicleType: jobData.vehicleType,
        specialInstructions: jobData.specialInstructions,
        scheduledPickup: jobData.scheduledPickup
      };

      const response = await window.API.Job.createJob(apiJobData);

      if (response.success) {
        return { success: true, job: response.data };
      } else {
        throw new Error(response.error || 'Failed to create job');
      }
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setCreating(false);
    }
  };

  return { createJob, creating, error };
}

// Custom hook for driver job actions
function useDriverJobActions() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const acceptJob = async (jobId) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await window.API.Job.acceptJob(jobId);

      if (response.success) {
        return { success: true, job: response.data };
      } else {
        throw new Error(response.error || 'Failed to accept job');
      }
    } catch (err) {
      console.error('Error accepting job:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const startJob = async (jobId) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await window.API.Job.startJob(jobId);

      if (response.success) {
        return { success: true, job: response.data };
      } else {
        throw new Error(response.error || 'Failed to start job');
      }
    } catch (err) {
      console.error('Error starting job:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const completeJob = async (jobId, deliveryProof = 'Delivered successfully') => {
    try {
      setProcessing(true);
      setError(null);

      const response = await window.API.Job.completeJob(jobId, deliveryProof);

      if (response.success) {
        return { success: true, job: response.data };
      } else {
        throw new Error(response.error || 'Failed to complete job');
      }
    } catch (err) {
      console.error('Error completing job:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const cancelJob = async (jobId, reason) => {
    try {
      setProcessing(true);
      setError(null);

      const response = await window.API.Job.cancelJob(jobId, reason);

      if (response.success) {
        return { success: true, job: response.data };
      } else {
        throw new Error(response.error || 'Failed to cancel job');
      }
    } catch (err) {
      console.error('Error cancelling job:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const rateJob = async (jobId, rating, review = '') => {
    try {
      setProcessing(true);
      setError(null);

      const response = await window.API.Job.rateJob(jobId, rating, review);

      if (response.success) {
        return { success: true, job: response.data };
      } else {
        throw new Error(response.error || 'Failed to rate job');
      }
    } catch (err) {
      console.error('Error rating job:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  return {
    acceptJob,
    startJob,
    completeJob,
    cancelJob,
    rateJob,
    processing,
    error
  };
}

// Custom hook for real-time job tracking
function useJobTracking(jobId) {
  const [location, setLocation] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    // Connect WebSocket
    window.API.WebSocket.connect();
    setConnected(true);

    // Subscribe to job tracking
    window.API.WebSocket.trackJob(jobId, (locationData) => {
      setLocation(locationData);
    });

    // Cleanup on unmount
    return () => {
      window.API.WebSocket.untrackJob(jobId);
    };
  }, [jobId]);

  return { location, connected };
}

// Custom hook for driver location updates
function useDriverLocation() {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsSharing(true);

    // Connect WebSocket
    window.API.WebSocket.connect();

    // Watch position and send updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        window.API.WebSocket.updateLocation(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Return cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsSharing(false);
    };
  }, []);

  const stopSharing = useCallback(() => {
    setIsSharing(false);
  }, []);

  return { isSharing, startSharing, stopSharing, error };
}

// Utility function to format job data for display
function formatJobForDisplay(apiJob) {
  if (!apiJob) return null;

  return {
    id: apiJob.id,
    jobNumber: apiJob.job_number,
    status: apiJob.status,
    pickup: {
      address: apiJob.pickup_address,
      location: {
        lat: apiJob.pickup_lat,
        lng: apiJob.pickup_lng
      }
    },
    delivery: {
      address: apiJob.delivery_address,
      location: {
        lat: apiJob.delivery_lat,
        lng: apiJob.delivery_lng
      }
    },
    loadType: apiJob.load_type,
    loadWeight: apiJob.load_weight,
    loadDimensions: apiJob.load_dimensions,
    vehicleType: apiJob.vehicle_type,
    distance: apiJob.distance_km,
    estimatedTime: apiJob.estimated_duration_mins,
    pricing: {
      basePrice: apiJob.base_price,
      distancePrice: apiJob.distance_price,
      timePrice: apiJob.time_price,
      totalPrice: apiJob.total_price,
      driverEarnings: apiJob.driver_earnings
    },
    client: apiJob.client,
    driver: apiJob.driver,
    specialInstructions: apiJob.special_instructions,
    scheduledPickup: apiJob.scheduled_pickup,
    acceptedAt: apiJob.accepted_at,
    startedAt: apiJob.started_at,
    completedAt: apiJob.completed_at,
    cancelledAt: apiJob.cancelled_at,
    rating: apiJob.client_rating,
    review: apiJob.client_review,
    createdAt: apiJob.created_at
  };
}

// Filter jobs based on user role and status
function filterJobsByUser(jobs, userType, userId) {
  if (!jobs || !Array.isArray(jobs)) return [];

  return jobs.map(formatJobForDisplay).filter(job => {
    if (!job) return false;

    if (userType === 'client') {
      // Show jobs created by this client
      return job.client?.id === userId;
    } else if (userType === 'driver') {
      // Show jobs assigned to this driver or available jobs
      return job.driver?.id === userId || job.status === 'pending';
    }

    return false;
  });
}

// Export hooks and utilities to window
window.JobHooks = {
  useJobs,
  useCreateJob,
  useDriverJobActions,
  useJobTracking,
  useDriverLocation,
  formatJobForDisplay,
  filterJobsByUser
};
