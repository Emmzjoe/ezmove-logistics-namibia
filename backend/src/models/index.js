const User = require('./User');
const DriverProfile = require('./DriverProfile');
const Job = require('./Job');
const JobTracking = require('./JobTracking');

// Define associations
User.hasOne(DriverProfile, { foreignKey: 'user_id', as: 'driverProfile' });
DriverProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Job, { foreignKey: 'client_id', as: 'clientJobs' });
User.hasMany(Job, { foreignKey: 'driver_id', as: 'driverJobs' });

Job.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Job.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

Job.hasMany(JobTracking, { foreignKey: 'job_id', as: 'tracking' });
JobTracking.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

module.exports = {
  User,
  DriverProfile,
  Job,
  JobTracking
};
