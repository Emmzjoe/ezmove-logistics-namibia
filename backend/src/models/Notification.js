const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
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
    }
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  delivery_method: {
    type: DataTypes.ENUM('sms', 'email', 'push', 'in_app'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending'
  },
  read_at: {
    type: DataTypes.DATE
  },
  sent_at: {
    type: DataTypes.DATE
  },
  error_message: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'notifications',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['read_at'] }
  ]
});

module.exports = Notification;
