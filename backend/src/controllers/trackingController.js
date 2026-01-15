const { Job, DriverProfile } = require('../models');
const trackingService = require('../services/trackingService');

class TrackingController {
  setTrackingService(service) {
    this.trackingService = service;
  }

  async getJobTrackingHistory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userType = req.user.user_type;

      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check permissions
      if (userType === 'client' && job.client_id !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (userType === 'driver' && job.driver_id !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const tracking = await this.trackingService.getJobTrackingHistory(id);

      res.json({
        success: true,
        jobId: id,
        trackingHistory: tracking
      });
    } catch (error) {
      console.error('Get job tracking error:', error);
      res.status(500).json({ error: 'Failed to get tracking history', message: error.message });
    }
  }

  async getDriverLocation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userType = req.user.user_type;

      // Only allow fetching driver location if user is viewing their own job with that driver
      const job = await Job.findOne({
        where: {
          driver_id: id,
          [userType === 'client' ? 'client_id' : 'driver_id']: userId
        }
      });

      if (!job) {
        return res.status(403).json({ error: 'Not authorized to view this driver location' });
      }

      const location = await this.trackingService.getDriverLocation(id);

      if (!location) {
        return res.status(404).json({ error: 'Location not available' });
      }

      res.json({
        success: true,
        driverId: id,
        location
      });
    } catch (error) {
      console.error('Get driver location error:', error);
      res.status(500).json({ error: 'Failed to get location', message: error.message });
    }
  }

  async calculateETA(req, res) {
    try {
      const { fromLat, fromLng, toLat, toLng } = req.query;

      if (!fromLat || !fromLng || !toLat || !toLng) {
        return res.status(400).json({ error: 'Missing coordinates' });
      }

      // Simple distance calculation (Haversine formula)
      const R = 6371; // Earth's radius in km
      const dLat = (toLat - fromLat) * Math.PI / 180;
      const dLon = (toLng - fromLng) * Math.PI / 180;
      const lat1 = fromLat * Math.PI / 180;
      const lat2 = toLat * Math.PI / 180;

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) *
                Math.cos(lat1) * Math.cos(lat2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;

      // Estimate duration (assume 40 km/h average speed)
      const avgSpeedKmh = 40;
      const durationMinutes = Math.ceil((distanceKm / avgSpeedKmh) * 60);

      const now = new Date();
      const eta = new Date(now.getTime() + durationMinutes * 60000);

      res.json({
        success: true,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        durationMinutes,
        eta: eta.toISOString()
      });
    } catch (error) {
      console.error('Calculate ETA error:', error);
      res.status(500).json({ error: 'Failed to calculate ETA', message: error.message });
    }
  }
}

module.exports = new TrackingController();
