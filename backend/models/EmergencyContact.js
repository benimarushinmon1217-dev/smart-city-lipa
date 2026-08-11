/**
 * EmergencyContact Model
 * Emergency hotlines and contact information
 */

module.exports = (sequelize, DataTypes) => {
    const EmergencyContact = sequelize.define('EmergencyContact', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Contact name is required' }
            }
        },
        type: {
            type: DataTypes.ENUM(
                'police',
                'fire',
                'medical',
                'disaster_response',
                'government',
                'utility',
                'other'
            ),
            allowNull: false
        },
        phone_numbers: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'JSON array of phone numbers'
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_24_7: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        operating_hours: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Display priority (higher = shown first)'
        }
    }, {
        tableName: 'emergency_contacts',
        timestamps: true,
        indexes: [
            {
                fields: ['type']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['priority']
            }
        ]
    });

    return EmergencyContact;
};
