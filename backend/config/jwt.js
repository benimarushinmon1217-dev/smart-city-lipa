/**
 * JWT Configuration
 * Token generation and verification settings
 */

require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',

    // Token options
    options: {
        issuer: 'smart-city-lipa',
        audience: 'smart-city-lipa-users'
    }
};
