/**
 * Announcement Model
 * System-wide announcements and alerts
 */

module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define('Announcement', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Announcement title is required' }
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Announcement content is required' }
            }
        },
        type: {
            type: DataTypes.ENUM(
                'general',
                'emergency',
                'weather',
                'event',
                'maintenance',
                'advisory'
            ),
            defaultValue: 'general',
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            defaultValue: 'medium'
        },
        target_audience: {
            type: DataTypes.ENUM('all', 'admin', 'staff', 'user', 'specific_barangay'),
            defaultValue: 'all'
        },
        target_barangays: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of barangay IDs'
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_pinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        published_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        views_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'announcements',
        timestamps: true,
        indexes: [
            {
                fields: ['type']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['published_at']
            }
        ]
    });

    return Announcement;
};
