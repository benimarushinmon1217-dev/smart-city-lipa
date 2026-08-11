/**
 * BarangayLayer Component
 * Display barangay boundaries from GeoJSON with risk visualization
 */

import { useEffect, useState } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import { Badge } from '../common';

const BarangayLayer = ({ onBarangayClick }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load GeoJSON data
    fetch('/data/lipa_barangays_risk_fixed.geojson')
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading barangay data:', error);
        setLoading(false);
      });
  }, []);

  if (loading || !geoData) {
    return null;
  }

  // Style function based on risk level
  const getStyle = (feature) => {
    // Calculate overall risk from flood_risk (0-1 scale)
    const floodRisk = feature.properties?.flood_risk || 0;

    // Convert to risk level
    let riskLevel = 'low';
    if (floodRisk >= 0.75) {
      riskLevel = 'critical';
    } else if (floodRisk >= 0.65) {
      riskLevel = 'high';
    } else if (floodRisk >= 0.55) {
      riskLevel = 'medium';
    }

    const styles = {
      critical: {
        fillColor: '#dc2626',
        fillOpacity: 0.3,
        color: '#dc2626',
        weight: 2,
      },
      high: {
        fillColor: '#ea580c',
        fillOpacity: 0.25,
        color: '#ea580c',
        weight: 2,
      },
      medium: {
        fillColor: '#f59e0b',
        fillOpacity: 0.2,
        color: '#f59e0b',
        weight: 2,
      },
      low: {
        fillColor: '#22c55e',
        fillOpacity: 0.15,
        color: '#22c55e',
        weight: 2,
      },
    };

    return styles[riskLevel] || styles.low;
  };

  // Highlight on hover
  const onEachFeature = (feature, layer) => {
    const properties = feature.properties || {};

    // Calculate risk level from flood_risk
    const floodRisk = properties.flood_risk || 0;
    let riskLevel = 'Low';
    let riskColor = 'text-green-600';
    if (floodRisk >= 0.75) {
      riskLevel = 'Critical';
      riskColor = 'text-red-600';
    } else if (floodRisk >= 0.65) {
      riskLevel = 'High';
      riskColor = 'text-orange-600';
    } else if (floodRisk >= 0.55) {
      riskLevel = 'Medium';
      riskColor = 'text-yellow-600';
    }

    // Popup content
    const popupContent = `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900 mb-2">${properties.ADM4_EN || 'Unknown Barangay'}</h3>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-600">Risk Level:</span>
            <span class="font-medium ${riskColor}">${riskLevel}</span>
          </div>
          ${properties.flood_risk !== undefined ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Flood Risk:</span>
              <span class="font-medium">${(properties.flood_risk * 100).toFixed(1)}%</span>
            </div>
          ` : ''}
          ${properties.elev_risk !== undefined ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Elevation Risk:</span>
              <span class="font-medium">${(properties.elev_risk * 100).toFixed(1)}%</span>
            </div>
          ` : ''}
          ${properties.river_risk !== undefined ? `
            <div class="flex justify-between">
              <span class="text-gray-600">River Risk:</span>
              <span class="font-medium">${(properties.river_risk * 100).toFixed(1)}%</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    layer.bindPopup(popupContent);

    // Hover effects and click handler
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.5,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        const style = getStyle(feature);
        layer.setStyle(style);
      },
      click: (e) => {
        if (onBarangayClick) {
          onBarangayClick(feature, e.latlng);
        }
      },
    });
  };

  return (
    <GeoJSON
      data={geoData}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  );
};

export default BarangayLayer;
