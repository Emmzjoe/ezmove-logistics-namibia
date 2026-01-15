const { Job, JobTracking, DriverProfile } = require('../models');
const authService = require('./authService');

class TrackingService {
  constructor(io) {
    this.io = io;
    this.driverLocations = new Map(); // In-memory cache for quick access
  }

  initialize() {
    // Authenticate socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = await authService.verifyToken(token);
        socket.userId = decoded.userId;
        socket.userType = decoded.userType;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    // Handle connections
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId} (${socket.userType})`);

      // Driver location updates
      socket.on('driver:location', async (data) => {
        await this.handleDriverLocation(socket, data);
      });

      // Client/Driver subscribes to job tracking
      socket.on('job:track', async (jobId) => {
        await this.handleJobTrack(socket, jobId);
      });

      // Driver stops tracking
      socket.on('job:untrack', (jobId) => {
        socket.leave(`job:${jobId}`);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        // Keep last known location in cache for 5 minutes
        setTimeout(() => {
          if (socket.userType === 'driver') {
            this.driverLocations.delete(socket.userId);
          }
        }, 5 * 60 * 1000);
      });
    });
  }

  async handleDriverLocation(socket, data) {
    try {
      if (socket.userType !== 'driver') {
        return socket.emit('error', { message: 'Only drivers can send location updates' });
      }

      const { latitude, longitude, accuracy, heading, speed, jobId } = data;

      if (!latitude || !longitude) {
        return socket.emit('error', { message: 'Latitude and longitude required' });
      }

      // Update in-memory cache
      this.driverLocations.set(socket.userId, {
        latitude,
        longitude,
        accuracy,
        heading,
        speed,
        timestamp: Date.now()
      });

      // Update driver profile in database
      await DriverProfile.update(
        {
          current_latitude: latitude,
          current_longitude: longitude,
          last_location_update: new Date()
        },
        { where: { user_id: socket.userId } }
      );

      // If driver is on an active job, broadcast to client tracking that job
      if (jobId) {
        const job = await Job.findByPk(jobId);

        if (job && job.driver_id === socket.userId && job.status === 'in_progress') {
          // Save tracking point
          await JobTracking.create({
            job_id: jobId,
            latitude,
            longitude,
            accuracy,
            heading,
            speed,
            status: 'in_transit'
          });

          // Broadcast to everyone tracking this job
          this.io.to(`job:${jobId}`).emit('driver:location:update', {
            jobId,
            location: {
              latitude,
              longitude,
              accuracy,
              heading,
              speed
            },
            timestamp: Date.now()
          });
        }
      }

      // Acknowledge receipt
      socket.emit('driver:location:ack', { success: true });

    } catch (error) {
      console.error('Handle driver location error:', error);
      socket.emit('error', { message: 'Failed to update location' });
    }
  }

  async handleJobTrack(socket, jobId) {
    try {
      const job = await Job.findByPk(jobId);

      if (!job) {
        return socket.emit('error', { message: 'Job not found' });
      }

      // Check permissions
      if (socket.userType === 'client' && job.client_id !== socket.userId) {
        return socket.emit('error', { message: 'Not authorized' });
      }

      if (socket.userType === 'driver' && job.driver_id !== socket.userId) {
        return socket.emit('error', { message: 'Not authorized' });
      }

      // Join tracking room
      socket.join(`job:${jobId}`);

      // Send current driver location if available
      if (job.driver_id) {
        const cachedLocation = this.driverLocations.get(job.driver_id);

        if (cachedLocation) {
          socket.emit('driver:location:update', {
            jobId,
            location: cachedLocation,
            timestamp: cachedLocation.timestamp
          });
        } else {
          // Fetch from database
          const driverProfile = await DriverProfile.findOne({
            where: { user_id: job.driver_id }
          });

          if (driverProfile && driverProfile.current_latitude && driverProfile.current_longitude) {
            socket.emit('driver:location:update', {
              jobId,
              location: {
                latitude: driverProfile.current_latitude,
                longitude: driverProfile.current_longitude
              },
              timestamp: driverProfile.last_location_update
            });
          }
        }
      }

      // Send acknowledgment
      socket.emit('job:track:ack', { success: true, jobId });

    } catch (error) {
      console.error('Handle job track error:', error);
      socket.emit('error', { message: 'Failed to track job' });
    }
  }

  async getJobTrackingHistory(jobId) {
    const tracking = await JobTracking.findAll({
      where: { job_id: jobId },
      order: [['created_at', 'ASC']]
    });

    return tracking.map(t => ({
      latitude: t.latitude,
      longitude: t.longitude,
      accuracy: t.accuracy,
      heading: t.heading,
      speed: t.speed,
      status: t.status,
      timestamp: t.created_at
    }));
  }

  async getDriverLocation(driverId) {
    // Check cache first
    const cached = this.driverLocations.get(driverId);
    if (cached) {
      return cached;
    }

    // Fallback to database
    const driverProfile = await DriverProfile.findOne({
      where: { user_id: driverId }
    });

    if (driverProfile && driverProfile.current_latitude) {
      return {
        latitude: driverProfile.current_latitude,
        longitude: driverProfile.current_longitude,
        timestamp: driverProfile.last_location_update
      };
    }

    return null;
  }
}

module.exports = TrackingService;
