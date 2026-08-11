/**
 * Test Admin Incidents Endpoint
 * Quick script to test what the endpoint returns
 */

require('dotenv').config();
const { Incident, User, Barangay } = require('./models');

const testAdminIncidents = async () => {
    try {
        console.log('Testing admin incidents query...\n');

        // Test the exact query used by adminService.getIncidents
        const { count, rows } = await Incident.findAndCountAll({
            where: {},
            limit: 20,
            offset: 0,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, as: 'reporter', attributes: ['id', 'first_name', 'last_name', 'email'] },
                { model: Barangay, as: 'barangay', attributes: ['id', 'name'] }
            ]
        });

        console.log('✅ Query successful!');
        console.log(`📊 Total incidents found: ${count}`);
        console.log(`📄 Incidents returned: ${rows.length}\n`);

        if (rows.length > 0) {
            console.log('Sample incident:');
            const incident = rows[0].toJSON();
            console.log(JSON.stringify(incident, null, 2));
        } else {
            console.log('⚠️  No incidents found in database');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

testAdminIncidents();
