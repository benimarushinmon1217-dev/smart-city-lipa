/**
 * Authentication Service
 * Business logic for authentication operations
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

class AuthService {
    /**
     * Generate JWT token
     */
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn,
                issuer: jwtConfig.options.issuer,
                audience: jwtConfig.options.audience
            }
        );
    }

    /**
     * Generate refresh token
     */
    generateRefreshToken(userId) {
        return jwt.sign(
            { id: userId, type: 'refresh' },
            jwtConfig.refreshSecret,
            {
                expiresIn: jwtConfig.refreshExpiresIn,
                issuer: jwtConfig.options.issuer,
                audience: jwtConfig.options.audience
            }
        );
    }

    /**
     * Register new user
     */
    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                // Generic error message for security - don't reveal if email exists
                const error = new Error('Registration error. Please check your information and try again.');
                error.statusCode = 400; // Bad Request (generic)
                throw error;
            }

            // Create user
            const user = await User.create(userData);

            // Generate tokens
            const token = this.generateToken(user.id);
            const refreshToken = this.generateRefreshToken(user.id);

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            logger.info(`New user registered: ${user.email}`);

            return {
                user: userResponse,
                token,
                refreshToken
            };
        } catch (error) {
            logger.error('Registration error:', error);
            // If it's our custom error, throw it as is
            if (error.statusCode) {
                throw error;
            }
            // For any other error, return generic message
            const genericError = new Error('Registration error. Please check your information and try again.');
            genericError.statusCode = 400;
            throw genericError;
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            // Find user
            const user = await User.findOne({ where: { email } });

            // Generic error message for security - don't reveal if user exists or password is wrong
            if (!user) {
                const error = new Error('Login error. Please check your credentials and try again.');
                error.statusCode = 401; // Unauthorized
                throw error;
            }

            // Check if account is active
            if (!user.is_active) {
                // Generic error message - don't reveal account status
                const error = new Error('Login error. Please check your credentials and try again.');
                error.statusCode = 401; // Unauthorized
                throw error;
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                // Generic error message - don't reveal if password is wrong
                const error = new Error('Login error. Please check your credentials and try again.');
                error.statusCode = 401; // Unauthorized
                throw error;
            }

            // Update last login
            await user.update({ last_login: new Date() });

            // Generate tokens
            const token = this.generateToken(user.id);
            const refreshToken = this.generateRefreshToken(user.id);

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            logger.info(`User logged in: ${user.email}`);

            return {
                user: userResponse,
                token,
                refreshToken
            };
        } catch (error) {
            logger.error('Login error:', error);
            // If it's our custom error, throw it as is
            if (error.statusCode) {
                throw error;
            }
            // For any other error, return generic message
            const genericError = new Error('Login error. Please check your credentials and try again.');
            genericError.statusCode = 401;
            throw genericError;
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }

            // Get user
            const user = await User.findByPk(decoded.id);

            if (!user || !user.is_active) {
                throw new Error('User not found or inactive');
            }

            // Generate new tokens
            const newToken = this.generateToken(user.id);
            const newRefreshToken = this.generateRefreshToken(user.id);

            return {
                token: newToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            logger.error('Token refresh error:', error);
            throw error;
        }
    }

    /**
     * Get user profile
     */
    async getProfile(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            logger.error('Get profile error:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, updateData) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Don't allow updating sensitive fields
            delete updateData.password;
            delete updateData.role;
            delete updateData.email;

            await user.update(updateData);

            const updatedUser = user.toJSON();
            delete updatedUser.password;

            logger.info(`User profile updated: ${user.email}`);

            return updatedUser;
        } catch (error) {
            logger.error('Update profile error:', error);
            throw error;
        }
    }

    /**
     * Change password
     */
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password
            const isPasswordValid = await user.comparePassword(currentPassword);

            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            await user.update({ password: newPassword });

            logger.info(`Password changed for user: ${user.email}`);

            return true;
        } catch (error) {
            logger.error('Change password error:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();
