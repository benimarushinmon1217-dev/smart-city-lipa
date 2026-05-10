
/* =========================
   MAP PANE
========================= */
map.createPane("barangayPane");
map.getPane("barangayPane").style.zIndex = 450;

/* =========================
   SAFE PROPERTY ACCESS
========================= */
function getProp(p, names) {
  for (const n of names) {
    if (p[n] !== undefined && p[n] !== null) return p[n];
  }
  return null;
}

/* =========================
   NAME NORMALIZER
========================= */
function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");
}

/* =========================
   ICONS
========================= */
const userLocationIcon = L.icon({
  iconUrl: "/images/location.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});
window.userLocationIcon = userLocationIcon;

function getFacilityIcon(type) {
  let iconUrl = "/images/evacuation.png";

  if (type === "school") iconUrl = "/images/school.png";
  else if (type === "church") iconUrl = "/images/church.png";
  else if (type === "government") iconUrl = "/images/government.png";

  return L.icon({
    iconUrl,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -45]
  });
}

function getHealthIcon(type) {
  let iconUrl = "/images/hospital.png";
  if (type === "clinic") iconUrl = "/images/clinic.png";

  return L.icon({
    iconUrl,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -45]
  });
}

/* =========================
   BASE STYLE
========================= */
const barangayBaseStyle = {
  pane: "barangayPane",
  color: "#2563eb",
  weight: 1.5,
  fillColor: "#60a5fa",
  fillOpacity: 0.4
};

/* =========================
   GLOBALS
========================= */
let lipaBoundary = null;
let q50 = null;
let q80 = null;
let userMarker = null;
let selectedLayer = null;
let blinkInterval = null;

/* =========================
    TAAL & DISTANCE
========================= */
// 🌋 TAAL VOLCANO REFERENCE
const TAAL = {
  lat: 14.0026,
  lng: 120.9939
};
// 📏 DISTANCE CALCULATION (KM)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
// 🧭 GET BEARING (ANGLE)
function getBearing(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const toDeg = (rad) => rad * 180 / Math.PI;

  const dLng = toRad(lng2 - lng1);

  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
// 🌬 CHECK IF BARANGAY IS DOWNWIND
function getWindAlignment(bearing) {
  const directions = {
    North: 0,
    North_East: 45,
    East: 90,
    South_East: 135,
    South: 180,
    South_West: 225,
    West: 270,
    North_West: 315
  };

  const windAngle = directions[WIND_DIRECTION];

  const diff = Math.abs(bearing - windAngle);

  // normalize angle difference
  const angleDiff = Math.min(diff, 360 - diff);

  // within 45° = strong alignment
  if (angleDiff <= 45) return 1.5;

  // within 90° = moderate
  if (angleDiff <= 90) return 1.0;

  // opposite direction = weak
  return 0.5;
}
// 🌬 WIND SETTINGS
let WIND_DIRECTION = "E";
window.WIND_DIRECTION = WIND_DIRECTION;
/* =========================
   LAYER VISIBILITY
========================= */
function applyLayerVisibility() {

  // ✅ BARANGAYS
  if (Layers.barangays) {
    if (document.getElementById("barangayLayer")?.checked) {
      Layers.barangays.addTo(map);
    } else {
      map.removeLayer(Layers.barangays);
    }
  }

  // 🌊 FLOOD vs 🌋 ASHFALL SWITCH
  if (Layers.barangays) {

    if (document.getElementById("ashfallLayer")?.checked) {

      Layers.barangays.setStyle(barangayAshfallStyle);

    } else if (document.getElementById("floodLayer")?.checked) {

      Layers.barangays.setStyle(barangayFloodStyle);

    } else {
      Layers.barangays.setStyle(barangayBaseStyle);
    }
  }


  // ✅ POBLACION
  if (Layers.poblacion) {
    document.getElementById("poblacionLayer")?.checked
      ? Layers.poblacion.addTo(map)
      : map.removeLayer(Layers.poblacion);
  }

  // ✅ FACILITIES
  if (Layers.facilities) {
    document.getElementById("facilityLayer")?.checked
      ? Layers.facilities.addTo(map)
      : map.removeLayer(Layers.facilities);
  }

  // ✅ HEALTHCARE
  if (Layers.healthcare) {
    document.getElementById("healthLayer")?.checked
      ? Layers.healthcare.addTo(map)
      : map.removeLayer(Layers.healthcare);
  }
}

/* =========================
   FLOOD STYLE
========================= */
function barangayFloodStyle(feature) {
  const score = feature.properties._risk_score;

  const q50 = window.flood_q50 || 0;
  const q80 = window.flood_q80 || 0;

  let risk = "Low";
  if (score >= q80) risk = "High";
  else if (score >= q50) risk = "Medium";

  feature.properties.flood_level = risk;

  return {
    pane: "barangayPane",
    color: "#000",
    weight: 2,
    fillColor:
      risk === "High" ? "#dc2626" :
        risk === "Medium" ? "#f97316" :
          "#22c55e",
    fillOpacity: 0.3
  };
}
/* =========================
    ASHFALL STYLE
========================= */
function barangayAshfallStyle(feature) {
  const level = feature.properties.ashfall_level;

  return {
    pane: "barangayPane",
    color: "#000",
    weight: 2,
    fillColor:
      level === "Very High" ? "#7f1d1d" :
        level === "High" ? "#dc2626" :
          level === "Moderate" ? "#f97316" :
            "#22c55e",
    fillOpacity: 0.4
  };
}
/* =========================
   HIGHLIGHT
========================= */
function highlightLayer(layer) {
  if (selectedLayer) {
    clearInterval(blinkInterval);

    // ✅ FIX: restore correct style, NOT default
    if (document.getElementById("ashfallLayer")?.checked) {
      selectedLayer.setStyle(barangayAshfallStyle(selectedLayer.feature));
    } else {
      selectedLayer.setStyle(barangayFloodStyle(selectedLayer.feature));
    }
  }

  selectedLayer = layer;

  let visible = true;

  blinkInterval = setInterval(() => {
    if (!selectedLayer) return;

    selectedLayer.setStyle({
      weight: visible ? 5 : 2,
      color: visible ? "#facc15" : "#000",
      fillOpacity: visible ? 0.5 : 0.3
    });

    visible = !visible;
  }, 500);
}

/* =========================
   LOAD BARANGAYS
========================= */
fetch("/data/lipa_barangays_risk_fixed.geojson")
  .then(r => r.json())
  .then(data => {

    // ==========================
    // 1. SCORE LOOP
    // ==========================
    data.features.forEach(f => {
      const p = f.properties;

      const elev = getProp(p, ["mean_elev", "elev_mean", "elevation"]);
      const dist = getProp(p, ["dist_water", "distance", "hub_dist"]);

      const floodScore = (elev ? 1 / elev : 0) + (dist ? 1 / dist : 0);

      // 🌋 ASHFALL (SAFE COMPUTE)
      let center;

      try {
        if (!f || !f.geometry) return;

        const type = f.geometry.type;

        // 🔥 ONLY allow polygons
        if (type !== "Polygon" && type !== "MultiPolygon") return;

        center = turf.centerOfMass(f).geometry.coordinates;
      } catch (e) {
        console.warn("⚠️ Invalid geometry skipped:", f);
        return;
      }

      const bLat = center[1];
      const bLng = center[0];

      const taalDist = getDistance(bLat, bLng, TAAL.lat, TAAL.lng);
      const bearing = getBearing(TAAL.lat, TAAL.lng, bLat, bLng);
      const windFactor = getWindAlignment(bearing);

      // 🔥 SMOOTH DISTANCE DECAY
      const base = Math.max(0, 3 - (taalDist / 40));

      // 🔥 BETTER WIND INFLUENCE
      const adjusted = base * (0.3 + windFactor * 0.7);

      // 🔥 CLASSIFICATION
      let ashfallLevel = "Low";
      if (adjusted >= 2.3) ashfallLevel = "Very High";
      else if (adjusted >= 1.6) ashfallLevel = "High";
      else if (adjusted >= 1.0) ashfallLevel = "Moderate";

      // ✅ SAVE
      p._flood_score = floodScore;
      p._ashfall_score = adjusted;

      p.ashfall_level = ashfallLevel;
      p.taal_distance = taalDist;

      // DEFAULT = flood
      p._risk_score = floodScore;
    });
    // ==========================
    // 2. CREATE ARRAYS (THIS IS WHERE floodScores IS DECLARED)
    // ==========================
    const floodScores = [];

    data.features.forEach(f => {
      floodScores.push(f.properties._flood_score);
    });

    // ==========================
    // 3. SORT
    // ==========================
    floodScores.sort((a, b) => a - b);

    // ==========================
    // 4. 👉 PASTE YOUR FIX HERE (INSIDE SAME BLOCK)
    // ==========================
    const midIndex = Math.floor(floodScores.length * 0.5);
    const highIndex = Math.floor(floodScores.length * 0.8);

    const q50_raw = floodScores[midIndex];
    const q80_raw = floodScores[highIndex];

    window.flood_q50 = Math.min(q50_raw, q80_raw);
    window.flood_q80 = Math.max(q50_raw, q80_raw);

    console.log("FIXED Q50:", window.flood_q50);
    console.log("FIXED Q80:", window.flood_q80);
    // ==========================
    // 🗺️ CREATE LAYER
    // ==========================
    Layers.barangays = L.geoJSON(data, {
      style: barangayFloodStyle,
      onEachFeature: (f, l) => {

        l.on("click", async () => {

          highlightLayer(l);

          try {
            if (typeof window.selectBarangay === "function") {
              window.selectBarangay(l);
              return;
            }
          } catch (err) {
            console.warn("⚠️ selectBarangay failed, fallback used", err);
          }

          // 🔥 FALLBACK
          const rawName = f.properties.ADM4_EN || f.properties.name || "Unknown Barangay";

          let center;

          try {
            if (!f || !f.geometry) return;

            const type = f.geometry.type;

            // 🔥 ONLY allow polygons
            if (type !== "Polygon" && type !== "MultiPolygon") return;

            center = turf.centerOfMass(f).geometry.coordinates;
          } catch (e) {
            console.warn("⚠️ Invalid geometry skipped:", f);
            return;
          }

          const latlng = [center[1], center[0]];

          map.flyTo(latlng, 15, { duration: 1.2 });

          if (userMarker) map.removeLayer(userMarker);

          userMarker = L.marker(latlng, { icon: userLocationIcon }).addTo(map);
          window.userMarker.bindPopup(`<b>${rawName}</b><br>Your selected location`).openPopup();

          window.currentFeature = f;
          window.currentData = {
            risk: f.properties.flood_level || "Unknown",
            elevation: f.properties.mean_elev || "Unknown",
            distance: f.properties.dist_water || "Unknown",
            ashfall: f.properties.ashfall_level || "Unknown"
          };

          document.getElementById("placeName").innerText = rawName;

          const formattedName = normalizeName(rawName);
          const img = document.getElementById("placeImage");

          img.src = `/images/${formattedName.toLowerCase()}.jpg`;
          img.onerror = () => {
            img.onerror = null;
            img.src = "/images/default.jpg";
          };

          const elev = f.properties.mean_elev || 0;
          const dist = f.properties.dist_water || 0;
          const score = (elev ? 1 / elev : 0) + (dist ? 1 / dist : 0);

          const backendData = await fetchRiskAnalysis({
            _risk_score: score,
            q50: window.flood_q50,
            q80: window.flood_q80
          });

          showInfo(f, backendData);
        });

      }
    }).addTo(map);

    map.fitBounds(Layers.barangays.getBounds());

    loadPoblacion();
    loadFacilities();
    loadHealthcare();

    window.layersReady = true;
    console.log("✅ Layers fully loaded (Flood Mode Default)");
    console.log("Flood Q50:", window.flood_q50);
    console.log("Flood Q80:", window.flood_q80);
  });
/* =========================
   LOAD POBLACION
========================= */
function loadPoblacion() {
  fetch("/data/poblacion_barangays.geojson")
    .then(r => r.json())
    .then(data => {

      const inside = data.features.filter(f => {
        const p = f.properties;

        // 🔥 ADJUST THIS BASED ON YOUR DATA
        const city =
          p.city ||
          p.ADM3_EN ||
          p.municipality ||
          p.NAME_2 ||
          "";

        return city.toLowerCase().includes("lipa");
      });

      Layers.poblacion = L.geoJSON(inside, {
        style: {
          color: "#9333ea",
          weight: 4,
          fillColor: "#c084fc",
          fillOpacity: 0.4
        }
      });

      applyLayerVisibility();
    })
    .catch(err => {
      console.error("❌ Failed to load poblacion:", err);
    });
}
/* =========================
   LOAD FACILITIES
========================= */
function loadFacilities() {

  const facilitiesData = [
    // 🏫 SCHOOLS
    { name: "Lipa City Science High School", lat: 13.9424405, lng: 121.1569543, type: "school" },
    { name: "Mabini College", lat: 13.9475772, lng: 121.1613498, type: "school" },
    { name: "Inosluban Elementary School", lat: 13.9756996, lng: 121.1675839, type: "school" },
    { name: "Fernando Air Base Elementary School", lat: 13.9533632, lng: 121.1335259, type: "school" },
    { name: "Marawoy Elementary School", lat: 13.9583256, lng: 121.1655746, type: "school" },
    { name: "Lodlod Elementary School", lat: 13.9296396, lng: 121.1425794, type: "school" },
    { name: "Tambo Elementary School", lat: 13.9438250, lng: 121.1346910, type: "school" },
    { name: "Pinagtongulan Elementary School", lat: 13.919209, lng: 121.082847, type: "school" },
    { name: "San Jose Integrated School", lat: 13.9402977, lng: 121.1852510, type: "school" },
    { name: "Bulacnin National High School", lat: 13.9814424, lng: 121.1418944, type: "school" },
    { name: "Banaybanay Elementary School", lat: 13.9358800, lng: 121.1185109, type: "school" },
    { name: "San Carlos Elementary School", lat: 13.9488013, lng: 121.1518464, type: "school" },
    { name: "Tangway Elementary School", lat: 13.9762596, lng: 121.1386640, type: "school" },

    // ⛪ CHURCHES
    { name: "San Sebastian Cathedral", lat: 13.9409697, lng: 121.1634241, type: "church" },
    { name: "Divina Pastora Parish", lat: 13.9403195, lng: 121.1381551, type: "church" },
    { name: "Mary Mediatrix Parish", lat: 13.9256822, lng: 121.1718097, type: "church" },

    // 🏛️ GOVERNMENT
    { name: "Lipa City Youth Center", lat: 13.9413325, lng: 121.1574435, type: "government" },

    // 🏠 EVACUATION
    { name: "Lipa City Gymnasium", lat: 13.9357779, lng: 121.1612630, type: "evacuation" },
    { name: "Bagong Pook Covered Court", lat: 13.9561390, lng: 121.1054234, type: "evacuation" },
    { name: "Tambo Covered Court", lat: 13.9385435, lng: 121.1376377, type: "evacuation" },
    { name: "Banaybanay Covered Court", lat: 13.9381715, lng: 121.1185783, type: "evacuation" }
  ];

  // ✅ Properly declare global variable
  if (!window.allFacilities) {
    window.allFacilities = [];
  }
  window.allFacilities = facilitiesData;

  Layers.facilities = L.layerGroup();

  facilitiesData.forEach(f => {
    const marker = L.marker([f.lat, f.lng], {
      icon: getFacilityIcon(f.type)
    });

    marker.bindPopup(`<b>${f.name}</b><br>Type: ${f.type}`);

    Layers.facilities.addLayer(marker);
  });

  applyLayerVisibility();
}

/* =========================
   LOAD HEALTHCARE
========================= */
function loadHealthcare() {

  const healthData = [
    { name: "Lipa City District Hospital", lat: 13.9337340, lng: 121.1585559, type: "hospital" },
    { name: "Mary Mediatrix Medical Center", lat: 13.9439363, lng: 121.1522819, type: "hospital" },
    { name: "Metro Lipa Medical Center", lat: 13.9683134, lng: 121.1664929, type: "hospital" },
    { name: "San Antonio Medical Center", lat: 13.9421942, lng: 121.1650442, type: "hospital" },
    { name: "Lipa Medix Medical Center", lat: 13.9476904, lng: 121.1569536, type: "hospital" },
    { name: "Ospital ng Lipa", lat: 13.9569427, lng: 121.1623754, type: "hospital" },

    // Health Centers
    { name: "Lipa Main Health Center", lat: 13.9405076, lng: 121.1594618, type: "clinic" },
    { name: "Brgy. Sabang Health Center", lat: 13.9463804, lng: 121.1677160, type: "clinic" },
    { name: "North District Health Center", lat: 13.9789505, lng: 121.1679306, type: "clinic" },
    { name: "South District Health Center", lat: 13.9234905, lng: 121.1491394, type: "clinic" },
    { name: "Brgy. Anilao Health Center", lat: 13.9049053, lng: 121.1731254, type: "clinic" },
    { name: "Brgy. Bolbok Health Center", lat: 13.9229320, lng: 121.1484712, type: "clinic" }
  ];

  Layers.healthcare = L.layerGroup();

  healthData.forEach(h => {
    const marker = L.marker([h.lat, h.lng], {
      icon: getHealthIcon(h.type)
    });

    marker.bindPopup(`<b>${h.name}</b><br>Type: ${h.type}`);

    Layers.healthcare.addLayer(marker);
  });

  applyLayerVisibility();
}

/* =========================
   MANUAL BARANGAY FOCUS
========================= */
window.focusBarangay = function () {
  if (!window.selectedBarangay || !Layers.barangays) return;

  let found = false;

  Layers.barangays.eachLayer(layer => {
    const name = layer.feature.properties.ADM4_EN || layer.feature.properties.name;

    if (name === window.selectedBarangay) {
      found = true;

      // 🔥 USE SAME FLOW AS USER CLICK
      layer.fire("click");
    }
  });

  if (!found) {
    console.warn("⚠️ Barangay not found:", window.selectedBarangay);
  }
};
window.changeWind = function (newDir) {
  WIND_DIRECTION = newDir;
  window.WIND_DIRECTION = newDir;

  console.log("🌬 Wind changed to:", newDir);

  // 🔥 Trigger system alert
  if (window.triggerSystemAlert) {
    triggerSystemAlert("Wind direction changed. Route conditions updated.");
  }

  if (!Layers.barangays) return;

  // 🔥 Recalculate ALL barangay scores
  Layers.barangays.eachLayer(layer => {
    const f = layer.feature;
    const p = f.properties;

    const elev = p.mean_elev || 0;
    const dist = p.dist_water || 0;

    const floodScore = (elev ? 1 / elev : 0) + (dist ? 1 / dist : 0);

    let center;

    try {
      if (!f || !f.geometry) return;

      const type = f.geometry.type;

      // 🔥 ONLY allow polygons
      if (type !== "Polygon" && type !== "MultiPolygon") return;

      center = turf.centerOfMass(f).geometry.coordinates;
    } catch (e) {
      console.warn("⚠️ Invalid geometry skipped:", f);
      return;
    }

    const bLat = center[1];
    const bLng = center[0];

    const taalDist = getDistance(bLat, bLng, TAAL.lat, TAAL.lng);

    const bearing = getBearing(TAAL.lat, TAAL.lng, bLat, bLng);
    const windFactor = getWindAlignment(bearing);

    let ashfallScore = 0;
    let ashfallLevel = "Low";

    // 🔥 BASE DISTANCE ZONE
    let base = 0;

    if (taalDist < 20) base = 3;
    else if (taalDist < 50) base = 2;
    else if (taalDist < 100) base = 1;

    // 🔥 APPLY WIND
    const adjusted = base * windFactor;

    // 🔥 CLASSIFICATION
    if (adjusted >= 2.5) ashfallLevel = "Very High";
    else if (adjusted >= 1.8) ashfallLevel = "High";
    else if (adjusted >= 1.2) ashfallLevel = "Moderate";
    else ashfallLevel = "Low";

    // 🔥 SCORE
    ashfallScore = adjusted;

    // ✅ SAVE
    p.ashfall_level = ashfallLevel;
    p.taal_distance = taalDist;

    p._flood_score = floodScore;
    p._ashfall_score = ashfallScore;
  });

  // 🔥 Recompute thresholds
  const floodScores = [];
  const ashfallScores = [];

  Layers.barangays.eachLayer(l => {
    floodScores.push(l.feature.properties._flood_score);
    ashfallScores.push(l.feature.properties._ashfall_score);
  });

  floodScores.sort((a, b) => a - b);
  ashfallScores.sort((a, b) => a - b);

  // ✅ Update flood thresholds
  window.flood_q50 = floodScores[Math.floor(floodScores.length * 0.5)];
  window.flood_q80 = floodScores[Math.floor(floodScores.length * 0.8)];

  // ✅ Update ashfall thresholds
  window.ashfall_q50 = ashfallScores[Math.floor(ashfallScores.length * 0.5)];
  window.ashfall_q80 = ashfallScores[Math.floor(ashfallScores.length * 0.8)];

  // 🔄 Just refresh properly
  applyLayerVisibility();

  // recompute ashfall...

  // ✅ APPLY STYLE PER LAYER
  Layers.barangays.eachLayer(layer => {
    const f = layer.feature;

    if (document.getElementById("ashfallLayer")?.checked) {
      layer.setStyle(barangayAshfallStyle(f));
    } else {
      layer.setStyle(barangayFloodStyle(f));
    }
  });

  // 🔄 refresh UI
  if (window.currentFeature) {
    showInfo(window.currentFeature);
  }

  // 🔥 AUTO RECOMPUTE ROUTE AFTER WIND CHANGE
  if (window.userMarker && window.lastBestShelter) {
    console.log("♻️ Recomputing route due to wind change...");
    findBestShelterByRoute();
  }
  console.log("✅ Map + UI updated");
};

applyLayerVisibility();

/* =========================
   TOGGLES
========================= */
document.getElementById("barangayLayer").onchange = applyLayerVisibility;
document.getElementById("floodLayer").onchange = applyLayerVisibility;
document.getElementById("facilityLayer").onchange = applyLayerVisibility;
document.getElementById("healthLayer").onchange = applyLayerVisibility;
document.getElementById("poblacionLayer").onchange = applyLayerVisibility;
document.getElementById("ashfallLayer").onchange = applyLayerVisibility;