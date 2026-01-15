const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  job_id: {
    type: DataTypes.UUID,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  transaction_type: {
    type: DataTypes.ENUM('payment', 'payout', 'refund', 'commission'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(50)
  },
  payment_provider: {
    type: DataTypes.STRING(50)
  },
  provider_transaction_id: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  failure_reason: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'transactions',
  indexes: [
    { fields: ['job_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['transaction_type'] },
    { fields: ['provider_transaction_id'] }
  ]
});

module.exports = Transaction;
