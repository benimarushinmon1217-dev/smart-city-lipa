/**
 * WindBarbs Component
 * Display meteorological wind barbs on the map (PAGASA style)
 * Wind barbs show direction and speed using traditional symbols
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const WindBarbs = ({
    windDirection = 90, // degrees (0=North, 90=East, 180=South, 270=West)
    windSpeed = 20, // km/h
    enabled = true,
    gridSpacing = 100, // pixels between barbs
    barbColor = '#1e40af',
    barbSize = 30
}) => {
    const map = useMap();

    useEffect(() => {
        if (!enabled || !map) return;

        // Create SVG overlay
        const svg = L.svg({ pane: 'overlayPane' });
        svg.addTo(map);

        const drawWindBarbs = () => {
            // Remove existing barbs
            const existingBarbs = map.getPane('overlayPane').querySelectorAll('.wind-barb');
            existingBarbs.forEach(barb => barb.remove());

            const bounds = map.getBounds();
            const size = map.getSize();

            // Calculate grid points
            const gridPoints = [];
            for (let x = 0; x < size.x; x += gridSpacing) {
                for (let y = 0; y < size.y; y += gridSpacing) {
                    const point = L.point(x, y);
                    const latLng = map.containerPointToLatLng(point);

                    if (bounds.contains(latLng)) {
                        gridPoints.push({ x, y, latLng });
                    }
                }
            }

            // Draw wind barb at each grid point
            gridPoints.forEach(point => {
                const barb = createWindBarb(point.x, point.y, windDirection, windSpeed, barbColor, barbSize);
                map.getPane('overlayPane').appendChild(barb);
            });
        };

        // Initial draw
        drawWindBarbs();

        // Redraw on map events
        map.on('move', drawWindBarbs);
        map.on('zoom', drawWindBarbs);
        map.on('resize', drawWindBarbs);

        return () => {
            const existingBarbs = map.getPane('overlayPane').querySelectorAll('.wind-barb');
            existingBarbs.forEach(barb => barb.remove());
            map.off('move', drawWindBarbs);
            map.off('zoom', drawWindBarbs);
            map.off('resize', drawWindBarbs);
        };
    }, [enabled, map, windDirection, windSpeed, gridSpacing, barbColor, barbSize]);

    return null;
};

/**
 * Create a wind barb SVG element
 * Wind barbs use flags and feathers to show speed:
 * - Each full feather = 10 km/h
 * - Each half feather = 5 km/h
 * - Triangle flag = 50 km/h
 */
const createWindBarb = (x, y, direction, speed, color, size) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'wind-barb');
    svg.style.position = 'absolute';
    svg.style.left = `${x - size / 2}px`;
    svg.style.top = `${y - size / 2}px`;
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Rotate to wind direction (meteorological: direction wind is FROM)
    g.setAttribute('transform', `translate(${size / 2}, ${size / 2}) rotate(${direction})`);

    // Draw staff (main line)
    const staff = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    staff.setAttribute('x1', '0');
    staff.setAttribute('y1', '0');
    staff.setAttribute('x2', '0');
    staff.setAttribute('y2', size * 0.6);
    staff.setAttribute('stroke', color);
    staff.setAttribute('stroke-width', '2');
    g.appendChild(staff);

    // Calculate number of flags and feathers
    const flags = Math.floor(speed / 50);
    const remainingSpeed = speed % 50;
    const fullFeathers = Math.floor(remainingSpeed / 10);
    const halfFeathers = Math.floor((remainingSpeed % 10) / 5);

    let currentY = size * 0.1;
    const featherSpacing = size * 0.12;

    // Draw flags (triangles for 50 km/h)
    for (let i = 0; i < flags; i++) {
        const flag = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const points = `0,${currentY} ${size * 0.4},${currentY + featherSpacing} 0,${currentY + featherSpacing * 2}`;
        flag.setAttribute('points', points);
        flag.setAttribute('fill', color);
        g.appendChild(flag);
        currentY += featherSpacing * 2.5;
    }

    // Draw full feathers (10 km/h each)
    for (let i = 0; i < fullFeathers; i++) {
        const feather = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        feather.setAttribute('x1', '0');
        feather.setAttribute('y1', currentY);
        feather.setAttribute('x2', size * 0.4);
        feather.setAttribute('y2', currentY + featherSpacing);
        feather.setAttribute('stroke', color);
        feather.setAttribute('stroke-width', '2');
        g.appendChild(feather);
        currentY += featherSpacing;
    }

    // Draw half feathers (5 km/h each)
    for (let i = 0; i < halfFeathers; i++) {
        const halfFeather = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        halfFeather.setAttribute('x1', '0');
        halfFeather.setAttribute('y1', currentY);
        halfFeather.setAttribute('x2', size * 0.2);
        halfFeather.setAttribute('y2', currentY + featherSpacing * 0.5);
        halfFeather.setAttribute('stroke', color);
        halfFeather.setAttribute('stroke-width', '2');
        g.appendChild(halfFeather);
        currentY += featherSpacing;
    }

    // Draw circle at base for calm winds (< 5 km/h)
    if (speed < 5) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');
        circle.setAttribute('r', size * 0.15);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2');
        g.appendChild(circle);
    }

    svg.appendChild(g);
    return svg;
};

export default WindBarbs;
