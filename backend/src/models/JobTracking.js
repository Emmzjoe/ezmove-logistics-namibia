const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobTracking = sequelize.define('JobTracking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  job_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  accuracy: {
    type: DataTypes.DOUBLE
  },
  heading: {
    type: DataTypes.DOUBLE
  },
  speed: {
    type: DataTypes.DOUBLE
  },
  status: {
    type: DataTypes.STRING(50)
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'job_tracking',
  indexes: [
    { fields: ['job_id'] },
    { fields: ['created_at'] }
  ]
});

module.exports = JobTracking;
