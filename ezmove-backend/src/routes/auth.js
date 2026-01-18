// ==================== AUTHENTICATION ROUTES ====================
// Routes for user authentication

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/v1/auth/register/client
 * Register a new client
 */
router.post('/register/client', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    // Validation
    if (!email || !password || !full_name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['email', 'password', 'full_name', 'phone'],
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Phone format validation (Namibian)
    const phoneRegex = /^\+264\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use: +264XXXXXXXXX',
      });
    }

    const result = await authService.registerClient({
      email,
      password,
      full_name,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Client registered successfully',
      data: result,
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/auth/register/driver
 * Register a new driver
 */
router.post('/register/driver', async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      vehicle_type,
      license_plate,
      license_number,
      license_expiry,
      vehicle_make,
      vehicle_model,
      vehicle_year,
    } = req.body;

    // Validation
    const required = [
      'email',
      'password',
      'full_name',
      'phone',
      'vehicle_type',
      'license_plate',
      'license_number',
    ];

    const missing = required.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missing,
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Phone format validation
    const phoneRegex = /^\+264\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use: +264XXXXXXXXX',
      });
    }

    // Vehicle type validation
    const validVehicleTypes = ['BIKE', 'CAR', 'VAN', 'PICKUP', 'TRUCK'];
    if (!validVehicleTypes.includes(vehicle_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle type',
        validTypes: validVehicleTypes,
      });
    }

    const result = await authService.registerDriver({
      email,
      password,
      full_name,
      phone,
      vehicle_type,
      license_plate,
      license_number,
      license_expiry,
      vehicle_make,
      vehicle_model,
      vehicle_year,
    });

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully. Pending verification.',
      data: result,
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (
      error.message.includes('Invalid email') ||
      error.message.includes('not active')
    ) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    if (
      error.message.includes('Invalid') ||
      error.message.includes('expired') ||
      error.message.includes('revoked')
    ) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    await authService.logout(refreshToken);

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message,
    });
  }
});

module.exports = router;
