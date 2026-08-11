/**
 * Report Model
 * User-submitted reports and feedback
 */

module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        barangay_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'barangays',
                key: 'id'
            }
        },
        report_type: {
            type: DataTypes.ENUM(
                'flood',
                'road_damage',
                'street_light',
                'garbage',
                'water_supply',
                'noise_complaint',
                'illegal_activity',
                'other'
            ),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Report type is required' }
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Title is required' },
                len: {
                    args: [5, 255],
                    msg: 'Title must be between 5 and 255 characters'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Description is required' }
            }
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        images: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of image URLs'
        },
        status: {
            type: DataTypes.ENUM('pending', 'verified', 'reviewing', 'in_progress', 'resolved', 'rejected'),
            defaultValue: 'pending',
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            defaultValue: 'medium'
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        resolution_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_anonymous: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    }, {
        tableName: 'reports',
        timestamps: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['barangay_id']
            },
            {
                fields: ['report_type']
            },
            {
                fields: ['status']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    return Report;
};
