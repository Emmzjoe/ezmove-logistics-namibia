// ==================== AUTHENTICATION SERVICE ====================
// Business logic for authentication

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { generateTokenPair } = require('../utils/jwt');
const config = require('../config/config');

/**
 * Register a new client user
 */
async function registerClient(data) {
  const { email, password, full_name, phone } = data;

  // Check if user already exists
  const existing = await db.query(
    'SELECT id FROM users WHERE email = $1 OR phone = $2',
    [email, phone]
  );

  if (existing.rows.length > 0) {
    throw new Error('User with this email or phone already exists');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Create user
  const result = await db.query(
    `INSERT INTO users (email, password_hash, full_name, phone, user_type, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, full_name, phone, user_type, created_at`,
    [email, password_hash, full_name, phone, 'client', 'active']
  );

  const user = result.rows[0];

  // Generate tokens
  const tokens = generateTokenPair(user);

  // Store refresh token
  await storeRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    ...tokens,
  };
}

/**
 * Register a new driver user
 */
async function registerDriver(data) {
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
  } = data;

  // Check if user already exists
  const existing = await db.query(
    'SELECT id FROM users WHERE email = $1 OR phone = $2',
    [email, phone]
  );

  if (existing.rows.length > 0) {
    throw new Error('User with this email or phone already exists');
  }

  // Check if license plate or number already exists
  const existingDriver = await db.query(
    'SELECT id FROM driver_profiles WHERE license_plate = $1 OR license_number = $2',
    [license_plate, license_number]
  );

  if (existingDriver.rows.length > 0) {
    throw new Error('Driver with this license plate or number already exists');
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Hash password
    const password_hash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name, phone, user_type, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, phone, user_type, created_at`,
      [email, password_hash, full_name, phone, 'driver', 'active']
    );

    const user = userResult.rows[0];

    // Create driver profile
    await client.query(
      `INSERT INTO driver_profiles (
        user_id, vehicle_type, license_plate, license_number, license_expiry,
        vehicle_make, vehicle_model, vehicle_year, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        user.id,
        vehicle_type,
        license_plate,
        license_number,
        license_expiry || null,
        vehicle_make || null,
        vehicle_model || null,
        vehicle_year || null,
        'pending',
      ]
    );

    await client.query('COMMIT');

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Store refresh token
    await storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Login user
 */
async function login(email, password) {
  // Find user
  const result = await db.query(
    `SELECT id, email, password_hash, full_name, phone, user_type, status
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  // Check if user is active
  if (user.status !== 'active') {
    throw new Error('Account is not active. Please contact support.');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await db.query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );

  // Remove password hash from response
  delete user.password_hash;

  // Generate tokens
  const tokens = generateTokenPair(user);

  // Store refresh token
  await storeRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    ...tokens,
  };
}

/**
 * Refresh access token
 */
async function refreshAccessToken(refreshToken) {
  const { verifyRefreshToken } = require('../utils/jwt');

  // Verify token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }

  // Check if token exists and is not revoked
  const result = await db.query(
    `SELECT id, user_id, expires_at, revoked
     FROM refresh_tokens
     WHERE token = $1`,
    [refreshToken]
  );

  if (result.rows.length === 0) {
    throw new Error('Refresh token not found');
  }

  const tokenRecord = result.rows[0];

  if (tokenRecord.revoked) {
    throw new Error('Refresh token has been revoked');
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    throw new Error('Refresh token expired');
  }

  // Get user
  const userResult = await db.query(
    `SELECT id, email, full_name, phone, user_type, status
     FROM users
     WHERE id = $1`,
    [decoded.userId]
  );

  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = userResult.rows[0];

  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  // Generate new token pair
  const tokens = generateTokenPair(user);

  // Revoke old refresh token
  await db.query(
    `UPDATE refresh_tokens
     SET revoked = true, revoked_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [tokenRecord.id]
  );

  // Store new refresh token
  await storeRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    ...tokens,
  };
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const result = await db.query(
    `SELECT u.id, u.email, u.full_name, u.phone, u.user_type, u.status,
            u.profile_photo, u.email_verified, u.phone_verified, u.created_at,
            dp.vehicle_type, dp.license_plate, dp.verification_status,
            dp.rating, dp.total_jobs, dp.total_earnings, dp.availability_status
     FROM users u
     LEFT JOIN driver_profiles dp ON u.id = dp.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

/**
 * Store refresh token in database
 */
async function storeRefreshToken(userId, token) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
}

/**
 * Logout user (revoke refresh token)
 */
async function logout(refreshToken) {
  await db.query(
    `UPDATE refresh_tokens
     SET revoked = true, revoked_at = CURRENT_TIMESTAMP
     WHERE token = $1`,
    [refreshToken]
  );

  return true;
}

module.exports = {
  registerClient,
  registerDriver,
  login,
  refreshAccessToken,
  getUserById,
  logout,
};
