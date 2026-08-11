/**
 * Database Wipe Script
 * Safely clears all data from the database while keeping the structure
 * 
 * WARNING: This will delete ALL data! Use with caution!
 */

require('dotenv').config();
const { sequelize } = require('./models');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const wipeDatabase = async () => {
    try {
        console.log('\n🚨 ============================================');
        console.log('🚨  DATABASE WIPE SCRIPT');
        console.log('🚨 ============================================\n');
        console.log('⚠️  WARNING: This will DELETE ALL DATA from the database!');
        console.log('⚠️  This action CANNOT be undone!\n');
        console.log('📋 What will be deleted:');
        console.log('   - All users (except you can keep one admin)');
        console.log('   - All incidents');
        console.log('   - All reports');
        console.log('   - All notifications');
        console.log('   - All traffic data');
        console.log('   - All announcements\n');
        console.log('✅ What will be KEPT:');
        console.log('   - Barangays (with GeoJSON data)');
        console.log('   - Establishments (evacuation centers, hospitals, etc.)');
        console.log('   - Emergency Contacts (hotlines, emergency numbers)');
        console.log('   - Database structure\n');

        // Ask for confirmation
        rl.question('❓ Are you ABSOLUTELY SURE you want to continue? (type "YES" to confirm): ', async (answer) => {
            if (answer !== 'YES') {
                console.log('\n✅ Wipe cancelled. No data was deleted.');
                rl.close();
                process.exit(0);
            }

            console.log('\n🗑️  Starting database wipe...\n');

            try {
                // Disable foreign key checks temporarily
                await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

                // Get all table names (excluding barangays, establishments, and emergency_contacts - they're critical infrastructure)
                const tables = [
                    'notifications',
                    'traffic_data',
                    'reports',
                    'incidents',
                    'announcements'
                ];

                // Delete data from each table
                for (const table of tables) {
                    try {
                        const result = await sequelize.query(`DELETE FROM ${table}`);
                        console.log(`✅ Cleared table: ${table}`);
                    } catch (error) {
                        console.log(`⚠️  Table ${table} might not exist or is already empty`);
                    }
                }

                // Ask if user wants to keep their account
                rl.question('\n❓ Do you want to keep your admin account? (Y/N): ', async (keepAccount) => {
                    if (keepAccount.toUpperCase() === 'N') {
                        // Delete all users
                        await sequelize.query('DELETE FROM users');
                        console.log('✅ Cleared table: users (all users deleted)');
                    } else {
                        // Keep only one user and make them admin
                        rl.question('📧 Enter the email of the account to keep: ', async (email) => {
                            try {
                                // Update the user to admin
                                await sequelize.query(
                                    `UPDATE users SET role = 'admin' WHERE email = ?`,
                                    { replacements: [email] }
                                );

                                // Delete all other users
                                await sequelize.query(
                                    `DELETE FROM users WHERE email != ?`,
                                    { replacements: [email] }
                                );

                                console.log(`✅ Kept user: ${email} (set as admin)`);
                                console.log('✅ Deleted all other users');
                            } catch (error) {
                                console.log('⚠️  Error keeping user:', error.message);
                            }

                            // Re-enable foreign key checks
                            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

                            console.log('\n🎉 ============================================');
                            console.log('🎉  DATABASE WIPE COMPLETED!');
                            console.log('🎉 ============================================\n');
                            console.log('✅ All test data has been removed');
                            console.log('✅ Database structure is intact');
                            console.log('✅ Ready for fresh data\n');
                            console.log('💡 Next steps:');
                            console.log('   1. Restart your backend: npm run dev');
                            console.log('   2. Optionally run seed: npm run seed');
                            console.log('   3. Refresh your browser\n');

                            rl.close();
                            process.exit(0);
                        });
                    }
                });

            } catch (error) {
                console.error('\n❌ Error during wipe:', error);
                await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
                rl.close();
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ Error connecting to database:', error);
        rl.close();
        process.exit(1);
    }
};

// Run wipe
wipeDatabase();
