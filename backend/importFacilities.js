/**
 * Import All Facilities from layers.js Data
 * Comprehensive facility import for Lipa City
 */

const db = require('./models');
const { Establishment, Barangay } = db;

// All facilities data from layers.js
const facilitiesData = [
    // 🏫 SCHOOLS
    { name: "Lipa City Science High School", lat: 13.9424405, lng: 121.1569543, type: "school", address: "Lipa City" },
    { name: "Mabini College", lat: 13.9475772, lng: 121.1613498, type: "school", address: "Lipa City" },
    { name: "Inosluban Elementary School", lat: 13.9756996, lng: 121.1675839, type: "school", address: "Inosluban" },
    { name: "Fernando Air Base Elementary School", lat: 13.9533632, lng: 121.1335259, type: "school", address: "Fernando Air Base" },
    { name: "Marawoy Elementary School", lat: 13.9583256, lng: 121.1655746, type: "school", address: "Marawoy" },
    { name: "Lodlod Elementary School", lat: 13.9296396, lng: 121.1425794, type: "school", address: "Lodlod" },
    { name: "Tambo Elementary School", lat: 13.9438250, lng: 121.1346910, type: "school", address: "Tambo" },
    { name: "Pinagtongulan Elementary School", lat: 13.919209, lng: 121.082847, type: "school", address: "Pinagtongulan" },
    { name: "San Jose Integrated School", lat: 13.9402977, lng: 121.1852510, type: "school", address: "San Jose" },
    { name: "Bulacnin National High School", lat: 13.9814424, lng: 121.1418944, type: "school", address: "Bulacnin" },
    { name: "Banaybanay Elementary School", lat: 13.9358800, lng: 121.1185109, type: "school", address: "Banaybanay" },
    { name: "San Carlos Elementary School", lat: 13.9488013, lng: 121.1518464, type: "school", address: "San Carlos" },
    { name: "Tangway Elementary School", lat: 13.9762596, lng: 121.1386640, type: "school", address: "Tangway" },

    // ⛪ CHURCHES
    { name: "San Sebastian Cathedral", lat: 13.9409697, lng: 121.1634241, type: "church", address: "Poblacion, Lipa City" },
    { name: "Divina Pastora Parish", lat: 13.9403195, lng: 121.1381551, type: "church", address: "Lipa City" },
    { name: "Mary Mediatrix Parish", lat: 13.9256822, lng: 121.1718097, type: "church", address: "Lipa City" },

    // 🏛️ GOVERNMENT
    { name: "Lipa City Youth Center", lat: 13.9413325, lng: 121.1574435, type: "government", address: "Lipa City" },

    // 🏠 EVACUATION CENTERS
    { name: "Lipa City Gymnasium", lat: 13.9357779, lng: 121.1612630, type: "evacuation", address: "Lipa City", capacity: 1000 },
    { name: "Bagong Pook Covered Court", lat: 13.9561390, lng: 121.1054234, type: "evacuation", address: "Bagong Pook", capacity: 300 },
    { name: "Tambo Covered Court", lat: 13.9385435, lng: 121.1376377, type: "evacuation", address: "Tambo", capacity: 250 },
    { name: "Banaybanay Covered Court", lat: 13.9381715, lng: 121.1185783, type: "evacuation", address: "Banaybanay", capacity: 250 },

    // 🏥 HOSPITALS
    { name: "Lipa City District Hospital", lat: 13.9337340, lng: 121.1585559, type: "hospital", address: "Lipa City" },
    { name: "Mary Mediatrix Medical Center", lat: 13.9439363, lng: 121.1522819, type: "hospital", address: "Lipa City" },
    { name: "Metro Lipa Medical Center", lat: 13.9683134, lng: 121.1664929, type: "hospital", address: "Lipa City" },
    { name: "San Antonio Medical Center", lat: 13.9421942, lng: 121.1650442, type: "hospital", address: "Lipa City" },
    { name: "Lipa Medix Medical Center", lat: 13.9476904, lng: 121.1569536, type: "hospital", address: "Lipa City" },
    { name: "Ospital ng Lipa", lat: 13.9569427, lng: 121.1623754, type: "hospital", address: "Lipa City" },

    // 🏥 HEALTH CENTERS / CLINICS
    { name: "Lipa Main Health Center", lat: 13.9405076, lng: 121.1594618, type: "clinic", address: "Lipa City" },
    { name: "Brgy. Sabang Health Center", lat: 13.9463804, lng: 121.1677160, type: "clinic", address: "Sabang" },
    { name: "North District Health Center", lat: 13.9789505, lng: 121.1679306, type: "clinic", address: "North District" },
    { name: "South District Health Center", lat: 13.9234905, lng: 121.1491394, type: "clinic", address: "South District" },
    { name: "Brgy. Anilao Health Center", lat: 13.9049053, lng: 121.1731254, type: "clinic", address: "Anilao" },
    { name: "Brgy. Bolbok Health Center", lat: 13.9229320, lng: 121.1484712, type: "clinic", address: "Bolbok" }
];

/**
 * Find nearest barangay for a facility
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function findNearestBarangay(lat, lng) {
    const barangays = await Barangay.findAll();

    let nearest = null;
    let minDistance = Infinity;

    for (const barangay of barangays) {
        // Use approximate center coordinates (you may need to adjust these)
        const distance = calculateDistance(lat, lng, 13.94, 121.16);

        if (distance < minDistance) {
            minDistance = distance;
            nearest = barangay;
        }
    }

    return nearest || barangays[0]; // Fallback to first barangay
}

async function importFacilities() {
    try {
        console.log('🏢 Starting facilities import...\n');

        // Get all barangays
        const barangays = await Barangay.findAll();

        if (barangays.length === 0) {
            console.error('❌ No barangays found. Please run importBarangays.js first.');
            process.exit(1);
        }

        console.log(`✅ Found ${barangays.length} barangays\n`);

        // Delete existing facilities (optional - comment out if you want to keep existing)
        await Establishment.destroy({ where: {} });
        console.log('🗑️  Cleared existing facilities\n');

        let imported = 0;
        let skipped = 0;

        for (const facility of facilitiesData) {
            try {
                // Find nearest barangay (simple approach - assign to first barangay for now)
                const barangay = barangays[0];

                await Establishment.create({
                    name: facility.name,
                    type: facility.type,
                    barangay_id: barangay.id,
                    address: facility.address || 'Lipa City, Batangas',
                    latitude: facility.lat,
                    longitude: facility.lng,
                    capacity: facility.capacity || null,
                    current_occupancy: 0,
                    is_operational: true,
                    is_active: true,
                    description: `${facility.type.charAt(0).toUpperCase() + facility.type.slice(1)} facility in Lipa City`
                });

                imported++;
                console.log(`✅ Imported: ${facility.name} (${facility.type})`);
            } catch (error) {
                skipped++;
                console.error(`❌ Failed to import ${facility.name}:`, error.message);
            }
        }

        console.log(`\n📊 Import Summary:`);
        console.log(`   ✅ Successfully imported: ${imported}`);
        console.log(`   ❌ Skipped: ${skipped}`);
        console.log(`   📍 Total facilities: ${imported}`);

        // Show breakdown by type
        const breakdown = await Establishment.findAll({
            attributes: [
                'type',
                [db.sequelize.fn('COUNT', db.sequelize.col('type')), 'count']
            ],
            group: ['type']
        });

        console.log(`\n📋 Facilities by Type:`);
        breakdown.forEach(item => {
            console.log(`   ${item.type}: ${item.get('count')}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

// Run import
importFacilities();
