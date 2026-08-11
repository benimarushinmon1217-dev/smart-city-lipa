/**
 * Models Index
 * Central export for all Sequelize models and relationships
 */

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User')(sequelize, DataTypes);
const Barangay = require('./Barangay')(sequelize, DataTypes);
const Incident = require('./Incident')(sequelize, DataTypes);
const Report = require('./Report')(sequelize, DataTypes);
const Establishment = require('./Establishment')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const Announcement = require('./Announcement')(sequelize, DataTypes);
const TrafficData = require('./TrafficData')(sequelize, DataTypes);
const EmergencyContact = require('./EmergencyContact')(sequelize, DataTypes);

// Define relationships
const defineAssociations = () => {
    // User relationships
    User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
    User.hasMany(Incident, { foreignKey: 'reported_by', as: 'incidents' });
    User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
    User.hasMany(Announcement, { foreignKey: 'created_by', as: 'announcements' });

    // Barangay relationships
    Barangay.hasMany(Incident, { foreignKey: 'barangay_id', as: 'incidents' });
    Barangay.hasMany(Report, { foreignKey: 'barangay_id', as: 'reports' });
    Barangay.hasMany(Establishment, { foreignKey: 'barangay_id', as: 'establishments' });
    Barangay.hasMany(TrafficData, { foreignKey: 'barangay_id', as: 'trafficData' });

    // Report relationships
    Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    Report.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
    Report.belongsTo(Barangay, { foreignKey: 'barangay_id', as: 'barangay' });

    // Incident relationships
    Incident.belongsTo(User, { foreignKey: 'reported_by', as: 'reporter' });
    Incident.belongsTo(User, { foreignKey: 'verified_by', as: 'verifier' });
    Incident.belongsTo(Barangay, { foreignKey: 'barangay_id', as: 'barangay' });

    // Establishment relationships
    Establishment.belongsTo(Barangay, { foreignKey: 'barangay_id', as: 'barangay' });

    // Notification relationships
    Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    // Announcement relationships
    Announcement.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

    // TrafficData relationships
    TrafficData.belongsTo(Barangay, { foreignKey: 'barangay_id', as: 'barangay' });
};

// Execute associations
defineAssociations();

// Export models and sequelize instance
module.exports = {
    sequelize,
    User,
    Barangay,
    Incident,
    Report,
    Establishment,
    Notification,
    Announcement,
    TrafficData,
    EmergencyContact
};
