const { Job, User, DriverProfile } = require('../models');
const pricingService = require('../services/pricingService');
const { Op } = require('sequelize');

class JobController {
  async createJob(req, res) {
    try {
      const clientId = req.user.id;
      const {
        pickupAddress,
        pickupLatitude,
        pickupLongitude,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        vehicleType,
        loadType,
        weightKg,
        volumeM3,
        valueNad,
        specialInstructions,
        pickupContactName,
        pickupContactPhone,
        deliveryContactName,
        deliveryContactPhone
      } = req.body;

      // Validation
      if (!pickupAddress || !pickupLatitude || !pickupLongitude ||
          !deliveryAddress || !deliveryLatitude || !deliveryLongitude || !vehicleType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Calculate distance and duration
      const distanceKm = pricingService.estimateDistance(
        { latitude: pickupLatitude, longitude: pickupLongitude },
        { latitude: deliveryLatitude, longitude: deliveryLongitude }
      );

      const durationMinutes = pricingService.estimateDuration(distanceKm);

      // Calculate pricing
      const pricing = pricingService.calculatePrice(vehicleType, distanceKm, durationMinutes);

      // Generate job number
      const jobNumber = Job.generateJobNumber();

      // Create job
      const job = await Job.create({
        job_number: jobNumber,
        client_id: clientId,
        pickup_address: pickupAddress,
        pickup_latitude: pickupLatitude,
        pickup_longitude: pickupLongitude,
        pickup_contact_name: pickupContactName,
        pickup_contact_phone: pickupContactPhone,
        delivery_address: deliveryAddress,
        delivery_latitude: deliveryLatitude,
        delivery_longitude: deliveryLongitude,
        delivery_contact_name: deliveryContactName,
        delivery_contact_phone: deliveryContactPhone,
        vehicle_type: vehicleType,
        load_type: loadType,
        weight_kg: weightKg,
        volume_m3: volumeM3,
        value_nad: valueNad,
        special_instructions: specialInstructions,
        distance_km: distanceKm,
        estimated_duration_minutes: durationMinutes,
        base_price: pricing.basePrice,
        distance_price: pricing.distancePrice,
        time_price: pricing.timePrice,
        total_price: pricing.totalPrice,
        platform_commission: pricing.platformCommission,
        driver_earnings: pricing.driverEarnings,
        status: 'pending',
        payment_status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        job: {
          id: job.id,
          jobNumber: job.job_number,
          pickupAddress: job.pickup_address,
          deliveryAddress: job.delivery_address,
          vehicleType: job.vehicle_type,
          distanceKm: job.distance_km,
          estimatedDuration: job.estimated_duration_minutes,
          pricing: {
            basePrice: job.base_price,
            distancePrice: job.distance_price,
            timePrice: job.time_price,
            totalPrice: job.total_price
          },
          status: job.status,
          createdAt: job.created_at
        }
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Failed to create job', message: error.message });
    }
  }

  async getJobs(req, res) {
    try {
      const userId = req.user.id;
      const userType = req.user.user_type;
      const { status, page = 1, limit = 20 } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (status) {
        where.status = status;
      }

      // Filter based on user type
      if (userType === 'client') {
        where.client_id = userId;
      } else if (userType === 'driver') {
        // For drivers, show available jobs or their accepted/in-progress/completed jobs
        const driverProfile = await DriverProfile.findOne({ where: { user_id: userId } });
        
        if (!driverProfile) {
          return res.status(404).json({ error: 'Driver profile not found' });
        }

        // Show pending jobs matching their vehicle type OR jobs assigned to them
        where[Op.or] = [
          { status: 'pending', vehicle_type: driverProfile.vehicle_type },
          { driver_id: userId }
        ];
      }

      const { count, rows: jobs } = await Job.findAndCountAll({
        where,
        include: [
          { model: User, as: 'client', attributes: ['id', 'full_name', 'phone'] },
          { model: User, as: 'driver', attributes: ['id', 'full_name', 'phone'] }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        jobs: jobs.map(job => ({
          id: job.id,
          jobNumber: job.job_number,
          pickupAddress: job.pickup_address,
          deliveryAddress: job.delivery_address,
          vehicleType: job.vehicle_type,
          loadType: job.load_type,
          distanceKm: job.distance_km,
          estimatedDuration: job.estimated_duration_minutes,
          totalPrice: job.total_price,
          driverEarnings: job.driver_earnings,
          status: job.status,
          paymentStatus: job.payment_status,
          client: job.client,
          driver: job.driver,
          createdAt: job.created_at
        })),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ error: 'Failed to get jobs', message: error.message });
    }
  }

  async getJobById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userType = req.user.user_type;

      const job = await Job.findByPk(id, {
        include: [
          { model: User, as: 'client', attributes: ['id', 'full_name', 'phone', 'email'] },
          { model: User, as: 'driver', attributes: ['id', 'full_name', 'phone', 'email'] }
        ]
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check permissions
      if (userType === 'client' && job.client_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to view this job' });
      }

      if (userType === 'driver' && job.driver_id !== userId && job.status !== 'pending') {
        return res.status(403).json({ error: 'Not authorized to view this job' });
      }

      res.json({
        success: true,
        job: {
          id: job.id,
          jobNumber: job.job_number,
          pickup: {
            address: job.pickup_address,
            latitude: job.pickup_latitude,
            longitude: job.pickup_longitude,
            contactName: job.pickup_contact_name,
            contactPhone: job.pickup_contact_phone
          },
          delivery: {
            address: job.delivery_address,
            latitude: job.delivery_latitude,
            longitude: job.delivery_longitude,
            contactName: job.delivery_contact_name,
            contactPhone: job.delivery_contact_phone
          },
          vehicleType: job.vehicle_type,
          loadType: job.load_type,
          weight: job.weight_kg,
          volume: job.volume_m3,
          value: job.value_nad,
          specialInstructions: job.special_instructions,
          distanceKm: job.distance_km,
          estimatedDuration: job.estimated_duration_minutes,
          pricing: {
            basePrice: job.base_price,
            distancePrice: job.distance_price,
            timePrice: job.time_price,
            totalPrice: job.total_price,
            driverEarnings: job.driver_earnings,
            platformCommission: job.platform_commission
          },
          status: job.status,
          paymentStatus: job.payment_status,
          client: job.client,
          driver: job.driver,
          timestamps: {
            created: job.created_at,
            accepted: job.accepted_at,
            started: job.started_at,
            completed: job.completed_at
          }
        }
      });
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ error: 'Failed to get job', message: error.message });
    }
  }

  async acceptJob(req, res) {
    try {
      const { id } = req.params;
      const driverId = req.user.id;

      // Get driver profile
      const driverProfile = await DriverProfile.findOne({ where: { user_id: driverId } });

      if (!driverProfile) {
        return res.status(404).json({ error: 'Driver profile not found' });
      }

      if (driverProfile.verification_status !== 'verified') {
        return res.status(403).json({ error: 'Driver not verified. Please complete verification first.' });
      }

      // Get job
      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.status !== 'pending') {
        return res.status(400).json({ error: 'Job is not available' });
      }

      if (job.vehicle_type !== driverProfile.vehicle_type) {
        return res.status(400).json({ error: 'Vehicle type mismatch' });
      }

      // Accept job
      await job.update({
        driver_id: driverId,
        status: 'accepted',
        accepted_at: new Date()
      });

      res.json({
        success: true,
        message: 'Job accepted successfully',
        job: {
          id: job.id,
          jobNumber: job.job_number,
          status: job.status,
          driverEarnings: job.driver_earnings,
          acceptedAt: job.accepted_at
        }
      });
    } catch (error) {
      console.error('Accept job error:', error);
      res.status(500).json({ error: 'Failed to accept job', message: error.message });
    }
  }

  async startJob(req, res) {
    try {
      const { id } = req.params;
      const driverId = req.user.id;

      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.driver_id !== driverId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (job.status !== 'accepted') {
        return res.status(400).json({ error: 'Job must be accepted before starting' });
      }

      await job.update({
        status: 'in_progress',
        started_at: new Date()
      });

      res.json({
        success: true,
        message: 'Job started successfully',
        job: {
          id: job.id,
          status: job.status,
          startedAt: job.started_at
        }
      });
    } catch (error) {
      console.error('Start job error:', error);
      res.status(500).json({ error: 'Failed to start job', message: error.message });
    }
  }

  async completeJob(req, res) {
    try {
      const { id } = req.params;
      const driverId = req.user.id;

      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.driver_id !== driverId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (job.status !== 'in_progress') {
        return res.status(400).json({ error: 'Job must be in progress to complete' });
      }

      await job.update({
        status: 'completed',
        completed_at: new Date()
      });

      // Update driver stats
      const driverProfile = await DriverProfile.findOne({ where: { user_id: driverId } });
      await driverProfile.update({
        total_jobs: driverProfile.total_jobs + 1,
        total_earnings: parseFloat(driverProfile.total_earnings) + parseFloat(job.driver_earnings)
      });

      res.json({
        success: true,
        message: 'Job completed successfully',
        job: {
          id: job.id,
          status: job.status,
          completedAt: job.completed_at,
          earnings: job.driver_earnings
        }
      });
    } catch (error) {
      console.error('Complete job error:', error);
      res.status(500).json({ error: 'Failed to complete job', message: error.message });
    }
  }

  async cancelJob(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { reason } = req.body;

      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Only client or assigned driver can cancel
      if (job.client_id !== userId && job.driver_id !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (job.status === 'completed') {
        return res.status(400).json({ error: 'Cannot cancel completed job' });
      }

      await job.update({
        status: 'cancelled',
        cancelled_at: new Date(),
        cancellation_reason: reason,
        driver_id: null // Unassign driver if any
      });

      res.json({
        success: true,
        message: 'Job cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel job error:', error);
      res.status(500).json({ error: 'Failed to cancel job', message: error.message });
    }
  }

  async rateJob(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userType = req.user.user_type;
      const { rating, review } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.status !== 'completed') {
        return res.status(400).json({ error: 'Can only rate completed jobs' });
      }

      // Update rating based on user type
      if (userType === 'client' && job.client_id === userId) {
        if (job.driver_rating) {
          return res.status(400).json({ error: 'You have already rated this job' });
        }

        await job.update({
          driver_rating: rating,
          driver_review: review
        });

        // Update driver's average rating
        const driverJobs = await Job.findAll({
          where: { driver_id: job.driver_id, driver_rating: { [Op.not]: null } }
        });

        const avgRating = driverJobs.reduce((sum, j) => sum + j.driver_rating, 0) / driverJobs.length;
        
        const driverProfile = await DriverProfile.findOne({ where: { user_id: job.driver_id } });
        await driverProfile.update({ rating: avgRating.toFixed(2) });

      } else if (userType === 'driver' && job.driver_id === userId) {
        if (job.client_rating) {
          return res.status(400).json({ error: 'You have already rated this job' });
        }

        await job.update({
          client_rating: rating,
          client_review: review
        });
      } else {
        return res.status(403).json({ error: 'Not authorized to rate this job' });
      }

      res.json({
        success: true,
        message: 'Rating submitted successfully'
      });
    } catch (error) {
      console.error('Rate job error:', error);
      res.status(500).json({ error: 'Failed to rate job', message: error.message });
    }
  }
}

module.exports = new JobController();
