/**
 * Barangay Model
 * Stores barangay information and risk data
 */

module.exports = (sequelize, DataTypes) => {
    const Barangay = sequelize.define('Barangay', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {
                msg: 'Barangay name already exists'
            },
            validate: {
                notEmpty: { msg: 'Barangay name is required' }
            }
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },
        // Geographic data
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
            validate: {
                min: -90,
                max: 90
            }
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
            validate: {
                min: -180,
                max: 180
            }
        },
        geojson: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            comment: 'GeoJSON polygon data for barangay boundary'
        },
        // Risk assessment data
        flood_risk_level: {
            type: DataTypes.ENUM('Low', 'Medium', 'High', 'Very High'),
            defaultValue: 'Low'
        },
        flood_risk_score: {
            type: DataTypes.DECIMAL(10, 4),
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        ashfall_risk_level: {
            type: DataTypes.ENUM('Low', 'Moderate', 'High', 'Very High'),
            defaultValue: 'Low'
        },
        ashfall_risk_score: {
            type: DataTypes.DECIMAL(10, 4),
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        // Geographic metrics
        mean_elevation: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Mean elevation in meters'
        },
        distance_to_water: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Distance to nearest water body in km'
        },
        distance_to_taal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Distance to Taal Volcano in km'
        },
        area_sqkm: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: true,
            comment: 'Area in square kilometers'
        },
        // Demographics
        population: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0
            }
        },
        households: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0
            }
        },
        // Contact information
        barangay_captain: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        // Status
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'barangays',
        timestamps: true,
        indexes: [
            {
                fields: ['name']
            },
            {
                fields: ['flood_risk_level']
            },
            {
                fields: ['ashfall_risk_level']
            }
        ]
    });

    return Barangay;
};
