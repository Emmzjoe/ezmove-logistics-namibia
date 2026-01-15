const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  job_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  driver_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Pickup details
  pickup_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pickup_latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  pickup_longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  pickup_contact_name: {
    type: DataTypes.STRING
  },
  pickup_contact_phone: {
    type: DataTypes.STRING(20)
  },
  
  // Delivery details
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  delivery_latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  delivery_longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  delivery_contact_name: {
    type: DataTypes.STRING
  },
  delivery_contact_phone: {
    type: DataTypes.STRING(20)
  },
  
  // Job details
  distance_km: {
    type: DataTypes.DECIMAL(10, 2)
  },
  estimated_duration_minutes: {
    type: DataTypes.INTEGER
  },
  vehicle_type: {
    type: DataTypes.ENUM('PICKUP', 'SMALL_TRUCK', 'FLATBED', 'LARGE_TRUCK'),
    allowNull: false
  },
  load_type: {
    type: DataTypes.STRING(100)
  },
  weight_kg: {
    type: DataTypes.DECIMAL(10, 2)
  },
  volume_m3: {
    type: DataTypes.DECIMAL(10, 2)
  },
  value_nad: {
    type: DataTypes.DECIMAL(12, 2)
  },
  special_instructions: {
    type: DataTypes.TEXT
  },
  
  // Pricing
  base_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  distance_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  time_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  driver_earnings: {
    type: DataTypes.DECIMAL(10, 2)
  },
  platform_commission: {
    type: DataTypes.DECIMAL(10, 2)
  },
  
  // Status tracking
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  accepted_at: {
    type: DataTypes.DATE
  },
  started_at: {
    type: DataTypes.DATE
  },
  completed_at: {
    type: DataTypes.DATE
  },
  cancelled_at: {
    type: DataTypes.DATE
  },
  cancellation_reason: {
    type: DataTypes.TEXT
  },
  
  // Payment
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.STRING(50)
  },
  payment_reference: {
    type: DataTypes.STRING(100)
  },
  paid_at: {
    type: DataTypes.DATE
  },
  
  // Ratings
  client_rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  driver_rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  client_review: {
    type: DataTypes.TEXT
  },
  driver_review: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'jobs',
  indexes: [
    { fields: ['client_id'] },
    { fields: ['driver_id'] },
    { fields: ['status'] },
    { fields: ['job_number'] }
  ]
});

// Generate job number
Job.generateJobNumber = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `JOB${timestamp}${random}`;
};

module.exports = Job;
