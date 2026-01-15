const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DriverProfile = sequelize.define('DriverProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  vehicle_type: {
    type: DataTypes.ENUM('PICKUP', 'SMALL_TRUCK', 'FLATBED', 'LARGE_TRUCK'),
    allowNull: false
  },
  license_plate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  license_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  license_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  vehicle_registration: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  vehicle_year: {
    type: DataTypes.INTEGER
  },
  vehicle_make: {
    type: DataTypes.STRING(100)
  },
  vehicle_model: {
    type: DataTypes.STRING(100)
  },
  insurance_provider: {
    type: DataTypes.STRING(100)
  },
  insurance_policy: {
    type: DataTypes.STRING(100)
  },
  insurance_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  vehicle_capacity_kg: {
    type: DataTypes.DECIMAL(10, 2)
  },
  vehicle_capacity_m3: {
    type: DataTypes.DECIMAL(10, 2)
  },
  verification_status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  verification_documents: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  verified_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  verified_at: {
    type: DataTypes.DATE
  },
  verification_notes: {
    type: DataTypes.TEXT
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.00
  },
  total_jobs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_earnings: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  current_latitude: {
    type: DataTypes.DOUBLE
  },
  current_longitude: {
    type: DataTypes.DOUBLE
  },
  last_location_update: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'driver_profiles',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['verification_status'] },
    { fields: ['availability'] }
  ]
});

module.exports = DriverProfile;
