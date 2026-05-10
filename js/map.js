const map = L.map("map").setView([13.9411, 121.1631], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

window.Layers = {};
window.selectedBarangay = null;

/* =========================
   SIDEBAR TOGGLE
========================= */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

/* =========================
   LOAD BARANGAY LIST
========================= */
fetch("data/lipa_barangays_risk_fixed.geojson")
  .then(r => r.json())
  .then(data => {
    const select = document.getElementById("barangaySelect");

    data.features.forEach(f => {
      const name = f.properties.ADM4_EN || f.properties.name;

      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;

      select.appendChild(option);
    });
  });

/* =========================
   ENTER SYSTEM (MANUAL MODE)
========================= */
// Note: enterSystem is now defined in utils.js to avoid duplication