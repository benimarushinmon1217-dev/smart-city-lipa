/**
 * Test Wind Direction Logic
 * Verify the relationship between wind direction and ashfall risk
 */

const windAshfallService = require('./services/windAshfallService');

console.log('='.repeat(80));
console.log('WIND DIRECTION LOGIC TEST');
console.log('='.repeat(80));
console.log();

// Lipa City location
const lipaCity = {
    latitude: 13.9411,
    longitude: 121.1631
};

// Taal Volcano location
const taalVolcano = {
    latitude: 14.0106,
    longitude: 120.9975
};

console.log('GEOGRAPHY:');
console.log(`Taal Volcano: ${taalVolcano.latitude}°N, ${taalVolcano.longitude}°E`);
console.log(`Lipa City: ${lipaCity.latitude}°N, ${lipaCity.longitude}°E`);
console.log();

// Calculate bearing from Taal to Lipa
const bearing = windAshfallService.calculateBearing(
    taalVolcano.latitude,
    taalVolcano.longitude,
    lipaCity.latitude,
    lipaCity.longitude
);

console.log(`Bearing from Taal to Lipa: ${bearing.toFixed(1)}°`);
console.log();

// Determine direction
let directionName;
if (bearing >= 337.5 || bearing < 22.5) directionName = 'North';
else if (bearing >= 22.5 && bearing < 67.5) directionName = 'Northeast';
else if (bearing >= 67.5 && bearing < 112.5) directionName = 'East';
else if (bearing >= 112.5 && bearing < 157.5) directionName = 'Southeast';
else if (bearing >= 157.5 && bearing < 202.5) directionName = 'South';
else if (bearing >= 202.5 && bearing < 247.5) directionName = 'Southwest';
else if (bearing >= 247.5 && bearing < 292.5) directionName = 'West';
else directionName = 'Northwest';

console.log(`Lipa City is ${directionName} of Taal Volcano`);
console.log();
console.log('='.repeat(80));
console.log('WIND DIRECTION SCENARIOS (60 km/h wind)');
console.log('='.repeat(80));
console.log();

const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

windDirections.forEach(windDir => {
    const result = windAshfallService.calculateAshfallRisk(
        lipaCity.latitude,
        lipaCity.longitude,
        windDir,
        60
    );

    const windFromDegrees = windAshfallService.windDirectionToDegrees(windDir);
    const ashfallDirection = (windFromDegrees + 180) % 360;

    console.log(`Wind Direction: ${windDir} (from ${windFromDegrees}°)`);
    console.log(`  → Ashfall goes TO: ${ashfallDirection}°`);
    console.log(`  → Lipa is at bearing: ${bearing.toFixed(1)}°`);
    console.log(`  → Angular difference: ${result.angular_difference.toFixed(1)}°`);
    console.log(`  → Alignment factor: ${result.alignment_factor.toFixed(3)}`);
    console.log(`  → Risk: ${(result.ashfall_risk * 100).toFixed(1)}% (${result.ashfall_risk_level})`);
    console.log(`  → Downwind: ${result.is_downwind ? 'YES' : 'NO'}`);
    console.log();
});

console.log('='.repeat(80));
console.log('EXPECTED LOGIC:');
console.log('='.repeat(80));
console.log();
console.log('If Lipa is SOUTHEAST of Taal (~135°):');
console.log('  - NW wind (from 315°) → ashfall goes SE (135°) → HIGH RISK ✓');
console.log('  - N wind (from 0°) → ashfall goes S (180°) → MEDIUM RISK');
console.log('  - W wind (from 270°) → ashfall goes E (90°) → LOW RISK');
console.log('  - SE wind (from 135°) → ashfall goes NW (315°) → LOW RISK');
console.log();
