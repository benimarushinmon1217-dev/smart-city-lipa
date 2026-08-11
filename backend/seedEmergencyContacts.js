/**
 * Seed Emergency Contacts
 * Populates database with Lipa City emergency contact information
 */

require('dotenv').config();
const { sequelize, EmergencyContact } = require('./models');

const seedEmergencyContacts = async () => {
    try {
        console.log('🚨 Seeding emergency contacts...');

        // Sync database
        await sequelize.sync();
        console.log('✅ Database synced');

        // Check if contacts already exist
        const contactCount = await EmergencyContact.count();
        if (contactCount > 0) {
            console.log('⚠️  Emergency contacts already exist. Skipping seed.');
            console.log(`   Current count: ${contactCount} contacts`);
            process.exit(0);
        }

        // Create emergency contacts
        const contacts = await EmergencyContact.bulkCreate([
            // Disaster Response
            {
                name: 'Lipa CDRRMO',
                type: 'disaster_response',
                phone_numbers: JSON.stringify(['0915-463-5005', '(043) 756-0127', '(043) 757-5164']),
                email: 'cdrrmo.lipa@gmail.com',
                address: 'Lipa City Hall, Lipa City, Batangas',
                is_24_7: true,
                is_active: true,
                priority: 100
            },

            // Fire Protection
            {
                name: 'Bureau of Fire Protection (BFP)',
                type: 'fire',
                phone_numbers: JSON.stringify(['0927-575-8065', '(043) 757-4618']),
                address: 'Fire Station Road, Lipa City, Batangas',
                is_24_7: true,
                is_active: true,
                priority: 95
            },

            // Police
            {
                name: 'Philippine National Police (PNP)',
                type: 'police',
                phone_numbers: JSON.stringify(['0977-744-9692', '(043) 702-3832']),
                address: 'City Hall Complex, Lipa City, Batangas',
                is_24_7: true,
                is_active: true,
                priority: 95
            },

            // Traffic Management
            {
                name: 'Traffic Management Division (TMD)',
                type: 'government',
                phone_numbers: JSON.stringify(['(043) 702-8454', '(043) 404-9152']),
                address: 'Lipa City Hall, Lipa City, Batangas',
                is_24_7: false,
                operating_hours: '8:00 AM - 5:00 PM (Mon-Fri)',
                is_active: true,
                priority: 70
            },

            // Red Cross
            {
                name: 'Red Cross Lipa',
                type: 'medical',
                phone_numbers: JSON.stringify(['0998-957-0443', '(043) 740-0768']),
                email: 'redcrosslipa@gmail.com',
                address: 'Lipa City, Batangas',
                is_24_7: true,
                is_active: true,
                priority: 90
            },

            // Hospital
            {
                name: 'Lipa District Hospital',
                type: 'medical',
                phone_numbers: JSON.stringify(['(043) 756-1313']),
                address: 'P. Burgos Street, Lipa City, Batangas',
                is_24_7: true,
                is_active: true,
                priority: 90
            },

            // NDRRMC
            {
                name: 'NDRRMC (National)',
                type: 'disaster_response',
                phone_numbers: JSON.stringify(['(02) 8911-5061', '(02) 8911-1406']),
                email: 'ndrrmc@ndrrmc.gov.ph',
                address: 'Camp Aguinaldo, Quezon City',
                is_24_7: true,
                is_active: true,
                priority: 80
            },

            // PHIVOLCS
            {
                name: 'PHIVOLCS',
                type: 'government',
                phone_numbers: JSON.stringify(['(02) 8426-1468', '(02) 8929-9254']),
                email: 'director@phivolcs.dost.gov.ph',
                address: 'PHIVOLCS Building, C.P. Garcia Avenue, U.P. Campus, Diliman, Quezon City',
                is_24_7: true,
                is_active: true,
                priority: 75
            },

            // PAGASA
            {
                name: 'PAGASA',
                type: 'government',
                phone_numbers: JSON.stringify(['(02) 8927-1335', '(02) 8927-2877']),
                email: 'info@pagasa.dost.gov.ph',
                address: 'PAGASA Science Garden Complex, Agham Road, Diliman, Quezon City',
                is_24_7: true,
                is_active: true,
                priority: 75
            },

            // Meralco
            {
                name: 'Meralco Lipa',
                type: 'utility',
                phone_numbers: JSON.stringify(['16211', '(043) 756-2345']),
                address: 'Lipa City, Batangas',
                is_24_7: true,
                is_active: true,
                priority: 60
            },

            // Water District
            {
                name: 'Lipa City Water District',
                type: 'utility',
                phone_numbers: JSON.stringify(['(043) 756-2345', '(043) 757-1234']),
                address: 'Lipa City, Batangas',
                is_24_7: false,
                operating_hours: '8:00 AM - 5:00 PM (Mon-Fri)',
                is_active: true,
                priority: 60
            },

            // City Health Office
            {
                name: 'Lipa City Health Office',
                type: 'medical',
                phone_numbers: JSON.stringify(['(043) 756-4321']),
                address: 'Lipa City Hall, Lipa City, Batangas',
                is_24_7: false,
                operating_hours: '8:00 AM - 5:00 PM (Mon-Fri)',
                is_active: true,
                priority: 70
            },

            // Social Welfare
            {
                name: 'City Social Welfare and Development Office',
                type: 'government',
                phone_numbers: JSON.stringify(['(043) 756-5678']),
                address: 'Lipa City Hall, Lipa City, Batangas',
                is_24_7: false,
                operating_hours: '8:00 AM - 5:00 PM (Mon-Fri)',
                is_active: true,
                priority: 65
            }
        ]);

        console.log(`✅ Created ${contacts.length} emergency contacts`);
        console.log('\n📊 Summary by type:');

        const summary = contacts.reduce((acc, contact) => {
            acc[contact.type] = (acc[contact.type] || 0) + 1;
            return acc;
        }, {});

        Object.entries(summary).forEach(([type, count]) => {
            console.log(`   - ${type}: ${count}`);
        });

        console.log('\n🎉 Emergency contacts seeded successfully!');
        console.log('✅ You can now view them at /emergency/hotlines');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding emergency contacts:', error);
        process.exit(1);
    }
};

// Run seed
seedEmergencyContacts();
