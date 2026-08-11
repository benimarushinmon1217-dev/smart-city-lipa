/**
 * Seed Data Script
 * Populates database with sample data for testing
 */

require('dotenv').config();
const { sequelize, Incident, Report, Barangay, User, Notification, TrafficData, Establishment } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Sync database
        await sequelize.sync();
        console.log('✅ Database synced');

        // Check if data already exists
        const incidentCount = await Incident.count();
        if (incidentCount > 0) {
            console.log('⚠️  Database already has incident data. Skipping seed.');
            console.log('   To re-seed, delete existing data first.');
            process.exit(0);
        }

        // Create sample barangays
        console.log('Creating barangays...');
        const barangays = await Barangay.bulkCreate([
            { name: 'Barangay 1 (Poblacion)', population: 5000 },
            { name: 'Barangay 2 (Poblacion)', population: 4500 },
            { name: 'Barangay 3 (Poblacion)', population: 4200 },
            { name: 'Barangay 4 (Poblacion)', population: 3800 },
            { name: 'Antipolo del Norte', population: 6200 },
            { name: 'Antipolo del Sur', population: 5800 },
            { name: 'Bagong Pook', population: 4100 },
            { name: 'Balintawak', population: 7500 },
            { name: 'Banaybanay', population: 3200 },
            { name: 'Bolbok', population: 8900 },
        ]);
        console.log(`✅ Created ${barangays.length} barangays`);

        // Get existing user (the one you logged in with)
        const existingUser = await User.findOne({ where: { email: 'ramoelnylbriones0909@gmail.com' } });

        // Create sample incidents
        console.log('Creating incidents...');
        const incidents = await Incident.bulkCreate([
            {
                incident_type: 'flood',
                title: 'Flash Flood in Barangay 1',
                description: 'Heavy rainfall caused flash flooding in low-lying areas. Water level reached knee-high in some streets.',
                severity: 'high',
                status: 'verified',
                barangay_id: barangays[0].id,
                latitude: 13.9411,
                longitude: 121.1633,
                address: 'Main Street, Barangay 1',
                reported_by: existingUser.id,
                reporter_name: 'Juan Dela Cruz',
                reporter_contact: '09171234567',
                affected_families: 25,
                affected_individuals: 100,
                is_verified: true,
                verified_by: existingUser.id,
                verified_at: new Date(),
                images: JSON.stringify([])
            },
            {
                incident_type: 'fire',
                title: 'House Fire in Antipolo del Norte',
                description: 'Residential fire reported. Fire department responded immediately.',
                severity: 'critical',
                status: 'responding',
                barangay_id: barangays[4].id,
                latitude: 13.9425,
                longitude: 121.1645,
                address: 'Rizal Street, Antipolo del Norte',
                reported_by: existingUser.id,
                reporter_name: 'Maria Santos',
                reporter_contact: '09181234567',
                affected_families: 3,
                affected_individuals: 12,
                casualties: 0,
                is_verified: true,
                verified_by: existingUser.id,
                verified_at: new Date(),
                images: JSON.stringify([])
            },
            {
                incident_type: 'landslide',
                title: 'Minor Landslide in Bolbok',
                description: 'Small landslide blocked part of the road. Clearing operations ongoing.',
                severity: 'medium',
                status: 'reported',
                barangay_id: barangays[9].id,
                latitude: 13.9380,
                longitude: 121.1620,
                address: 'Mountain Road, Bolbok',
                reported_by: existingUser.id,
                reporter_name: 'Pedro Reyes',
                reporter_contact: '09191234567',
                affected_families: 0,
                affected_individuals: 0,
                is_verified: false,
                images: JSON.stringify([])
            },
            {
                incident_type: 'traffic_accident',
                title: 'Vehicle Collision in Balintawak',
                description: 'Two-vehicle collision at intersection. Minor injuries reported.',
                severity: 'low',
                status: 'resolved',
                barangay_id: barangays[7].id,
                latitude: 13.9400,
                longitude: 121.1650,
                address: 'Highway, Balintawak',
                reported_by: existingUser.id,
                reporter_name: 'Ana Garcia',
                reporter_contact: '09201234567',
                affected_families: 2,
                affected_individuals: 4,
                casualties: 0,
                is_verified: true,
                verified_by: existingUser.id,
                verified_at: new Date(),
                resolution_time: new Date(),
                resolution_notes: 'Vehicles cleared, traffic restored',
                images: JSON.stringify([])
            },
            {
                incident_type: 'medical_emergency',
                title: 'Medical Emergency in Barangay 2',
                description: 'Elderly person requiring immediate medical attention.',
                severity: 'high',
                status: 'resolved',
                barangay_id: barangays[1].id,
                latitude: 13.9415,
                longitude: 121.1638,
                address: 'Community Center, Barangay 2',
                reported_by: existingUser.id,
                reporter_name: 'Rosa Martinez',
                reporter_contact: '09211234567',
                affected_families: 1,
                affected_individuals: 1,
                is_verified: true,
                verified_by: existingUser.id,
                verified_at: new Date(),
                resolution_time: new Date(),
                resolution_notes: 'Patient transported to hospital',
                images: JSON.stringify([])
            }
        ]);
        console.log(`✅ Created ${incidents.length} incidents`);

        // Create sample reports
        console.log('Creating reports...');
        const reports = await Report.bulkCreate([
            {
                report_type: 'hazard',
                title: 'Broken Street Light',
                description: 'Street light not working for 3 days, creating safety hazard at night.',
                status: 'pending',
                priority: 'medium',
                barangay_id: barangays[2].id,
                location: 'Corner of Main St and 2nd Ave',
                user_id: existingUser.id,
                is_anonymous: false,
                images: JSON.stringify([])
            },
            {
                report_type: 'infrastructure',
                title: 'Pothole on Main Road',
                description: 'Large pothole causing traffic issues and potential vehicle damage.',
                status: 'in_progress',
                priority: 'high',
                barangay_id: barangays[5].id,
                location: 'Main Road near Public Market',
                user_id: existingUser.id,
                is_anonymous: false,
                assigned_to: existingUser.id,
                images: JSON.stringify([])
            },
            {
                report_type: 'environmental',
                title: 'Illegal Dumping Site',
                description: 'Garbage being dumped in vacant lot, creating health hazard.',
                status: 'pending',
                priority: 'high',
                barangay_id: barangays[6].id,
                location: 'Vacant lot near school',
                user_id: existingUser.id,
                is_anonymous: true,
                images: JSON.stringify([])
            },
            {
                report_type: 'public_safety',
                title: 'Stray Dogs in Residential Area',
                description: 'Pack of stray dogs roaming the area, residents concerned for safety.',
                status: 'resolved',
                priority: 'medium',
                barangay_id: barangays[8].id,
                location: 'Residential Area, Zone 3',
                user_id: existingUser.id,
                is_anonymous: false,
                resolution_notes: 'Animal control responded, dogs captured and relocated',
                resolved_at: new Date(),
                images: JSON.stringify([])
            }
        ]);
        console.log(`✅ Created ${reports.length} reports`);

        // Create sample notifications
        console.log('Creating notifications...');
        const notifications = await Notification.bulkCreate([
            {
                user_id: existingUser.id,
                type: 'incident',
                title: 'New Incident Reported',
                message: 'A flood incident has been reported in your area',
                priority: 'high',
                is_read: false,
                related_type: 'incident',
                related_id: incidents[0].id
            },
            {
                user_id: existingUser.id,
                type: 'report',
                title: 'Report Status Updated',
                message: 'Your pothole report is now being processed',
                priority: 'medium',
                is_read: false,
                related_type: 'report',
                related_id: reports[1].id
            },
            {
                user_id: existingUser.id,
                type: 'system',
                title: 'Welcome to Smart City Lipa',
                message: 'Thank you for using our platform to help keep Lipa City safe!',
                priority: 'low',
                is_read: true,
                read_at: new Date()
            }
        ]);
        console.log(`✅ Created ${notifications.length} notifications`);

        // Create sample traffic data
        console.log('Creating traffic data...');
        const trafficData = await TrafficData.bulkCreate([
            {
                barangay_id: barangays[0].id,
                location_name: 'Main Highway - North',
                latitude: 13.9411,
                longitude: 121.1633,
                traffic_level: 'moderate',
                average_speed: 35,
                vehicle_count: 150,
                road_condition: 'good',
                is_active: true
            },
            {
                barangay_id: barangays[4].id,
                location_name: 'City Center Intersection',
                latitude: 13.9425,
                longitude: 121.1645,
                traffic_level: 'heavy',
                average_speed: 15,
                vehicle_count: 300,
                road_condition: 'fair',
                is_active: true
            },
            {
                barangay_id: barangays[7].id,
                location_name: 'Balintawak Junction',
                latitude: 13.9400,
                longitude: 121.1650,
                traffic_level: 'light',
                average_speed: 50,
                vehicle_count: 50,
                road_condition: 'good',
                is_active: true
            }
        ]);
        console.log(`✅ Created ${trafficData.length} traffic data points`);

        // Create sample establishments (evacuation centers and facilities)
        console.log('Creating establishments...');
        const establishments = await Establishment.bulkCreate([
            {
                name: 'Barangay 1 Evacuation Center',
                type: 'evacuation',
                barangay_id: barangays[0].id,
                address: 'Barangay Hall, Barangay 1',
                latitude: 13.9411,
                longitude: 121.1633,
                contact_number: '043-123-4567',
                capacity: 200,
                current_occupancy: 0,
                facilities: JSON.stringify(['Restrooms', 'Kitchen', 'Medical Station']),
                is_operational: true,
                is_active: true,
                description: 'Primary evacuation center for Barangay 1 residents'
            },
            {
                name: 'Lipa City Sports Complex',
                type: 'evacuation',
                barangay_id: barangays[4].id,
                address: 'Sports Complex Road, Antipolo del Norte',
                latitude: 13.9425,
                longitude: 121.1645,
                contact_number: '043-123-4568',
                capacity: 500,
                current_occupancy: 0,
                facilities: JSON.stringify(['Restrooms', 'Showers', 'Kitchen', 'Medical Station', 'Security']),
                is_operational: true,
                is_active: true,
                description: 'Large capacity evacuation center with full facilities'
            },
            {
                name: 'Bolbok Elementary School Evacuation Center',
                type: 'evacuation',
                barangay_id: barangays[9].id,
                address: 'School Road, Bolbok',
                latitude: 13.9380,
                longitude: 121.1620,
                contact_number: '043-123-4569',
                capacity: 300,
                current_occupancy: 0,
                facilities: JSON.stringify(['Restrooms', 'Classrooms', 'Playground']),
                is_operational: true,
                is_active: true,
                description: 'School-based evacuation center for Bolbok area'
            },
            {
                name: 'Lipa City Medical Center',
                type: 'hospital',
                barangay_id: barangays[0].id,
                address: 'P. Burgos Street, Poblacion',
                latitude: 13.9408,
                longitude: 121.1628,
                contact_number: '043-756-1234',
                email: 'info@lipacitymedical.ph',
                operating_hours: '24/7',
                is_operational: true,
                is_active: true,
                description: 'Main hospital facility with emergency services'
            },
            {
                name: 'Lipa City Police Station',
                type: 'police',
                barangay_id: barangays[0].id,
                address: 'City Hall Complex, Poblacion',
                latitude: 13.9415,
                longitude: 121.1635,
                contact_number: '043-756-5555',
                operating_hours: '24/7',
                is_operational: true,
                is_active: true,
                description: 'Main police station for emergency response'
            },
            {
                name: 'Lipa City Fire Station',
                type: 'fire_station',
                barangay_id: barangays[0].id,
                address: 'Fire Station Road, Poblacion',
                latitude: 13.9418,
                longitude: 121.1640,
                contact_number: '043-756-2222',
                operating_hours: '24/7',
                is_operational: true,
                is_active: true,
                description: 'Main fire station for fire and rescue operations'
            }
        ]);
        console.log(`✅ Created ${establishments.length} establishments`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Barangays: ${barangays.length}`);
        console.log(`   - Incidents: ${incidents.length}`);
        console.log(`   - Reports: ${reports.length}`);
        console.log(`   - Notifications: ${notifications.length}`);
        console.log(`   - Traffic Data: ${trafficData.length}`);
        console.log(`   - Establishments: ${establishments.length}`);
        console.log('\n✅ Refresh your browser to see the data!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedData();
