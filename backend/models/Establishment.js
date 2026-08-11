/**
 * Establishment Model
 * Facilities, evacuation centers, hospitals, schools, etc.
 */

module.exports = (sequelize, DataTypes) => {
    const Establishment = sequelize.define('Establishment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Establishment name is required' }
            }
        },
        type: {
            type: DataTypes.ENUM(
                'evacuation',
                'hospital',
                'clinic',
                'school',
                'church',
                'government',
                'police',
                'fire_station',
                'barangay_hall',
                'other'
            ),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Establishment type is required' }
            }
        },
        barangay_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'barangays',
                key: 'id'
            }
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Latitude is required' },
                min: -90,
                max: 90
            }
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Longitude is required' },
                min: -180,
                max: 180
            }
        },
        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isEmail: { msg: 'Please provide a valid email' }
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Capacity for evacuation centers'
        },
        current_occupancy: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Current occupancy for evacuation centers'
        },
        facilities: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of available facilities'
        },
        operating_hours: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        is_operational: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        website: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'establishments',
        timestamps: true,
        indexes: [
            {
                fields: ['type']
            },
            {
                fields: ['barangay_id']
            },
            {
                fields: ['is_operational']
            }
        ]
    });

    return Establishment;
};
