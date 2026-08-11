# Quick Reference Guide - Smart City Lipa Improvements

## 🎯 What Was Fixed

### 1. Evacuation Route Colors ✅
**Problem:** Routes showed gray (unknown risk)  
**Fix:** Load GeoJSON directly for geometry data  
**Result:** Green/Yellow/Red colored segments based on risk

### 2. Wind-Based Ashfall Risk ✅
**Problem:** Wrong risk levels for wind directions  
**Fix:** Corrected wind logic (ashfall goes opposite to wind)  
**Result:** Accurate risk based on wind direction and speed

### 3. AI Emergency Advisor ✅
**Problem:** Generic responses, no role awareness  
**Fix:** Updated system prompt to match old app.py  
**Result:** Clear, safety-focused, 2-sentence responses

---

## 🧪 Quick Test

### Test 1: Route Colors
1. Click location button
2. Click "Show Route"
3. ✅ Should see colored segments (not gray)

### Test 2: Wind Risk
1. **Refresh browser** (Ctrl+F5)
2. Select **West** wind
3. ✅ Ashfall risk should be "Very High"
4. Select **Southeast** wind
5. ✅ Ashfall risk should be "Very Low"

### Test 3: AI Chatbot
1. Ask: "Is my area safe?"
2. ✅ Should get 2 short sentences
3. ✅ Should mention specific risks

---

## 📍 Taal Volcano Location

**Coordinates:** 14.0106°N, 120.9975°E  
**Distance from Lipa:** ~23 km  
**Direction:** Lipa is East-Southeast of Taal

---

## 🌪️ Wind Direction Logic

**Key Concept:** Wind direction = WHERE wind COMES FROM

| Wind From | Ashfall Goes TO | Lipa Risk |
|-----------|----------------|-----------|
| **West** | East | **Very High** ✅ |
| **Northwest** | Southeast | **Very High** ✅ |
| **North** | South | Low |
| **Southeast** | Northwest | Very Low |

**Why West = High Risk?**
- West wind blows **East**
- Lipa is **East-Southeast** of Taal
- = **Directly downwind!**

---

## 📁 Key Files

### Frontend
- `frontend/src/components/map/EvacuationRoute.jsx` - Route display
- `frontend/src/utils/ashfallCalculator.js` - Wind risk calculation

### Backend
- `backend/services/windAshfallService.js` - Wind-based risk API
- `backend/services/chatbotService.js` - AI advisor
- `backend/controllers/aiController.js` - API endpoints
- `backend/routes/aiRoutes.js` - Routes

### Data
- `frontend/public/data/lipa_barangays_risk_fixed.geojson` - Barangay geometry

---

## 🔧 API Endpoints

### Wind-Based Ashfall Risk
```bash
POST /api/ai/ashfall-risk
{
  "latitude": 13.9411,
  "longitude": 121.1631,
  "wind_direction": "W",
  "wind_speed": 60
}
```

### AI Chatbot
```bash
POST /api/ai/chatbot
{
  "question": "Is my area safe?",
  "hazard_data": {
    "flood_risk": "Medium",
    "ashfall_risk": "High",
    "wind_direction": "W"
  }
}
```

---

## 📖 Full Documentation

1. `COMPLETE_SESSION_SUMMARY.md` - Complete overview
2. `EVACUATION_ROUTE_FIX_COMPLETE.md` - Route fix details
3. `WIND_ASHFALL_RISK_COMPLETE.md` - Wind risk system
4. `ASHFALL_LOGIC_FIX.md` - Frontend logic fix
5. `AI_EMERGENCY_ADVISOR_FIX.md` - Chatbot fix

---

## ⚠️ Important Notes

1. **Refresh browser** after updates (Ctrl+F5)
2. **Backend must be running** for AI features
3. **GROQ_API_KEY** must be configured in `.env`
4. **Wind direction** = where wind comes FROM (not TO)

---

## ✅ Status

All systems operational! 🚀
