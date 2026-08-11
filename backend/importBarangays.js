/**
 * Import Barangays from GeoJSON
 * Populates the barangays table with all barangays from the GeoJSON file
 */

const fs = require('fs');
const path = require('path');
const { Barangay, sequelize } = require('./models');

async function importBarangays() {
    try {
        console.log('🔄 Starting barangay import...\n');

        // Read GeoJSON file
        const geoJsonPath = path.join(__dirname, '../data/lipa_barangays_risk_fixed.geojson');
        const geoJsonData = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));

        console.log(`📊 Found ${geoJsonData.features.length} barangays in GeoJSON\n`);

        // Extract barangay data
        const barangays = geoJsonData.features.map(feature => {
            const props = feature.properties;

            // Calculate centroid for coordinates (simple average of polygon points)
            let latitude = null;
            let longitude = null;

            if (feature.geometry && feature.geometry.coordinates) {
                const coords = feature.geometry.coordinates[0][0]; // Get first polygon's first ring
                if (coords && coords.length > 0) {
                    // Calculate average lat/lng
                    const sum = coords.reduce((acc, coord) => {
                        acc.lng += coord[0];
                        acc.lat += coord[1];
                        return acc;
                    }, { lng: 0, lat: 0 });

                    longitude = sum.lng / coords.length;
                    latitude = sum.lat / coords.length;
                }
            }

            return {
                name: props.ADM4_EN,
                code: props.ADM4_PCODE,
                latitude: latitude,
                longitude: longitude,
                flood_risk_level: props.flood_risk >= 0.75 ? 'Critical' :
                    props.flood_risk >= 0.65 ? 'High' :
                        props.flood_risk >= 0.55 ? 'Medium' : 'Low',
                landslide_risk_level: props.elev_risk >= 0.75 ? 'Critical' :
                    props.elev_risk >= 0.65 ? 'High' :
                        props.elev_risk >= 0.55 ? 'Medium' : 'Low',
                population: null, // Not in GeoJSON
                area_sqkm: props.AREA_SQKM || null,
                elevation: props.elev_mean || null,
            };
        });

        // Clear existing barangays
        console.log('🔄 Upserting barangays (insert new, skip existing)...');

        // Use upsert to insert or update each barangay
        for (const barangay of barangays) {
            await Barangay.upsert(barangay, {
                conflictFields: ['name'] // Use name as unique identifier
            });
        }

        // Verify count
        const count = await Barangay.count();
        console.log(`\n✅ Successfully imported ${count} barangays!\n`);

        // Show sample
        console.log('Sample barangays:');
        const sample = await Barangay.findAll({
            limit: 10,
            attributes: ['id', 'name', 'flood_risk_level'],
            order: [['name', 'ASC']]
        });
        sample.forEach(b => {
            console.log(`  ${b.id}. ${b.name} (Flood Risk: ${b.flood_risk_level})`);
        });

        console.log('\n🎉 Import complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error importing barangays:', error);
        process.exit(1);
    }
}

// Run import
importBarangays();
