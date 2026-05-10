// 🔥 ROUTING CONTROL FLAGS
window.windSpeed = 20; // km/h (default)
window.routeCache = {};
window.routeCacheSize = 0;
window.MAX_CACHE_SIZE = 50; // Limit cache to prevent memory issues
window.isRouting = false;
window.destinationMarker = null;
let infoBox = null;

// ✅ Declare global quantile variables
window.q50 = null;
window.q80 = null;


// ✅ SAFE GETTER (fixes DOM timing issue)
function getInfoBox() {
  return document.getElementById("infoBox");
}

/* =========================
   AREA CALCULATION
========================= */
function calculateAreaSqKm(feature) {
  if (!feature.geometry || feature.geometry.type === "Point") return null;
  return (turf.area(feature) / 1_000_000).toFixed(2);
}

/* =========================
   SIDEBAR INFO DISPLAY
========================= */
function showInfo(feature, backendData = null) {
  const infoBox = document.getElementById("infoBox");
  if (!infoBox) return;

  const p = feature.properties || {};
  const area = calculateAreaSqKm(feature);

  // 🔥 SINGLE SOURCE OF TRUTH
  const risk = p.flood_level || "Unknown";
  const ashfall = p.ashfall_level || "Unknown";

  // 🔥 FORCE GLOBAL SYNC (THIS FIXES YOUR AI)
  window.currentData = {
    risk: risk,
    ashfall: ashfall,
    elevation: p.mean_elev || "Unknown",
    distance: p.taal_distance || "Unknown"
  };

  // 🔍 DEBUG
  console.log("✅ SYNCED DATA:", window.currentData);

  infoBox.innerHTML = `
    <strong>${p.ADM4_EN || p.name || "Unknown Area"}</strong>
    <hr>
    <p><b>Flood Risk:</b> ${risk}</p>
    <p><b>Ashfall Risk:</b> ${ashfall}</p>
    <p><b>Distance from Taal:</b> ${p.taal_distance ? p.taal_distance.toFixed(1) + " km" : "Unknown"}</p>
    <p><b>Wind Direction:</b> ${window.WIND_DIRECTION || "NE"}</p>
    ${p.mean_elev ? `<p><b>Mean Elevation:</b> ${p.mean_elev} m</p>` : ""}
    ${p.dist_water ? `<p><b>Distance to Water:</b> ${p.dist_water} km</p>` : ""}
    ${area ? `<p><b>Area:</b> ${area} km²</p>` : ""}
    <p><b>Backend Risk:</b> ${risk}</p>
  `;
}

/* =========================
   BACKEND RISK ANALYSIS
========================= */
async function fetchRiskAnalysis(data) {
  try {
    const res = await fetch("http://localhost:5000/analyze-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Backend error:", err);
    // Return fallback data
    return {
      risk: data._risk_score >= (window.flood_q80 || 0) ? "High" :
        data._risk_score >= (window.flood_q50 || 0) ? "Medium" : "Low",
      score: data._risk_score
    };
  }
}

/* =========================
   AI CHAT
========================= */
async function askAI() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");

  const question = input.value.trim();
  if (!question) {
    input.focus();
    return;
  }

  // Show user message
  chatBox.innerHTML += `<div class="chat-user"><span>${question}</span></div>`;
  input.value = "";

  // Show loading indicator
  const loadingId = 'loading-' + Date.now();
  chatBox.innerHTML += `<div class="chat-ai" id="${loadingId}"><span>Thinking...</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  const data = window.currentData || {};
  const route = window.currentRouteData || {};

  // 🔥 BULLETPROOF ASHFALL FETCH
  const ashfallValue =
    data.ashfall ||
    window.currentFeature?.properties?.ashfall_level ||
    window.currentFeature?.properties?.ashfall_risk ||
    window.currentFeature?.properties?.ashfall ||
    "Unknown";

  // 🔍 DEBUG (VERY IMPORTANT — CHECK THIS IN CONSOLE)
  console.log("🚀 SENDING TO AI:", {
    risk: data.risk,
    ashfall: ashfallValue,
    wind: window.WIND_DIRECTION
  });

  try {
    const response = await fetch("http://127.0.0.1:5000/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        question,

        // BARANGAY DATA
        risk: data.risk || "Unknown",
        elevation: data.elevation || "Unknown",
        distance: data.distance || "Unknown",

        // 🔥 FIXED
        ashfall: ashfallValue,
        wind: window.WIND_DIRECTION || "Unknown",

        // ROUTE DATA
        route_distance: route.distance || "Unknown",
        route_time: route.time || "Unknown",
        route_risk: route.risk || "Unknown",
        shelter: route.shelter || "Unknown"
      })
    });

    const result = await response.json();

    // Remove loading indicator
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    chatBox.innerHTML += `<div class="chat-ai"><span>${result.reply}</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    console.error("AI ERROR:", err);

    // Remove loading indicator
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    chatBox.innerHTML += `<div class="chat-ai"><span>⚠️ AI service unavailable. Please try again later.</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

/* =========================
   GEOLOCATION (SAFE TIMING)
========================= */
function initLocationDetection() {
  if (!navigator.geolocation) {
    updateModeText("Geolocation not supported by your browser", "#ef4444");
    // Show manual selection as fallback
    setTimeout(() => {
      showManualSelection();
    }, 1500);
    return;
  }

  updateModeText("Detecting your location...", "#94a3b8");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      console.log("📍 User location:", lat, lng);

      handleUserLocation(lat, lng);
    },
    (err) => {
      console.warn("❌ Location error:", err.message);
      let errorMsg = "Location access denied";

      if (err.code === 1) {
        errorMsg = "Location permission denied. Please enable location access.";
      } else if (err.code === 2) {
        errorMsg = "Location unavailable. Please try again.";
      } else if (err.code === 3) {
        errorMsg = "Location request timeout. Please try again.";
      }

      updateModeText(errorMsg, "#ef4444");

      // Show manual selection as fallback
      setTimeout(() => {
        showManualSelection();
      }, 2000);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

/* =========================
   WAIT FOR LAYERS FIRST
========================= */
function useMyLocation() {
  updateModeText("Preparing map...", "#94a3b8");

  const waitForLayers = setInterval(() => {
    if (window.layersReady && Layers.barangays) {
      clearInterval(waitForLayers);

      updateModeText("Detecting your location...", "#94a3b8");
      initLocationDetection();
    }
  }, 300);
}

/* =========================
   DETECT BARANGAY
========================= */
function handleUserLocation(lat, lng) {
  window.initialShelter = null;
  if (!Layers.barangays) {
    console.warn("Barangay layer not ready");
    return;
  }

  const userPoint = turf.point([lng, lat]);
  let foundLayer = null;

  Layers.barangays.eachLayer(layer => {
    if (!layer.getBounds().contains([lat, lng])) return;

    if (turf.booleanPointInPolygon(userPoint, layer.feature)) {
      foundLayer = layer;
    }
  });

  if (!foundLayer) {
    updateModeText("Outside Lipa boundary", "#ef4444");
    return;
  }

  updateModeText("Location detected ✔", "#22c55e");

  focusAutoBarangay(foundLayer, lat, lng);

  // 🔥 Give user 0.5s to see message, then REMOVE overlay
  setTimeout(() => {
    closeLoginOverlay();
  }, 500);

  // 🔥 Backup force close (failsafe)
  setTimeout(closeLoginOverlay, 1500);
}
/* =========================
   AUTO FOCUS
========================= */
function focusAutoBarangay(layer, lat, lng) {
  const f = layer.feature;

  if (window.highlightLayer) highlightLayer(layer);

  const latlng = [lat, lng];
  map.flyTo(latlng, 16, { duration: 1.2 });

  if (window.userMarker) {
    map.removeLayer(window.userMarker);
  }

  window.userMarker = L.marker(latlng, {
    icon: window.userLocationIcon
  }).addTo(map);

  // 🔥 ALWAYS reference the same object
  window.userMarker.bindPopup("📍 You are here").openPopup();

  window.currentFeature = f;
  window.currentData = {
    risk: f.properties.flood_level || "Unknown",

    // 🔥 FIXED (THIS IS THE REAL FIX)
    ashfall:
      f.properties.ashfall_level ||
      f.properties.ashfall_risk ||
      f.properties.ashfall ||
      "Unknown",

    elevation: f.properties.elevation || "Unknown",
    distance: f.properties.distance_km || "Unknown"
  };

  const rawName = f.properties.ADM4_EN || f.properties.name;
  document.getElementById("placeName").innerText = rawName;

  const formattedName = normalizeName(rawName);

  const img = document.getElementById("placeImage");
  img.src = `/images/${formattedName}.jpg`;
  img.onerror = () => {
    img.src = "https://placehold.co/300x150";
  };

  // 🔥 SAFE SCORE CALCULATION
  const elev = f.properties.mean_elev || 0;
  const dist = f.properties.dist_water || 0;
  const score = (elev ? 1 / elev : 0) + (dist ? 1 / dist : 0);

  fetchRiskAnalysis({
    _risk_score: score,
    q50: window.flood_q50 || window.q50,
    q80: window.flood_q80 || window.q80
  }).then(data => {

    // 🔥 FORCE CONSISTENCY
    if (data) {
      data.risk = f.properties.flood_level;
    }

    showInfo(f, data);
  }).catch(err => {
    console.error("Risk analysis failed:", err);
    showInfo(f, null);
  });
  // 🔥 AUTO RECOMPUTE IF USER MOVES AGAIN
  if (window.lastBestShelter) {
    setTimeout(() => {
      findBestShelterByRoute();
    }, 800);
  }
}

/* =========================
   MASTER SELECTION (MERGED FIXED VERSION)
========================= */
function selectBarangay(layer, latlngOverride = null, label = "Selected location") {
  window.initialShelter = null;
  const f = layer.feature;

  if (window.highlightLayer) highlightLayer(layer);

  const center = latlngOverride
    ? latlngOverride
    : (() => {
      const c = turf.centerOfMass(f).geometry.coordinates;
      return [c[1], c[0]];
    })();

  map.flyTo(center, 15, { duration: 1.2 });

  if (window.userMarker) {
    map.removeLayer(window.userMarker);
  }

  window.userMarker = L.marker(center, {
    icon: window.userLocationIcon
  }).addTo(map);

  const name = f.properties.ADM4_EN || f.properties.name;

  window.userMarker.bindPopup(`<b>${name}</b><br>${label}`).openPopup();

  // ✅ DATA
  window.currentFeature = f;
  window.currentData = {
    risk: f.properties.flood_level || "Unknown",

    // 🔥 FIXED (THIS IS THE REAL FIX)
    ashfall:
      f.properties.ashfall_level ||
      f.properties.ashfall_risk ||
      f.properties.ashfall ||
      "Unknown",

    elevation: f.properties.elevation || "Unknown",
    distance: f.properties.distance_km || "Unknown"
  };

  // UI
  document.getElementById("placeName").innerText = name;

  const formattedName = normalizeName(name);

  const img = document.getElementById("placeImage");
  img.src = `/images/${formattedName}.jpg`;
  img.onerror = () => {
    img.onerror = null; // stop infinite loop
    img.src = "/images/default.jpg";
  };

  // 🔥 SAFE SCORE (CRITICAL FIX)
  const elev = f.properties.mean_elev || 0;
  const dist = f.properties.dist_water || 0;
  const score = (elev ? 1 / elev : 0) + (dist ? 1 / dist : 0);

  fetchRiskAnalysis({
    _risk_score: score,
    q50: window.flood_q50 || window.q50,
    q80: window.flood_q80 || window.q80
  }).then(data => {

    // 🔥 FORCE CONSISTENCY
    if (data) {
      data.risk = f.properties.flood_level;
    }

    showInfo(f, data);
  }).catch(err => {
    console.error("Risk analysis failed:", err);
    showInfo(f, null);
  });

  // 🔥 AUTO RECOMPUTE IF USER MOVES AGAIN
  if (window.lastBestShelter) {
    setTimeout(() => {
      findBestShelterByRoute();
    }, 800);
  }
}

/* =========================
   LOGIN CONTROL
========================= */
function closeLoginOverlay() {
  const overlay = document.getElementById("loginOverlay");
  if (!overlay) return;

  // 🔥 COMPLETELY REMOVE FROM DOM
  overlay.remove();

  console.log("✅ Overlay REMOVED from DOM");
}

function updateModeText(text, color) {
  const el = document.getElementById("modeSelection");
  if (!el) return;

  el.innerHTML = `<p style="color:${color};">${text}</p>`;
}

function showManualSelection() {
  const section = document.getElementById("manualSection");
  if (section) section.style.display = "block";
}

/* =========================
   HOTLINES
========================= */
function openHotlines() {
  document.getElementById("hotlineModal").style.display = "flex";
}

function closeHotlines() {
  document.getElementById("hotlineModal").style.display = "none";
}

/* =========================
   REPORT FLOOD
========================= */
function openReport() {
  document.getElementById("reportModal").style.display = "flex";
}

function closeReport() {
  document.getElementById("reportModal").style.display = "none";
}

function submitReport() {
  if (!window.currentFeature) {
    alert("Please select a barangay on the map first");
    return;
  }

  try {
    const center = turf.centerOfMass(window.currentFeature).geometry.coordinates;
    const latlng = [center[1], center[0]];
    const barangayName = window.currentFeature.properties.ADM4_EN ||
      window.currentFeature.properties.name ||
      "Unknown Area";

    L.marker(latlng)
      .addTo(map)
      .bindPopup(`⚠️ Flood reported in ${barangayName}<br><small>${new Date().toLocaleString()}</small>`)
      .openPopup();

    closeReport();

    // Show confirmation
    if (window.triggerSystemAlert) {
      triggerSystemAlert(`Flood report submitted for ${barangayName}`);
    }
  } catch (err) {
    console.error("Report submission failed:", err);
    alert("Failed to submit report. Please try again.");
  }
}
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
function findNearestShelter() {
  if (!window.userMarker) {
    alert("Please select your location first by clicking on the map or using 'Use My Location'");
    return;
  }

  if (!window.allFacilities || window.allFacilities.length === 0) {
    alert("Evacuation facilities data not loaded. Please refresh the page.");
    return;
  }

  const userLatLng = window.userMarker.getLatLng();

  let best = null;
  let bestScore = Infinity;

  window.allFacilities.forEach(f => {
    if (f.type !== "evacuation") return;

    const dist = getDistance(
      userLatLng.lat,
      userLatLng.lng,
      f.lat,
      f.lng
    );

    // 🔥 CHECK NEARBY BARANGAY RISK
    let riskPenalty = 0;

    Layers.barangays.eachLayer(layer => {
      let center;

      try {
        if (!layer.feature || !layer.feature.geometry) return;

        const type = layer.feature.geometry.type;

        // 🔥 ONLY allow polygons
        if (type !== "Polygon" && type !== "MultiPolygon") return;

        center = turf.centerOfMass(layer.feature).geometry.coordinates;
      } catch (e) {
        console.warn("⚠️ Skipped invalid geometry", layer.feature);
        return;
      }

      const d = getDistance(f.lat, f.lng, center[1], center[0]);

      if (d < 1) { // nearby barangay
        const flood = layer.feature.properties.flood_level;
        const ash = layer.feature.properties.ashfall_level;

        if (flood === "High" || ash === "Very High") riskPenalty = 3000;
        else if (flood === "Medium" || ash === "High") riskPenalty = 1500;
        else riskPenalty = 300;
      }
    });

    const score = dist + riskPenalty;

    if (score < bestScore) {
      bestScore = score;
      best = f;
    }
  });

  if (!best) {
    alert("No safe evacuation center found");
    return;
  }

  const target = [best.lat, best.lng];

  map.flyTo(target, 15);

  L.marker(target)
    .addTo(map)
    .bindPopup(`🏠 Safer Shelter<br><b>${best.name}</b>`)
    .openPopup();
}
function showEvacuationRoute() {
  if (!window.userMarker) {
    alert("Please select your location first");
    return;
  }

  if (!window.allFacilities || window.allFacilities.length === 0) {
    alert("Evacuation facilities data not loaded");
    return;
  }

  const userLatLng = window.userMarker.getLatLng();

  let nearest = null;
  let minDist = Infinity;

  window.allFacilities.forEach(f => {
    if (f.type !== "evacuation") return;

    const dist = getDistance(
      userLatLng.lat,
      userLatLng.lng,
      f.lat,
      f.lng
    );

    if (dist < minDist) {
      minDist = dist;
      nearest = f;
    }
  });

  if (!nearest) return;

  // 🔥 STORE INITIAL (STRAIGHT-LINE)
  if (!window.initialShelter) {
    window.initialShelter = {
      ...nearest,
      distance: minDist
    };
  }

  // 🔥 REMOVE OLD ROUTE
  if (window.routingControl) {
    try {
      map.removeControl(window.routingControl);
    } catch (e) {
      console.warn("Route cleanup issue:", e);
    }
  }

  // 🔥 CALL SMART ROUTING
  findBestShelterByRoute();
}


async function findBestShelterByRoute() {
  if (window.isRouting) {
    console.log("⏳ Route calculation already in progress");
    return;
  }

  window.isRouting = true;

  if (!window.userMarker) {
    alert("Please select your location first");
    window.isRouting = false;
    return;
  }

  if (!window.allFacilities || window.allFacilities.length === 0) {
    alert("Evacuation facilities data not loaded");
    window.isRouting = false;
    return;
  }

  updateModeText("Finding best evacuation route...", "#facc15");

  const userLatLng = window.userMarker.getLatLng();

  const shelters = window.allFacilities
    .filter(f => f.type === "evacuation")
    .map(f => ({
      ...f,
      dist: getDistance(userLatLng.lat, userLatLng.lng, f.lat, f.lng)
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5);

  let bestShelter = null;
  let bestScore = Infinity;

  for (const shelter of shelters) {
    try {

      // =========================
      // 🚫 PRE-FILTER (NEW)
      // =========================
      const distFromTaal = getDistance(
        TAAL.lat,
        TAAL.lng,
        shelter.lat,
        shelter.lng
      );

      const bearing = getBearing(
        TAAL.lat,
        TAAL.lng,
        shelter.lat,
        shelter.lng
      );

      const windFactor = getWindAlignment(bearing);

      if (windFactor >= 1.4 && distFromTaal < 15) {
        console.log("⛔ Skipped dangerous shelter:", shelter.name);
        continue;
      }

      // =========================
      // 📦 ROUTE CACHE
      // =========================
      const key = `${userLatLng.lat},${userLatLng.lng}-${shelter.lat},${shelter.lng}`;

      let data;

      if (window.routeCache[key]) {
        data = window.routeCache[key];
        console.log("⚡ Using cached route");
      } else {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/` +
          `${userLatLng.lng},${userLatLng.lat};${shelter.lng},${shelter.lat}?overview=full&geometries=geojson`
        );

        try {
          data = await res.json();

          // ✅ Implement cache size limit
          if (window.routeCacheSize >= window.MAX_CACHE_SIZE) {
            // Clear oldest cache entry
            const firstKey = Object.keys(window.routeCache)[0];
            delete window.routeCache[firstKey];
            window.routeCacheSize--;
          }

          window.routeCache[key] = data;
          window.routeCacheSize++;
        } catch (e) {
          console.error("Routing failed:", e);
          updateModeText("Routing failed. Try again.", "#ef4444");
          continue;
        }
      }

      if (!data.routes || !data.routes.length) continue;

      const route = data.routes[0];

      // 🔥 SAFETY CHECK
      if (!route.geometry || !route.geometry.coordinates) continue;

      const routeDist = route.distance;
      const duration = route.duration;

      window.bestRouteDistance = (routeDist / 1000).toFixed(2);
      window.bestRouteTime = Math.ceil(duration / 60);

      const riskLevel = window.currentFeature?.properties?.flood_level || "Unknown";
      window.routeRiskLevel = riskLevel;

      // =========================
      // 🛑 PATH RISK PENALTY
      // =========================
      let pathPenalty = 0;

      const routeLine = turf.lineString(route.geometry.coordinates);

      Layers.barangays.eachLayer(layer => {
        try {
          if (!layer.feature || !layer.feature.geometry) return;

          const type = layer.feature.geometry.type;
          if (type !== "Polygon" && type !== "MultiPolygon") return;

          const intersects = turf.booleanIntersects(routeLine, layer.feature);

          if (intersects) {
            const flood = layer.feature.properties.flood_level;

            if (flood === "High") pathPenalty += 20000;
            else if (flood === "Medium") pathPenalty += 10000;
            else pathPenalty += 1000;
          }
        } catch {
          return;
        }
      });

      // =========================
      // 🌊 FLOOD RISK (DESTINATION)
      // =========================
      let riskPenalty = 0;

      Layers.barangays.eachLayer(layer => {
        let center;

        try {
          if (!layer.feature || !layer.feature.geometry) return;

          const type = layer.feature.geometry.type;
          if (type !== "Polygon" && type !== "MultiPolygon") return;

          center = turf.centerOfMass(layer.feature).geometry.coordinates;
        } catch {
          return;
        }

        const d = getDistance(shelter.lat, shelter.lng, center[1], center[0]);

        if (d < 1) {
          const flood = layer.feature.properties.flood_level;

          if (flood === "High") riskPenalty = 10000;
          else if (flood === "Medium") riskPenalty = 5000;
          else riskPenalty = 500;
        }
      });

      // =========================
      // 🌬 WIND PENALTY
      // =========================
      let windPenalty = 0;

      const speedFactor = (window.windSpeed || 10) / 10;

      if (windFactor >= 1.4) windPenalty = 15000 * speedFactor;
      else if (windFactor >= 1.0) windPenalty = 8000 * speedFactor;
      else windPenalty = 500;

      // =========================
      // 🔥 FINAL SCORE
      // =========================
      const score = routeDist + riskPenalty + windPenalty + pathPenalty;

      if (score < bestScore) {
        bestScore = score;
        bestShelter = shelter;

        window.bestRouteDistance = (routeDist / 1000).toFixed(2);
      }

    } catch (err) {
      console.warn("Routing error:", err);
    }
  }

  if (!bestShelter) {
    updateModeText("No valid route found", "#ef4444");
    window.isRouting = false;
    return;
  }

  window.lastBestShelter = bestShelter;

  drawRouteToShelter(bestShelter);

  updateModeText("Best route found ✔", "#22c55e");

  window.isRouting = false;

  console.log("Shelters evaluated:", shelters.length);
}

async function drawRouteToShelter(shelter) {
  const userLatLng = window.userMarker.getLatLng();

  // REMOVE OLD ROUTE
  if (window.routingControl) {
    try {
      map.removeControl(window.routingControl);
    } catch (e) {
      console.warn("Route cleanup issue:", e);
    }
  }

  // REMOVE OLD COLORED LAYER
  if (window.coloredRouteLayer) {
    map.removeLayer(window.coloredRouteLayer);
  }

  // REMOVE OLD MARKER
  if (window.destinationMarker) {
    map.removeLayer(window.destinationMarker);
  }

  // 🔥 FAINT BASE ROUTE (BACKGROUND ONLY)
  window.routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userLatLng.lat, userLatLng.lng),
      L.latLng(shelter.lat, shelter.lng)
    ],
    routeWhileDragging: true,
    show: false,
    addWaypoints: false,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    lineOptions: {
      styles: [{ color: "#000000", weight: 3, opacity: 0.1 }]
    }
  }).addTo(map);

  // =========================
  // 🎨 FETCH ROUTE
  // =========================
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/` +
    `${userLatLng.lng},${userLatLng.lat};${shelter.lng},${shelter.lat}?overview=full&geometries=geojson`
  );

  let data;

  try {
    data = await res.json();
  } catch (e) {
    console.error("Route fetch failed:", e);
    updateModeText("Route drawing failed", "#ef4444");
    return;
  }

  if (!data.routes || !data.routes.length) {
    updateModeText("No route data available", "#ef4444");
    return;
  }

  const coords = data.routes[0].geometry.coordinates;

  const layerGroup = L.layerGroup();

  // =========================
  // 🎬 ANIMATED + COLORED ROUTE
  // =========================
  let i = 0;

  function drawNext() {
    if (i >= coords.length - 1) return;

    const start = coords[i];
    const end = coords[i + 1];

    const segment = turf.lineString([start, end]);

    let segmentRisk = "low";

    Layers.barangays.eachLayer(layer => {
      try {
        if (!layer.feature || !layer.feature.geometry) return;

        const type = layer.feature.geometry.type;
        if (type !== "Polygon" && type !== "MultiPolygon") return;

        const intersects = turf.booleanIntersects(segment, layer.feature);

        if (intersects) {
          const flood = layer.feature.properties.flood_level;

          if (flood === "High") segmentRisk = "high";
          else if (flood === "Medium" && segmentRisk !== "high") {
            segmentRisk = "medium";
          }
        }
      } catch {
        return;
      }
    });

    let color = "#22c55e";
    if (segmentRisk === "high") color = "#dc2626";
    else if (segmentRisk === "medium") color = "#facc15";

    // 🔥 OUTLINE (WHITE FOR VISIBILITY)
    const outline = L.polyline(
      [
        [start[1], start[0]],
        [end[1], end[0]]
      ],
      {
        color: "#ffee00",
        weight: 10,
        opacity: 1
      }
    );

    // 🔥 MAIN LINE
    const mainLine = L.polyline(
      [
        [start[1], start[0]],
        [end[1], end[0]]
      ],
      {
        color: color,
        weight: 5,
        opacity: 1
      }
    );

    layerGroup.addLayer(outline);
    layerGroup.addLayer(mainLine);

    i++;
    setTimeout(drawNext, 8); // 🔥 animation speed
  }

  drawNext();

  // 🔥 ADD TO MAP
  layerGroup.addTo(map);
  window.coloredRouteLayer = layerGroup;

  // =========================
  // 🧠 AI EXPLANATION
  // =========================
  let explanation = [];

  if (window.routeRiskLevel === "High") {
    explanation.push("⚠️ Route avoids high flood risk areas");
  } else if (window.routeRiskLevel === "Moderate") {
    explanation.push("⚠️ Moderate flood zones minimized");
  } else {
    explanation.push("✅ Route passes through safer areas");
  }

  if (window.WIND_DIRECTION) {
    explanation.push(`🌬 Wind direction: ${window.WIND_DIRECTION}`);
  }

  if (window.bestRouteDistance > 5) {
    explanation.push("📏 Slightly longer route chosen for safety");
  } else {
    explanation.push("📏 Shortest safe route selected");
  }

  let riskScore = 100;

  // subtract penalties
  if (window.routeRiskLevel === "High") riskScore -= 50;
  else if (window.routeRiskLevel === "Moderate") riskScore -= 25;

  if (window.bestRouteDistance > 5) riskScore -= 10;

  if (window.WIND_DIRECTION) riskScore -= 10;

  // clamp
  riskScore = Math.max(0, Math.min(100, riskScore));

  // rating
  let safetyLabel = "Safe";
  if (riskScore < 40) safetyLabel = "High Risk";
  else if (riskScore < 70) safetyLabel = "Moderate Risk";
  // =========================
  // 📊 POPUP
  // =========================
  const initial = window.initialShelter;
  const best = shelter;

  let comparisonHTML = `
🏠 <b>Best Shelter</b><br>
${best.name}<br>
📏 Distance: ${window.bestRouteDistance || "?"} km<br>
⏱️ ETA: ${window.bestRouteTime || "?"} mins<br>
🚨 Risk Level: <b>${window.routeRiskLevel || "Unknown"}</b><br>
📊 <b>Risk Score:</b> ${riskScore}/100<br>
🛡️ <b>Safety:</b> ${safetyLabel}
<hr>
🧠 <b>Why this route?</b><br>
${explanation.join("<br>")}
`;

  // 🔥 ALWAYS SHOW COMPARISON
  if (initial) {
    comparisonHTML += `
<hr>
🟡 <b>Initial (Nearest)</b><br>
${initial.name}<br>
📏 Distance: ${initial.distance?.toFixed(2) || "N/A"} km
`;

    const bestDist = parseFloat(window.bestRouteDistance || 0);
    const diff = initial.distance - bestDist;

    comparisonHTML += `
<hr>
⚖️ <b>Difference:</b> ${Math.abs(diff).toFixed(2)} km<br>
${diff > 0
        ? "✅ More efficient route selected"
        : diff < 0
          ? "⚠️ Slightly longer but safer"
          : "📍 Same shelter selected (optimal choice)"}
`;
  }

  // 🔥 MARKER
  window.destinationMarker = L.marker([shelter.lat, shelter.lng])
    .addTo(map)
    .bindPopup(comparisonHTML)
    .openPopup();

  // 🔥 USER POPUP
  L.popup()
    .setLatLng(userLatLng)
    .setContent(comparisonHTML)
    .openOn(map);

  // 🔥 STORE DATA
  window.currentRouteData = {
    shelter: shelter.name,
    distance: window.bestRouteDistance,
    time: window.bestRouteTime,
    risk: window.routeRiskLevel
  };
}

function animateRoute(coords, layerGroup) {
  let i = 0;

  function drawNext() {
    if (i >= coords.length - 1) return;

    const start = coords[i];
    const end = coords[i + 1];

    const line = L.polyline(
      [
        [start[1], start[0]],
        [end[1], end[0]]
      ],
      {
        color: "#3b82f6",
        weight: 6,
        opacity: 1
      }
    );

    layerGroup.addLayer(line);

    i++;
    setTimeout(drawNext, 10); // speed (lower = faster)
  }

  drawNext();
}

function triggerSystemAlert(message) {
  const chatBox = document.getElementById("chatBox");
  if (!chatBox) return;

  chatBox.innerHTML += `<div class="chat-ai"><span>⚠️ ${message}</span></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function recomputeRoute() {
  if (window.isRouting) {
    alert("Route calculation in progress. Please wait.");
    return;
  }

  triggerSystemAlert("Recomputing route based on updated conditions...");

  if (!window.userMarker) {
    alert("Please select your location first");
    return;
  }

  if (!window.allFacilities || window.allFacilities.length === 0) {
    alert("Evacuation facilities data not loaded");
    return;
  }

  const userLatLng = window.userMarker.getLatLng();

  let nearest = null;
  let minDist = Infinity;

  window.allFacilities.forEach(f => {
    if (f.type !== "evacuation") return;

    const dist = getDistance(
      userLatLng.lat,
      userLatLng.lng,
      f.lat,
      f.lng
    );

    if (dist < minDist) {
      minDist = dist;
      nearest = f;
    }
  });

  if (nearest) {
    // 🔥 RESET INITIAL SHELTER
    window.initialShelter = {
      ...nearest,
      distance: minDist
    };
  }

  // 🔥 THEN RUN SMART ROUTE
  findBestShelterByRoute();
}

/* =========================
   ENTER SYSTEM (MANUAL MODE)
========================= */
function enterSystem() {
  const select = document.getElementById("barangaySelect");

  if (!select.value) {
    alert("Please select your barangay from the dropdown");
    select.focus();
    return;
  }

  window.selectedBarangay = select.value;

  // 🔥 Hide login overlay
  const overlay = document.getElementById("loginOverlay");
  if (overlay) overlay.style.display = "none";

  // 🔥 WAIT FOR LAYERS PROPERLY with timeout
  let attempts = 0;
  const maxAttempts = 50; // 15 seconds max

  const waitForLayers = setInterval(() => {
    attempts++;

    if (attempts >= maxAttempts) {
      clearInterval(waitForLayers);
      console.error("❌ Timeout waiting for layers to load");
      alert("Map is taking longer than expected to load. Please refresh the page.");
      return;
    }

    if (window.layersReady && Layers.barangays) {
      clearInterval(waitForLayers);

      console.log("✅ Layers ready → focusing barangay");

      if (window.focusBarangay) {
        window.focusBarangay();
      } else {
        console.warn("focusBarangay not found");
      }
    }

  }, 300);
}

/* =========================
   GLOBAL EXPORTS
========================= */
window.askAI = askAI;
window.fetchRiskAnalysis = fetchRiskAnalysis;
window.showInfo = showInfo;
window.useMyLocation = useMyLocation;
window.showManualSelection = showManualSelection;
window.initLocationDetection = initLocationDetection;
window.selectBarangay = selectBarangay;
window.findNearestShelter = findNearestShelter;
window.showEvacuationRoute = showEvacuationRoute;
window.findBestShelterByRoute = findBestShelterByRoute;
window.recomputeRoute = recomputeRoute;
window.enterSystem = enterSystem;
window.openHotlines = openHotlines;
window.closeHotlines = closeHotlines;
window.openReport = openReport;
window.closeReport = closeReport;
window.submitReport = submitReport;
window.triggerSystemAlert = triggerSystemAlert;

/* =========================
   KEYBOARD SUPPORT
========================= */
// Add Enter key support for chat
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        askAI();
      }
    });
  }
});