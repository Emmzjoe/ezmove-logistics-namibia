// ==================== AUTHENTICATION MIDDLEWARE ====================
// JWT authentication and authorization

const { verifyAccessToken } = require('../utils/jwt');

/**
 * Authenticate JWT token from request headers
 * Adds user data to req.user if valid
 */
async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format. Use: Bearer <token>',
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Add user data to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  } catch (error) {
    if (error.message === 'Access token expired') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.message === 'Invalid access token') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
}

/**
 * Require specific user types
 * @param {...string} allowedTypes - Allowed user types (e.g., 'client', 'driver', 'admin')
 */
function requireUserType(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `This endpoint requires one of: ${allowedTypes.join(', ')}`,
      });
    }

    next();
  };
}

/**
 * Require admin user type
 */
const requireAdmin = requireUserType('admin');

/**
 * Require driver user type
 */
const requireDriver = requireUserType('driver');

/**
 * Require client user type
 */
const requireClient = requireUserType('client');

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work differently for authenticated users
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}

module.exports = {
  authenticate,
  requireUserType,
  requireAdmin,
  requireDriver,
  requireClient,
  optionalAuth,
};
