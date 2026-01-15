const { User, DriverProfile } = require('../models');
const authService = require('../services/authService');

class AuthController {
  async registerClient(req, res) {
    try {
      const { email, phone, password, fullName, address } = req.body;

      // Validation
      if (!email || !phone || !password || !fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user exists
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { phone }]
        }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Email or phone already registered' });
      }

      // Hash password
      const passwordHash = await User.hashPassword(password);

      // Create user
      const user = await User.create({
        email,
        phone,
        password_hash: passwordHash,
        full_name: fullName,
        user_type: 'client',
        status: 'active'
      });

      // Generate tokens
      const accessToken = authService.generateAccessToken(user.id, user.user_type);
      const refreshToken = authService.generateRefreshToken(user.id);

      res.status(201).json({
        success: true,
        message: 'Client registered successfully',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.full_name,
          userType: user.user_type
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Register client error:', error);
      res.status(500).json({ error: 'Registration failed', message: error.message });
    }
  }

  async registerDriver(req, res) {
    try {
      const {
        email,
        phone,
        password,
        fullName,
        vehicleType,
        licensePlate,
        licenseNumber,
        licenseExpiry,
        vehicleRegistration,
        insuranceProvider,
        insurancePolicy,
        insuranceExpiry
      } = req.body;

      // Validation
      if (!email || !phone || !password || !fullName || !vehicleType || !licensePlate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user or license plate exists
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { phone }]
        }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Email or phone already registered' });
      }

      const existingPlate = await DriverProfile.findOne({
        where: { license_plate: licensePlate }
      });

      if (existingPlate) {
        return res.status(409).json({ error: 'License plate already registered' });
      }

      // Hash password
      const passwordHash = await User.hashPassword(password);

      // Create user
      const user = await User.create({
        email,
        phone,
        password_hash: passwordHash,
        full_name: fullName,
        user_type: 'driver',
        status: 'active'
      });

      // Create driver profile
      await DriverProfile.create({
        user_id: user.id,
        vehicle_type: vehicleType,
        license_plate: licensePlate,
        license_number: licenseNumber || '',
        license_expiry: licenseExpiry || new Date(),
        vehicle_registration: vehicleRegistration || '',
        insurance_provider: insuranceProvider || '',
        insurance_policy: insurancePolicy || '',
        insurance_expiry: insuranceExpiry || new Date(),
        verification_status: 'pending'
      });

      // Generate tokens
      const accessToken = authService.generateAccessToken(user.id, user.user_type);
      const refreshToken = authService.generateRefreshToken(user.id);

      res.status(201).json({
        success: true,
        message: 'Driver registered successfully. Please submit verification documents.',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.full_name,
          userType: user.user_type
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Register driver error:', error);
      res.status(500).json({ error: 'Registration failed', message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Find user
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Account is suspended or banned' });
      }

      // For drivers, fetch driver profile
      let driverProfile = null;
      if (user.user_type === 'driver') {
        driverProfile = await DriverProfile.findOne({ where: { user_id: user.id } });
      }

      // Generate tokens
      const accessToken = authService.generateAccessToken(user.id, user.user_type);
      const refreshToken = authService.generateRefreshToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.full_name,
          userType: user.user_type,
          driverProfile: driverProfile ? {
            vehicleType: driverProfile.vehicle_type,
            licensePlate: driverProfile.license_plate,
            verificationStatus: driverProfile.verification_status,
            rating: driverProfile.rating,
            totalJobs: driverProfile.total_jobs
          } : null
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed', message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }

      const decoded = await authService.verifyToken(refreshToken);

      if (decoded.type !== 'refresh') {
        return res.status(401).json({ error: 'Invalid token type' });
      }

      const user = await User.findByPk(decoded.userId);

      if (!user || user.status !== 'active') {
        return res.status(401).json({ error: 'User not found or inactive' });
      }

      // Generate new access token
      const accessToken = authService.generateAccessToken(user.id, user.user_type);

      res.json({
        success: true,
        accessToken
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: 'Token refresh failed', message: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const user = req.user;

      let driverProfile = null;
      if (user.user_type === 'driver') {
        driverProfile = await DriverProfile.findOne({ where: { user_id: user.id } });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.full_name,
          userType: user.user_type,
          emailVerified: user.email_verified,
          phoneVerified: user.phone_verified,
          status: user.status,
          driverProfile: driverProfile ? {
            vehicleType: driverProfile.vehicle_type,
            licensePlate: driverProfile.license_plate,
            verificationStatus: driverProfile.verification_status,
            rating: driverProfile.rating,
            totalJobs: driverProfile.total_jobs,
            totalEarnings: driverProfile.total_earnings,
            availability: driverProfile.availability
          } : null
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Failed to get user', message: error.message });
    }
  }
}

module.exports = new AuthController();
