const User = require('./User');
const DriverProfile = require('./DriverProfile');
const Job = require('./Job');

// Define associations
User.hasOne(DriverProfile, { foreignKey: 'user_id', as: 'driverProfile' });
DriverProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Job, { foreignKey: 'client_id', as: 'clientJobs' });
User.hasMany(Job, { foreignKey: 'driver_id', as: 'driverJobs' });

Job.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Job.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

module.exports = {
  User,
  DriverProfile,
  Job
};
