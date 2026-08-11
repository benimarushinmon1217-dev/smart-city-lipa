/**
 * Test Admin Users Endpoint
 * Quick script to test what the endpoint returns
 */

require('dotenv').config();
const { User } = require('./models');

const testAdminUsers = async () => {
    try {
        console.log('Testing admin users query...\n');

        // Test the exact query used by adminService.getUsers
        const { count, rows } = await User.findAndCountAll({
            where: {},
            limit: 20,
            offset: 0,
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        console.log('✅ Query successful!');
        console.log(`📊 Total users found: ${count}`);
        console.log(`📄 Users returned: ${rows.length}\n`);

        if (rows.length > 0) {
            console.log('Sample user:');
            const user = rows[0].toJSON();
            console.log(JSON.stringify(user, null, 2));

            console.log('\n📋 All users:');
            rows.forEach(u => {
                console.log(`- ${u.first_name} ${u.last_name} (${u.email}) - Role: ${u.role}`);
            });
        } else {
            console.log('⚠️  No users found in database');
            console.log('\n💡 Run seed script to create users:');
            console.log('   node seedData.js');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

testAdminUsers();
