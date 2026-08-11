/**
 * Incident Model
 * Tracks disaster incidents and emergencies
 */

module.exports = (sequelize, DataTypes) => {
    const Incident = sequelize.define('Incident', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        incident_type: {
            type: DataTypes.ENUM(
                'flood',
                'fire',
                'earthquake',
                'landslide',
                'typhoon',
                'volcanic_activity',
                'traffic_accident',
                'medical_emergency',
                'other'
            ),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Incident type is required' }
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
        severity: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            defaultValue: 'medium',
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('reported', 'verified', 'responding', 'resolved', 'closed'),
            defaultValue: 'reported',
            allowNull: false
        },
        // Location data
        barangay_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'barangays',
                key: 'id'
            }
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Reporter information
        reported_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        reporter_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        reporter_contact: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        // Media
        images: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of image URLs'
        },
        // Response data
        responders: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of responder IDs'
        },
        response_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resolution_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resolution_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Impact assessment
        affected_families: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        affected_individuals: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        casualties: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        estimated_damage: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
            comment: 'Estimated damage in PHP'
        },
        // Verification
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verified_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // Additional notes
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'incidents',
        timestamps: true,
        indexes: [
            {
                fields: ['incident_type']
            },
            {
                fields: ['status']
            },
            {
                fields: ['severity']
            },
            {
                fields: ['barangay_id']
            },
            {
                fields: ['reported_by']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    return Incident;
};
