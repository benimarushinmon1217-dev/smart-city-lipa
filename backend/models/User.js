/**
 * User Model
 * Handles user authentication and profile data
 */

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'First name is required' },
                len: {
                    args: [2, 100],
                    msg: 'First name must be between 2 and 100 characters'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Last name is required' },
                len: {
                    args: [2, 100],
                    msg: 'Last name must be between 2 and 100 characters'
                }
            }
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: {
                msg: 'Email already exists'
            },
            validate: {
                isEmail: { msg: 'Please provide a valid email' },
                notEmpty: { msg: 'Email is required' }
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Password is required' },
                len: {
                    args: [6, 255],
                    msg: 'Password must be at least 6 characters'
                }
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                is: {
                    args: /^[0-9+\-\s()]*$/,
                    msg: 'Please provide a valid phone number'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'staff', 'user'),
            defaultValue: 'user',
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        barangay: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verification_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        reset_password_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        reset_password_expire: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        hooks: {
            // Hash password before creating user
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            // Hash password before updating if changed
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    // Instance method to compare password
    User.prototype.comparePassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    // Instance method to get full name
    User.prototype.getFullName = function () {
        return `${this.first_name} ${this.last_name}`;
    };

    return User;
};
