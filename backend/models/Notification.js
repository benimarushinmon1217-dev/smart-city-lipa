/**
 * Notification Model
 * User notifications and alerts
 */

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
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
        type: {
            type: DataTypes.ENUM(
                'incident',
                'report_update',
                'announcement',
                'weather_alert',
                'evacuation_order',
                'system',
                'other'
            ),
            allowNull: false,
            defaultValue: 'system'
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Notification title is required' }
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Notification message is required' }
            }
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            defaultValue: 'medium'
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        read_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        related_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID of related entity (incident, report, etc.)'
        },
        related_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Type of related entity'
        },
        action_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        metadata: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON metadata'
        }
    }, {
        tableName: 'notifications',
        timestamps: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['is_read']
            },
            {
                fields: ['type']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    return Notification;
};
