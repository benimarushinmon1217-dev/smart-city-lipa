/**
 * WindAnimation Component
 * Animated wind direction visualization similar to PAGASA
 * Shows flowing particles and wind barbs
 */

import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const WindAnimation = ({
    windDirection = 90, // degrees (0=North, 90=East, 180=South, 270=West)
    windSpeed = 20, // km/h
    enabled = true,
    particleCount = 800, // Reduced from 2000
    particleAge = 60, // Reduced from 90
    lineWidth = 1, // Smaller from 2
    opacity = 0.97
}) => {
    const map = useMap();
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!enabled || !map) return;

        // Create canvas overlay
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '450'; // Above barangays (400) but below controls (1000)

        const mapContainer = map.getContainer();
        mapContainer.appendChild(canvas);
        canvasRef.current = canvas;

        // Set canvas size
        const resizeCanvas = () => {
            const size = map.getSize();
            canvas.width = size.x;
            canvas.height = size.y;
        };
        resizeCanvas();

        // Initialize particles
        initializeParticles();

        // Start animation
        setIsAnimating(true);
        animate();

        // Handle map events
        map.on('move', resizeCanvas);
        map.on('zoom', resizeCanvas);
        map.on('resize', resizeCanvas);

        return () => {
            setIsAnimating(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            map.off('move', resizeCanvas);
            map.off('zoom', resizeCanvas);
            map.off('resize', resizeCanvas);
        };
    }, [enabled, map, windDirection, windSpeed]);

    const initializeParticles = () => {
        const particles = [];
        const canvas = canvasRef.current;
        if (!canvas) return;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                age: Math.random() * particleAge,
                maxAge: particleAge,
            });
        }
        particlesRef.current = particles;
    };

    const animate = () => {
        if (!canvasRef.current || !isAnimating) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas completely (transparent background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        const particles = particlesRef.current;

        // Convert wind direction to radians (meteorological convention)
        // Wind direction is where wind is coming FROM
        const windRadians = ((windDirection + 180) % 360) * Math.PI / 180;

        // Calculate velocity based on wind speed
        const velocity = windSpeed / 10; // Scale down for visual effect

        particles.forEach((particle, index) => {
            // Age particle
            particle.age++;

            // Reset particle if too old
            if (particle.age > particle.maxAge) {
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
                particle.age = 0;
            }

            // Move particle based on wind direction
            particle.x += Math.cos(windRadians) * velocity;
            particle.y += Math.sin(windRadians) * velocity;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Draw particle with trail
            const alpha = 0.7 - (particle.age / particle.maxAge) * 0.5; // Fade from 0.7 to 0.2
            const size = lineWidth * 1.5; // Smaller particles (1.5px)

            // Color based on wind speed (softer colors)
            let color;
            if (windSpeed > 40) {
                color = `rgba(239, 68, 68, ${alpha})`; // Red - Strong wind
            } else if (windSpeed > 25) {
                color = `rgba(251, 146, 60, ${alpha})`; // Orange - Moderate wind
            } else if (windSpeed > 15) {
                color = `rgba(96, 165, 250, ${alpha})`; // Blue - Light wind
            } else {
                color = `rgba(148, 163, 184, ${alpha})`; // Slate - Calm
            }

            // Draw particle as small circle
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Draw subtle trail (only 1 previous position)
            if (particle.age > 2) {
                const prevX = particle.x - Math.cos(windRadians) * velocity;
                const prevY = particle.y - Math.sin(windRadians) * velocity;

                ctx.strokeStyle = color;
                ctx.lineWidth = size * 0.8;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(particle.x, particle.y);
                ctx.stroke();
            }
        });

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    return null; // This component doesn't render React elements
};

export default WindAnimation;
