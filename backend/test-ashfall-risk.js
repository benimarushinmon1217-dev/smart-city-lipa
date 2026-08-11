/**
 * Test Script for Wind-Based Ashfall Risk Calculation
 * Run with: node backend/test-ashfall-risk.js
 */

const windAshfallService = require('./services/windAshfallService');

console.log('='.repeat(80));
console.log('WIND-BASED ASHFALL RISK CALCULATION TEST');
console.log('='.repeat(80));
console.log();

// Test location: Lipa City (Antipolo del Sur)
const lipaCity = {
    name: 'Antipolo del Sur, Lipa City',
    latitude: 13.9411,
    longitude: 121.1631
};

console.log(`Test Location: ${lipaCity.name}`);
console.log(`Coordinates: ${lipaCity.latitude}°N, ${lipaCity.longitude}°E`);
console.log();

// Test scenarios with different wind conditions
const scenarios = [
    {
        name: 'Scenario 1: High Risk (Downwind)',
        wind_direction: 'SE',
        wind_speed: 60,
        expected: 'Very High'
    },
    {
        name: 'Scenario 2: Medium Risk (Partial Alignment)',
        wind_direction: 'S',
        wind_speed: 30,
        expected: 'Medium'
    },
    {
        name: 'Scenario 3: Low Risk (Perpendicular)',
        wind_direction: 'SW',
        wind_speed: 60,
        expected: 'Low'
    },
    {
        name: 'Scenario 4: Very Low Risk (Upwind)',
        wind_direction: 'NW',
        wind_speed: 60,
        expected: 'Very Low'
    }
];

scenarios.forEach((scenario, index) => {
    console.log('-'.repeat(80));
    console.log(`${scenario.name}`);
    console.log('-'.repeat(80));
    console.log(`Wind Direction: ${scenario.wind_direction} (${scenario.wind_speed} km/h)`);
    console.log();

    const result = windAshfallService.calculateAshfallRisk(
        lipaCity.latitude,
        lipaCity.longitude,
        scenario.wind_direction,
        scenario.wind_speed
    );

    console.log(`Distance from Taal Volcano: ${result.distance_from_volcano.toFixed(2)} km`);
    console.log(`Bearing to Location: ${result.bearing_to_location.toFixed(1)}°`);
    console.log(`Wind From Direction: ${result.wind_from_direction}°`);
    console.log(`Ashfall Direction: ${result.ashfall_direction}°`);
    console.log(`Angular Difference: ${result.angular_difference.toFixed(1)}°`);
    console.log(`Is Downwind: ${result.is_downwind ? 'YES' : 'NO'}`);
    console.log();
    console.log(`Alignment Factor: ${result.alignment_factor.toFixed(3)}`);
    console.log(`Distance Factor: ${result.distance_factor.toFixed(3)}`);
    console.log(`Wind Speed Factor: ${result.wind_speed_factor.toFixed(3)}`);
    console.log();
    console.log(`ASHFALL RISK: ${(result.ashfall_risk * 100).toFixed(1)}%`);
    console.log(`RISK LEVEL: ${result.ashfall_risk_level}`);
    console.log(`Expected: ${scenario.expected}`);
    console.log();

    const description = windAshfallService.getAshfallRiskDescription(result);
    console.log(`Description:`);
    console.log(`"${description}"`);
    console.log();
});

console.log('='.repeat(80));
console.log('BATCH PROCESSING TEST');
console.log('='.repeat(80));
console.log();

// Test batch processing with multiple barangays
const barangays = [
    { name: 'Antipolo del Sur', latitude: 13.9411, longitude: 121.1631 },
    { name: 'Balete', latitude: 13.9500, longitude: 121.1700 },
    { name: 'Halang', latitude: 13.9600, longitude: 121.0800 },
    { name: 'Duhatan', latitude: 13.9400, longitude: 121.0700 },
    { name: 'Malitlit', latitude: 13.9300, longitude: 121.2400 }
];

const batchResults = windAshfallService.calculateBatchAshfallRisk(
    barangays,
    'SE',
    60
);

console.log('Wind Conditions: SE at 60 km/h (Very Strong)');
console.log();
console.log('Results:');
console.log();

batchResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}`);
    console.log(`   Distance: ${result.distance_from_volcano.toFixed(2)} km`);
    console.log(`   Risk: ${(result.ashfall_risk * 100).toFixed(1)}% (${result.ashfall_risk_level})`);
    console.log(`   Downwind: ${result.is_downwind ? 'YES' : 'NO'}`);
    console.log();
});

console.log('='.repeat(80));
console.log('TEST COMPLETE');
console.log('='.repeat(80));
