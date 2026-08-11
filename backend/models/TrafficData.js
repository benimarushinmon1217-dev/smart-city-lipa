/**
 * TrafficData Model
 * Real-time traffic monitoring data
 */

module.exports = (sequelize, DataTypes) => {
    const TrafficData = sequelize.define('TrafficData', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        barangay_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'barangays',
                key: 'id'
            }
        },
        location_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false
        },
        traffic_level: {
            type: DataTypes.ENUM('light', 'moderate', 'heavy', 'standstill'),
            defaultValue: 'light'
        },
        average_speed: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Average speed in km/h'
        },
        vehicle_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        road_condition: {
            type: DataTypes.ENUM('clear', 'wet', 'flooded', 'blocked', 'under_repair'),
            defaultValue: 'clear'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'traffic_data',
        timestamps: true,
        indexes: [
            {
                fields: ['barangay_id']
            },
            {
                fields: ['traffic_level']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    return TrafficData;
};
