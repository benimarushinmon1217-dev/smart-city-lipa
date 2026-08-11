/**
 * Update Report Status ENUM
 * Adds 'verified' to the status enum values
 */

const { sequelize } = require('./config/database');

async function updateReportStatusEnum() {
    try {
        console.log('🔄 Updating Report status ENUM...');

        // For MySQL, we need to alter the ENUM type
        await sequelize.query(`
            ALTER TABLE reports 
            MODIFY COLUMN status ENUM('pending', 'verified', 'reviewing', 'in_progress', 'resolved', 'rejected') 
            DEFAULT 'pending' 
            NOT NULL;
        `);

        console.log('✅ Report status ENUM updated successfully!');
        console.log('   Added: verified');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating Report status ENUM:', error);
        process.exit(1);
    }
}

updateReportStatusEnum();
