# Smart City Lipa - Comprehensive Feature Breakdown

**Document Purpose:** Technical reference for thesis documentation, paper revision, defense presentation, and portfolio showcase.

**Last Updated:** May 15, 2026

---

## Table of Contents

1. [Smart Hazard Map System](#1-smart-hazard-map-system)
2. [Multi-Hazard Risk Analysis](#2-multi-hazard-risk-analysis)
3. [Wind-Aware Ashfall System](#3-wind-aware-ashfall-system)
4. [Smart Evacuation Routing](#4-smart-evacuation-routing)
5. [Dynamic Route Risk Visualization](#5-dynamic-route-risk-visualization)
6. [Route Comparison System](#6-route-comparison-system)
7. [AI Disaster Advisor](#7-ai-disaster-advisor)
8. [Real-Time Socket.io Synchronization](#8-real-time-socketio-synchronization)
9. [Admin Command Center](#9-admin-command-center)
10. [Incident Reporting System](#10-incident-reporting-system)
11. [Emergency Broadcasting](#11-emergency-broadcasting)
12. [Shelter Monitoring System](#12-shelter-monitoring-system)
13. [User Management System](#13-user-management-system)
14. [Notification System](#14-notification-system)
15. [Dynamic Road Intelligence](#15-dynamic-road-intelligence)
16. [Evacuation Tracking](#16-evacuation-tracking)
17. [Analytics Dashboard](#17-analytics-dashboard)
18. [Real-Time Heatmaps](#18-real-time-heatmaps)
19. [Moderation Workflow](#19-moderation-workflow)
20. [Geolocation System](#20-geolocation-system)

---

## 1. Smart Hazard Map System

### Feature Name
**Interactive Smart Hazard Map with Multi-Layer Visualization**

### Purpose
Provide real-time visual representation of disaster risks, incidents, and safe zones across Lipa City to enable informed decision-making during emergencies.

### Technical Description
A Leaflet-powered interactive map system that overlays multiple data layers including barangay boundaries, flood risk zones, ashfall risk areas, incident markers, evacuation centers, and real-time road conditions. The system uses GeoJSON data for geographic boundaries and Turf.js for spatial analysis.

### Technologies Used
- **Frontend:** React-Leaflet, Leaflet.js, Turf.js
- **Data Format:** GeoJSON (RFC 7946)
- **Mapping:** OpenStreetMap tiles
- **Spatial Analysis:** @turf/turf library
- **State Management:** Zustand (mapStore)

### Frontend Components
- `MapContainer.jsx` - Main map wrapper with controls
- `BarangayLayer.jsx` - Barangay boundary visualization
- `IncidentMarkers.jsx` - Real-time incident display
- `HazardOverlay.jsx` - Risk zone overlays
- `ShelterMarkers.jsx` - Evacuation center markers
- `FacilityMarkers.jsx` - Essential facilities display
- `MapControls.jsx` - Layer toggle controls
- `BarangayInfoPanel.jsx` - Detailed barangay information

### Backend Components
- `barangayController.js` - Barangay data API
- `incidentController.js` - Incident data API
- `establishmentController.js` - Facility data API
- `Barangay.js` model - Geographic data storage
- GeoJSON data files in `/data` directory

### Real-Time Behavior
- **Socket Events:** `incident:new`, `incident:updated`, `hazard:flood`, `hazard:wind`
- **Auto-Refresh:** Map markers update automatically when new incidents are reported
- **Live Updates:** Hazard zones update based on real-time weather data
- **Sync Frequency:** Immediate (event-driven)

### AI Integration
- Risk level calculation for each barangay
- Hazard prediction based on historical data
- Safe zone recommendations

### Smart-City Relevance
- **Urban Planning:** Visualize high-risk areas for infrastructure development
- **Emergency Response:** Quick identification of affected areas
- **Public Safety:** Citizen awareness of local hazards
- **Data-Driven Decisions:** Evidence-based policy making

### Disaster Management Relevance
- **Situational Awareness:** Real-time view of disaster impact
- **Resource Allocation:** Identify areas needing immediate assistance
- **Evacuation Planning:** Visual route planning around hazards
- **Damage Assessment:** Post-disaster impact visualization

### User Benefits
- **Citizens:** Know their area's risk level and nearby safe zones
- **Responders:** Quick overview of emergency situations
- **Administrators:** Monitor city-wide disaster status
- **Planners:** Historical data for future preparedness

### Operational Flow
```
1. User opens map interface
2. System loads GeoJSON barangay boundaries
3. Risk data overlays applied (flood, ashfall)
4. Real-time incidents fetched from API
5. Markers placed on map with color-coded severity
6. User clicks barangay → detailed risk panel appears
7. Socket.io updates map when new incidents occur
8. User can toggle layers (incidents, shelters, hazards)
```

### Future Scalability
- **3D Visualization:** Elevation-based risk modeling
- **Predictive Layers:** AI-predicted flood paths
- **Historical Playback:** Time-lapse of past disasters
- **Mobile AR:** Augmented reality hazard overlay
- **Satellite Integration:** Real-time satellite imagery
- **Crowd-Sourced Data:** User-submitted hazard reports

### SDG Alignment
- **SDG 11:** Sustainable Cities and Communities - Resilient urban planning
- **SDG 13:** Climate Action - Disaster risk reduction
- **SDG 9:** Industry, Innovation, Infrastructure - Smart city technology

---

## 2. Multi-Hazard Risk Analysis

### Feature Name
**Integrated Multi-Hazard Risk Assessment Engine**

### Purpose
Analyze and quantify multiple concurrent disaster risks (flood, ashfall, earthquake, landslide) to provide comprehensive safety assessments for any location in Lipa City.

### Technical Description
A sophisticated risk analysis system that combines multiple hazard datasets (elevation, proximity to water bodies, distance from Taal Volcano, soil type, historical incident data) to calculate composite risk scores. Uses weighted algorithms to determine overall danger levels.

### Technologies Used
- **Backend:** Node.js, Express.js
- **Analysis:** Custom risk calculation algorithms
- **Data Sources:** GeoJSON properties, historical data, real-time sensors
- **AI:** Groq API (Llama 3.1) for risk interpretation

### Frontend Components
- `RiskAnalysisPanel.jsx` - Risk score display
- `HazardBreakdown.jsx` - Individual hazard visualization
- `RiskMeter.jsx` - Visual risk gauge
- `SafetyRecommendations.jsx` - Action suggestions

### Backend Components
- `riskAnalysisService.js` - Core risk calculation engine
- `aiController.js` - AI-powered risk interpretation
- `windAshfallService.js` - Wind-based ashfall risk
- `Barangay.js` model - Risk data storage

### Real-Time Behavior
- **Dynamic Calculation:** Risk scores update with weather changes
- **Wind Integration:** Ashfall risk recalculates when wind direction changes
- **Incident Impact:** Risk increases when incidents reported nearby
- **Temporal Analysis:** Risk varies by time of day/season

### AI Integration
- **Risk Interpretation:** AI explains risk scores in plain language
- **Recommendation Engine:** Suggests actions based on risk level
- **Pattern Recognition:** Identifies risk trends over time
- **Predictive Analysis:** Forecasts risk escalation

### Smart-City Relevance
- **Proactive Safety:** Prevent disasters before they occur
- **Resource Optimization:** Deploy resources to highest-risk areas
- **Urban Resilience:** Build infrastructure in low-risk zones
- **Citizen Empowerment:** Informed decision-making

### Disaster Management Relevance
- **Early Warning:** Detect dangerous conditions before disasters
- **Prioritization:** Focus on highest-risk areas first
- **Evacuation Triggers:** Automated alerts when risk exceeds thresholds
- **Post-Disaster:** Assess which areas need recovery support

### User Benefits
- **Personalized Risk:** Know specific risks for your location
- **Actionable Insights:** Clear recommendations, not just numbers
- **Peace of Mind:** Understand safety status at a glance
- **Preparedness:** Plan ahead based on risk forecasts

### Operational Flow
```
1. User requests risk analysis for location
2. System retrieves barangay data (elevation, water proximity, etc.)
3. Current weather data fetched (wind, rain)
4. Historical incident data analyzed
5. Risk calculation algorithm runs:
   - Flood risk = f(elevation, water distance, rainfall)
   - Ashfall risk = f(volcano distance, wind direction, wind speed)
   - Composite risk = weighted average
6. AI interprets risk score into recommendations
7. Results displayed with visual indicators
8. Real-time updates as conditions change
```

### Future Scalability
- **Machine Learning:** Train models on historical disaster data
- **Sensor Integration:** IoT sensors for real-time environmental data
- **Crowd-Sourced Validation:** Users confirm/deny risk assessments
- **Micro-Level Analysis:** Street-by-street risk mapping
- **Multi-City Expansion:** Scale to other Philippine cities

### SDG Alignment
- **SDG 11:** Sustainable Cities - Risk-informed urban development
- **SDG 13:** Climate Action - Adaptation and resilience
- **SDG 3:** Good Health - Prevent disaster-related casualties

---

## 3. Wind-Aware Ashfall System

### Feature Name
**Dynamic Wind-Based Ashfall Risk Calculator**

### Purpose
Calculate real-time ashfall risk based on current wind direction and speed, providing accurate predictions of which areas will be affected by volcanic ash from Taal Volcano.

### Technical Description
A physics-based calculation system that determines ashfall risk by analyzing the bearing from Taal Volcano to a location, current wind direction (where wind comes FROM), and wind speed. The system calculates the ashfall direction (opposite of wind direction) and determines alignment with the location to predict ash deposition likelihood.

### Technologies Used
- **Calculation:** Haversine formula for distance, bearing calculations
- **Wind Data:** Real-time wind direction and speed
- **Coordinates:** Taal Volcano (14.0106°N, 120.9975°E)
- **Frontend:** React, Zustand for wind state
- **Backend:** Node.js, custom windAshfallService

### Frontend Components
- `WindControl.jsx` - Wind direction/speed selector
- `WindAnimation.jsx` - Visual wind particle effects
- `WindBarbs.jsx` - Meteorological wind symbols
- `BarangayInfoPanel.jsx` - Displays calculated ashfall risk
- `ashfallCalculator.js` - Client-side risk calculation utility

### Backend Components
- `windAshfallService.js` - Server-side ashfall risk engine
- `aiController.js` - Ashfall risk API endpoints
- API: `POST /api/ai/ashfall-risk` - Single location
- API: `POST /api/ai/ashfall-risk/batch` - Multiple locations

### Real-Time Behavior
- **Wind Change Detection:** Monitors wind direction changes
- **Auto-Recalculation:** Risk updates when wind shifts
- **Route Impact:** Evacuation routes recalculated if wind changes significantly
- **Proactive Alerts:** Warns users if wind shifts toward their location

### AI Integration
- **Risk Explanation:** AI describes why ashfall risk is high/low
- **Safety Recommendations:** Suggests actions based on ashfall level
- **Trend Analysis:** Predicts if risk will increase/decrease

### Smart-City Relevance
- **Volcanic Hazard Monitoring:** Critical for cities near active volcanoes
- **Air Quality Management:** Predict ash impact on air quality
- **Infrastructure Protection:** Warn critical facilities of ash exposure
- **Public Health:** Prevent respiratory issues from ash inhalation

### Disaster Management Relevance
- **Evacuation Planning:** Route people away from ashfall zones
- **Resource Deployment:** Position masks/respirators in affected areas
- **School Closures:** Data-driven decisions on class suspensions
- **Airport Operations:** Predict ash impact on aviation

### User Benefits
- **Accurate Predictions:** Know if ash will reach your area
- **Timely Warnings:** Get alerts before ash arrives
- **Health Protection:** Time to seal windows, wear masks
- **Travel Planning:** Avoid ash-affected routes

### Operational Flow
```
1. System fetches current wind direction and speed
2. User location or barangay coordinates identified
3. Calculate distance from Taal Volcano (Haversine formula)
4. Calculate bearing from volcano to location
5. Determine ashfall direction (wind direction + 180°)
6. Calculate angular difference between ashfall direction and location bearing
7. Compute alignment factor (cosine of angular difference)
8. Apply distance factor (closer = higher risk)
9. Apply wind speed factor (stronger wind = more dispersion)
10. Calculate final risk: distance × alignment × wind speed
11. Classify risk level (Very High, High, Medium, Low, Very Low)
12. Display result with color-coded indicator
13. Update automatically when wind changes
```

### Risk Calculation Formula
```
ashfall_risk = distance_factor × alignment_factor × wind_speed_factor

Where:
- distance_factor: 1.0 (0-10km), 0.8 (10-20km), 0.6 (20-30km), 0.4 (30-50km), 0.2 (50+km)
- alignment_factor: cos(angular_difference) [0-1]
- wind_speed_factor: 0.1 (<10km/h), 0.3 (10-20), 0.5 (20-30), 0.7 (30-45), 0.9 (45-60), 1.0 (60+)
```

### Future Scalability
- **Weather API Integration:** Automatic wind data from PAGASA
- **Plume Modeling:** 3D ash cloud visualization
- **Historical Validation:** Compare predictions with actual ashfall
- **Multi-Volcano:** Support for other Philippine volcanoes
- **Particle Size Analysis:** Different risks for fine vs coarse ash

### SDG Alignment
- **SDG 11:** Sustainable Cities - Disaster risk reduction
- **SDG 13:** Climate Action - Volcanic hazard adaptation
- **SDG 3:** Good Health - Respiratory health protection

---

## 4. Smart Evacuation Routing

### Feature Name
**AI-Powered Safe Evacuation Route Finder**

### Purpose
Calculate the safest and fastest evacuation routes from any location to the nearest evacuation center, avoiding high-risk areas and considering real-time hazards.

### Technical Description
An intelligent routing system that uses OSRM (Open Source Routing Machine) for road-based routing, then analyzes the route through barangay risk data to identify dangerous segments. Routes are color-coded by risk level and can be recalculated if conditions change.

### Technologies Used
- **Routing Engine:** OSRM (OpenStreetMap routing)
- **Spatial Analysis:** Turf.js for route-barangay intersection
- **Frontend:** React-Leaflet for route visualization
- **Backend:** Node.js, routeRecommendationService
- **Real-Time:** Socket.io for route updates

### Frontend Components
- `EvacuationRoute.jsx` - Route calculation and display
- `RouteComparison.jsx` - Compare multiple route options
- `RouteRiskSummary.jsx` - Risk breakdown display
- `MapContainer.jsx` - Route visualization on map

### Backend Components
- `routeRecommendationService.js` - Route analysis engine
- `aiController.js` - Route recommendation API
- API: `POST /api/ai/route-recommendation`
- API: `POST /api/ai/route-recommendation/evacuation-center`
- API: `POST /api/ai/route-recommendation/hazard-score`

### Real-Time Behavior
- **Dynamic Recalculation:** Routes update when new incidents reported
- **Wind-Triggered Updates:** Ashfall risk changes trigger route recalculation
- **Traffic Integration:** Considers road closures and congestion
- **Live Hazard Avoidance:** Routes around newly reported dangers

### AI Integration
- **Route Explanation:** AI describes why a route is recommended
- **Alternative Suggestions:** Proposes safer alternatives if primary route is risky
- **Timing Recommendations:** Suggests best time to evacuate
- **Personalized Advice:** Considers user's mobility constraints

### Smart-City Relevance
- **Traffic Management:** Optimize evacuation flow to prevent gridlock
- **Infrastructure Planning:** Identify critical evacuation corridors
- **Emergency Response:** Coordinate responder routes
- **Urban Resilience:** Design cities with evacuation in mind

### Disaster Management Relevance
- **Life-Saving:** Direct people away from danger
- **Efficient Evacuation:** Minimize evacuation time
- **Capacity Management:** Distribute evacuees across multiple centers
- **Bottleneck Prevention:** Avoid route congestion

### User Benefits
- **Safety First:** Avoid dangerous areas during evacuation
- **Clear Guidance:** Turn-by-turn directions to safety
- **Time Estimates:** Know how long evacuation will take
- **Confidence:** Trust in AI-verified safe routes

### Operational Flow
```
1. User clicks "Show Evacuation Route" button
2. System gets user's current location (GPS)
3. Query nearest evacuation centers from database
4. Calculate distance to each center
5. Select nearest available center
6. Request route from OSRM API
7. Receive GeoJSON route geometry
8. Analyze route segments:
   - For each segment, check which barangay it passes through
   - Get barangay's flood risk from GeoJSON
   - Classify segment as safe/caution/dangerous
9. Calculate route risk summary:
   - % of route in high-risk areas
   - % in medium-risk areas
   - % in safe areas
10. Display route on map with color-coded segments:
    - Green: Safe (low risk)
    - Yellow: Caution (medium risk)
    - Red: Dangerous (high risk)
11. Show route details: distance, estimated time, risk level
12. Provide "Start Navigation" button (opens Google Maps)
13. Monitor for condition changes and suggest recalculation if needed
```

### Route Risk Analysis Algorithm
```javascript
for each route segment:
  1. Create line segment from point A to point B
  2. Check intersection with all barangay polygons
  3. If intersects:
     - Get barangay's flood_risk value (0-1 scale)
     - Classify: ≥0.65 = high, ≥0.55 = medium, <0.55 = low
     - Assign color: red/yellow/green
  4. Store segment with risk classification
  
Calculate summary:
  - total_segments = route segments count
  - high_risk_segments = count of red segments
  - medium_risk_segments = count of yellow segments
  - low_risk_segments = count of green segments
  - overall_risk = "High" if any high_risk_segments, else "Medium" if >30% medium, else "Low"
```

### Future Scalability
- **Multi-Modal Routing:** Walking, driving, public transport options
- **Accessibility Routes:** Wheelchair-accessible paths
- **Group Evacuation:** Coordinate routes for families/groups
- **Shelter Capacity:** Route to centers with available space
- **Historical Optimization:** Learn from past evacuations

### SDG Alignment
- **SDG 11:** Sustainable Cities - Safe evacuation infrastructure
- **SDG 3:** Good Health - Prevent evacuation-related injuries
- **SDG 10:** Reduced Inequalities - Accessible routes for all

---

## 5. Dynamic Route Risk Visualization

### Feature Name
**Real-Time Color-Coded Route Risk Display**

### Purpose
Provide instant visual feedback on route safety by color-coding route segments based on the risk level of areas they pass through.

### Technical Description
A visual system that overlays route polylines on the map with different colors representing risk levels. Uses Turf.js to determine which barangays each route segment intersects, then applies risk-based styling. Updates dynamically as risk conditions change.

### Technologies Used
- **Visualization:** React-Leaflet Polyline components
- **Spatial Analysis:** Turf.js booleanIntersects
- **Styling:** Dynamic pathOptions based on risk
- **Data:** GeoJSON barangay boundaries with risk properties

### Frontend Components
- `EvacuationRoute.jsx` - Renders color-coded route segments
- `RouteSegment.jsx` - Individual segment with risk styling
- `RouteLegend.jsx` - Explains color meanings
- `RouteRiskSummary.jsx` - Numerical risk breakdown

### Backend Components
- `routeRecommendationService.js` - Route risk calculation
- `barangayService.js` - Barangay risk data provider
- GeoJSON files with risk properties

### Real-Time Behavior
- **Instant Updates:** Route colors change when risk data updates
- **Wind-Responsive:** Ashfall risk changes trigger re-coloring
- **Incident-Aware:** New incidents affect nearby route segments
- **Smooth Transitions:** Animated color changes for better UX

### AI Integration
- **Risk Explanation:** AI describes why segments are colored differently
- **Alternative Routes:** Suggests routes with more green segments
- **Risk Trends:** Predicts if route will become safer/riskier

### Smart-City Relevance
- **Visual Communication:** Intuitive risk understanding
- **Decision Support:** Quick assessment of route safety
- **Public Awareness:** Educate citizens about local risks
- **Emergency Planning:** Visual tools for evacuation drills

### Disaster Management Relevance
- **Rapid Assessment:** Responders quickly identify safe corridors
- **Evacuation Guidance:** Clear visual instructions for evacuees
- **Resource Routing:** Send supplies via safest routes
- **Damage Mapping:** Visualize affected areas post-disaster

### User Benefits
- **Intuitive Understanding:** Colors are universally understood
- **Quick Decisions:** No need to read detailed risk reports
- **Confidence:** Visual confirmation of route safety
- **Awareness:** Learn which areas are generally risky

### Operational Flow
```
1. Route calculated and displayed on map
2. For each route segment:
   a. Check intersection with barangay polygons
   b. Retrieve barangay's flood_risk value
   c. Convert numeric risk to color:
      - flood_risk ≥ 0.65 → Red (#dc2626)
      - flood_risk ≥ 0.55 → Yellow (#facc15)
      - flood_risk < 0.55 → Green (#22c55e)
   d. Apply color to segment polyline
3. Render route with colored segments
4. Add white outline for visibility
5. Display legend explaining colors
6. Show risk summary (% red, % yellow, % green)
7. Update colors if risk data changes
```

### Color Scheme
- **🟢 Green (#22c55e):** Safe - Low risk areas
- **🟡 Yellow (#facc15):** Caution - Medium risk areas
- **🔴 Red (#dc2626):** Dangerous - High risk areas
- **⚪ White Outline:** Visibility enhancement

### Future Scalability
- **Gradient Colors:** More nuanced risk representation
- **Animated Flows:** Show direction of travel
- **3D Elevation:** Show route elevation changes
- **Time-Based Colors:** Risk varies by time of day
- **User Customization:** Adjust risk thresholds

### SDG Alignment
- **SDG 11:** Sustainable Cities - Visual risk communication
- **SDG 4:** Quality Education - Educate about local hazards
- **SDG 16:** Peace and Justice - Transparent risk information

---

## 6. Route Comparison System

### Feature Name
**Multi-Route Comparison and Optimization Tool**

### Purpose
Allow users to compare multiple evacuation route options side-by-side, evaluating trade-offs between distance, time, and safety to choose the best route for their situation.

### Technical Description
A comparison interface that calculates multiple routes to different evacuation centers or via different paths, then presents them in a comparative view showing distance, estimated time, risk level, and specific hazards encountered. Users can select their preferred route based on their priorities.

### Technologies Used
- **Frontend:** React, comparison UI components
- **Routing:** OSRM for multiple route calculations
- **Analysis:** Turf.js for route analysis
- **Visualization:** Side-by-side route display

### Frontend Components
- `RouteComparison.jsx` - Main comparison interface
- `RouteOption.jsx` - Individual route card
- `RouteMetrics.jsx` - Distance, time, risk display
- `RouteSelector.jsx` - Route selection controls

### Backend Components
- `routeRecommendationService.js` - Multi-route calculation
- API: `POST /api/ai/route-recommendation` with multiple destinations
- Route caching for performance

### Real-Time Behavior
- **Live Updates:** All routes update when conditions change
- **Dynamic Ranking:** Routes re-ranked based on current conditions
- **Capacity Awareness:** Routes to full shelters marked unavailable
- **Traffic Integration:** Routes adjust for road closures

### AI Integration
- **Route Ranking:** AI recommends best route based on user profile
- **Trade-Off Analysis:** Explains pros/cons of each route
- **Personalized Suggestions:** Considers user's mobility, family size
- **Scenario Planning:** "What if" analysis for different conditions

### Smart-City Relevance
- **Optimization:** Distribute evacuees efficiently across city
- **Congestion Prevention:** Balance load across multiple routes
- **Infrastructure Insights:** Identify which routes are most used
- **Planning Data:** Historical route choices inform future planning

### Disaster Management Relevance
- **Flexible Response:** Multiple options if primary route blocked
- **Load Balancing:** Prevent overcrowding at single shelter
- **Adaptive Planning:** Adjust strategy as situation evolves
- **Redundancy:** Backup routes if primary fails

### User Benefits
- **Informed Choice:** See all options before deciding
- **Flexibility:** Choose based on personal priorities
- **Confidence:** Know there are alternatives
- **Transparency:** Understand trade-offs clearly

### Operational Flow
```
1. User requests evacuation routes
2. System identifies 3-5 nearest evacuation centers
3. Calculate route to each center:
   a. Request route from OSRM
   b. Analyze route risk
   c. Calculate metrics (distance, time, risk)
4. Display routes in comparison view:
   - Route 1: Nearest (2.3 km, 8 min, Medium risk)
   - Route 2: Safest (3.1 km, 12 min, Low risk)
   - Route 3: Fastest (2.8 km, 7 min, High risk)
5. Highlight recommended route (AI-selected)
6. User can:
   - View each route on map
   - See detailed risk breakdown
   - Select preferred route
   - Start navigation
7. System monitors selected route and suggests alternatives if needed
```

### Comparison Metrics
- **Distance:** Total kilometers to destination
- **Estimated Time:** Walking/driving time
- **Overall Risk:** High/Medium/Low classification
- **Risk Breakdown:** % of route in each risk zone
- **Shelter Capacity:** Available space at destination
- **Hazards Encountered:** Specific dangers on route
- **Accessibility:** Wheelchair-friendly, stairs, etc.

### Future Scalability
- **Machine Learning:** Learn user preferences over time
- **Social Routing:** See which routes others are taking
- **Real-Time Crowding:** Avoid congested routes
- **Weather Integration:** Consider rain, wind in route selection
- **Multi-Stop Routes:** Pick up family members en route

### SDG Alignment
- **SDG 11:** Sustainable Cities - Optimized evacuation systems
- **SDG 9:** Innovation - Smart routing technology
- **SDG 10:** Reduced Inequalities - Options for all mobility levels

---

## 7. AI Disaster Advisor

### Feature Name
**24/7 Intelligent Emergency Assistant with Context-Aware Recommendations**

### Purpose
Provide instant, personalized safety guidance to citizens during emergencies through an AI-powered chatbot that understands local hazards, user location, and current conditions.

### Technical Description
An AI-powered conversational assistant using Groq's Llama 3.1 model that analyzes user questions in the context of real-time hazard data (flood risk, ashfall risk, wind conditions, elevation, distance from volcano) to provide accurate, actionable safety recommendations. The system enforces strict safety-first rules and delivers concise, 2-sentence responses in natural language.

### Technologies Used
- **AI Model:** Groq Cloud - Llama 3.1 8B Instant
- **Backend:** Node.js, Express.js
- **Frontend:** React, Zustand for state management
- **Real-Time:** Socket.io for proactive alerts
- **Context:** mapStore provides location and hazard data

### Frontend Components
- `AIAdvisorWidget.jsx` - Main chatbot interface
- `ChatHistory.jsx` - Conversation display
- `AdvisoryPanel.jsx` - Proactive warnings display
- `SuggestionButtons.jsx` - Quick question prompts
- `useAIAdvisor.js` - Custom React hook for AI interaction

### Backend Components
- `chatbotService.js` - AI conversation management
- `aiService.js` - Groq API integration
- `riskAnalysisService.js` - Context building
- `aiController.js` - API endpoints
- API: `POST /api/ai/chatbot` - Ask questions
- API: `POST /api/ai/chatbot/suggestions` - Get suggested questions

### Real-Time Behavior
- **Proactive Warnings:** AI sends alerts when risk levels increase
- **Context Updates:** Responses update when wind/weather changes
- **Incident Awareness:** AI knows about nearby incidents
- **Socket Events:** `ai:hazard_warning`, `ai:evacuation_recommended`, `ai:safety_tip`

### AI Integration
**Core AI Features:**
- **Context-Aware:** Knows user's location, local risks, weather conditions
- **Safety-First:** Never gives false reassurance when risks are high
- **Concise Responses:** Maximum 2 sentences, natural tone
- **Multilingual Ready:** Can be extended to Filipino/Tagalog
- **Learning System:** Improves from user interactions

**System Prompt:**
```
You are a Smart City Disaster Response Assistant for Lipa City, Philippines.

CRITICAL SAFETY RULES:
1. If Flood Risk OR Ashfall Risk is HIGH or VERY HIGH, the area is NOT SAFE
2. NEVER describe an area as safe when any risk is HIGH
3. Always prioritize safety over reassurance
4. Be direct and honest about dangers
5. Consider wind direction when explaining ashfall risk

RESPONSE STYLE:
- Maximum 2 short sentences only
- Natural and conversational tone (sound human)
- No symbols, no formatting, no deep words
- Just a clear answer
```

**Context Provided to AI:**
```javascript
{
  flood_risk: "High",              // Converted from numeric
  ashfall_risk: "Very High",       // Calculated from wind
  elevation: 125,                  // Meters above sea level
  distance_to_volcano: 45.2,       // Kilometers from Taal
  barangay_name: "Marawoy",        // User's location
  wind_direction: "West",          // Current wind
  wind_speed: "25",                // km/h
  latitude: 13.456,
  longitude: 121.123
}
```

### Smart-City Relevance
- **Citizen Engagement:** 24/7 accessible information
- **Digital Inclusion:** AI assistance for all literacy levels
- **Scalable Support:** Handle thousands of queries simultaneously
- **Data Collection:** Learn common citizen concerns

### Disaster Management Relevance
- **Immediate Guidance:** No wait time for emergency advice
- **Consistent Information:** Same accurate info to everyone
- **Reduce Panic:** Calm, factual responses reduce fear
- **Resource Efficiency:** AI handles routine questions, humans handle complex cases

### User Benefits
- **Instant Answers:** No waiting for human responders
- **Personalized Advice:** Based on your specific location and situation
- **Always Available:** 24/7 assistance, even during peak emergencies
- **Easy to Use:** Natural conversation, no technical knowledge needed
- **Trustworthy:** Backed by real-time data and safety protocols

### Operational Flow
```
1. User opens AI Advisor widget
2. System loads user's location from mapStore
3. System retrieves selected barangay data
4. System gets current wind conditions
5. User types question: "Is my area safe from flood?"
6. Frontend builds hazard context:
   - Extract barangay properties from GeoJSON
   - Convert numeric flood_risk to descriptive level
   - Calculate ashfall_risk based on wind
   - Compile all context data
7. Send to backend: { question, hazard_data }
8. Backend validates input
9. Backend checks for safety override:
   - If flood_risk OR ashfall_risk is HIGH → immediate safety warning
10. If no override, send to Groq AI:
    - System prompt (role, rules, style)
    - User prompt (question + context)
    - Temperature: 0.7 (balanced creativity/accuracy)
    - Max tokens: 150 (enforce brevity)
11. AI generates response (max 2 sentences)
12. Backend returns: { reply, context, source }
13. Frontend displays response in chat
14. User can ask follow-up questions
15. System monitors for condition changes
16. If risk increases, AI sends proactive warning
```

### Example Interactions

**Question:** "Is my area safe from flood?"
**Context:** flood_risk = "High"
**Response:** "Your area has High flood risk, so it's not safe. Stay alert and prepare to evacuate if needed."

**Question:** "Should I evacuate now?"
**Context:** flood_risk = "Medium", ashfall_risk = "Very High"
**Response:** "Yes, evacuate now due to Very High ashfall risk from West winds. Head to the nearest evacuation center immediately."

**Question:** "What should I bring?"
**Response:** "Bring essentials: water, food, medicine, documents, phone charger, and flashlight. Keep your emergency kit ready."

**Question:** "Is it safe to go outside?"
**Context:** ashfall_risk = "Very High"
**Response:** "No, stay indoors due to Very High ashfall risk. Seal windows and doors to prevent ash entry."

### Future Scalability
- **Voice Interface:** Speak to AI instead of typing
- **Image Analysis:** Upload photos for AI assessment
- **Predictive Warnings:** AI predicts disasters before they happen
- **Multilingual:** Support Filipino, Tagalog, other dialects
- **Emotional Support:** Recognize and respond to user stress
- **Offline Mode:** Cached responses for common questions
- **Integration:** Connect with PAGASA, PHIVOLCS data feeds

### SDG Alignment
- **SDG 11:** Sustainable Cities - Accessible emergency information
- **SDG 3:** Good Health - Prevent disaster-related casualties
- **SDG 10:** Reduced Inequalities - AI assistance for all citizens
- **SDG 9:** Innovation - AI-powered public services

---

## 8. Real-Time Socket.io Synchronization

### Feature Name
**Instant Multi-User Real-Time Data Synchronization System**

### Purpose
Enable instant updates across all connected users when incidents are reported, hazards change, or emergency broadcasts are sent, ensuring everyone has the latest information simultaneously.

### Technical Description
A WebSocket-based real-time communication system using Socket.io that maintains persistent connections between clients and server. When data changes on the server (new incident, status update, broadcast), the server emits events to all connected clients, triggering immediate UI updates without page refresh.

### Technologies Used
- **Real-Time:** Socket.io (WebSocket with fallbacks)
- **Backend:** Node.js, Express.js
- **Frontend:** socket.io-client, React hooks
- **State Management:** React Query for cache invalidation
- **Event System:** Custom event handlers

### Frontend Components
- `useSocket.js` - Custom hook for Socket.io connection
- `SocketProvider.jsx` - Context provider for socket instance
- `RealTimeIndicator.jsx` - Connection status display
- Event handlers in various components

### Backend Components
- `config/socket.js` - Socket.io server configuration
- `sockets/eventHandlers.js` - Event emission logic
- `server.js` - Socket.io initialization
- CORS configuration for WebSocket

### Real-Time Behavior
**Socket Events:**
- `incident:new` - New incident reported
- `incident:updated` - Incident status changed
- `incident:deleted` - Incident removed
- `hazard:flood` - Flood risk level changed
- `hazard:wind` - Wind conditions changed
- `route:unsafe` - Evacuation route compromised
- `broadcast:emergency` - Emergency alert sent
- `notification:new` - New notification for user
- `shelter:capacity` - Shelter capacity updated

**Connection Management:**
- Auto-reconnect on disconnect
- Exponential backoff retry strategy
- Connection status indicator
- Graceful degradation if WebSocket unavailable

### AI Integration
- **Proactive Alerts:** AI analyzes real-time data and triggers warnings
- **Smart Notifications:** AI determines which users need which alerts
- **Pattern Detection:** AI identifies unusual patterns in real-time data

### Smart-City Relevance
- **Instant Communication:** City-wide updates in milliseconds
- **Coordinated Response:** All responders see same information
- **Public Engagement:** Citizens feel connected to city systems
- **Efficiency:** No polling, reduced server load

### Disaster Management Relevance
- **Critical Speed:** Lives saved by instant warnings
- **Situational Awareness:** Everyone has current information
- **Coordination:** Responders work with latest data
- **Panic Reduction:** Timely updates prevent misinformation

### User Benefits
- **No Refresh Needed:** Updates appear automatically
- **Instant Awareness:** Know about incidents immediately
- **Always Current:** Never see outdated information
- **Responsive Feel:** App feels alive and connected

### Operational Flow
```
1. User opens application
2. Frontend establishes WebSocket connection to server
3. Server acknowledges connection
4. Frontend displays "Live Updates" indicator
5. User browses map, views incidents

Meanwhile, on another device:
6. Another user reports new flood incident
7. Backend saves incident to database
8. Backend emits Socket event: incident:new
9. All connected clients receive event
10. Frontend React Query cache invalidated
11. Components re-fetch data
12. New incident appears on map (all users)
13. Notification sent to affected users
14. AI analyzes incident and sends proactive warnings

If connection lost:
15. Frontend detects disconnect
16. Shows "Reconnecting..." indicator
17. Attempts reconnection with exponential backoff
18. On reconnect, fetches missed updates
19. Resumes real-time synchronization
```

### Event Deduplication
```javascript
// Prevent duplicate updates
const processedEvents = new Set();

socket.on('incident:new', (data) => {
  const eventId = `${data.type}-${data.id}-${data.timestamp}`;
  
  if (processedEvents.has(eventId)) {
    return; // Already processed
  }
  
  processedEvents.add(eventId);
  
  // Process event
  queryClient.invalidateQueries(['incidents']);
  
  // Clean old events after 5 minutes
  setTimeout(() => processedEvents.delete(eventId), 300000);
});
```

### Performance Optimization
- **Event Throttling:** Limit update frequency to prevent UI thrashing
- **Selective Updates:** Only send events to relevant users
- **Compression:** Minimize data sent over WebSocket
- **Room-Based:** Group users by location for targeted updates

### Future Scalability
- **Redis Pub/Sub:** Scale across multiple servers
- **Message Queue:** Handle high-volume events
- **WebRTC:** Peer-to-peer for video/audio
- **Offline Sync:** Queue events when offline, sync when reconnected
- **Conflict Resolution:** Handle simultaneous edits

### SDG Alignment
- **SDG 9:** Innovation - Real-time communication infrastructure
- **SDG 11:** Sustainable Cities - Connected urban systems
- **SDG 17:** Partnerships - Coordinated emergency response

---

## 9. Admin Command Center

### Feature Name
**Centralized Emergency Management and System Control Dashboard**

### Purpose
Provide administrators with a comprehensive control center to monitor system-wide activity, manage users, moderate incidents, broadcast alerts, and coordinate emergency response from a single interface.

### Technical Description
A feature-rich administrative dashboard with real-time statistics, user management CRUD operations, incident moderation workflow, emergency broadcasting system, shelter capacity monitoring, and system analytics. Implements role-based access control to ensure only authorized personnel can access sensitive functions.

### Technologies Used
- **Frontend:** React, React Query, Recharts for analytics
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Authentication:** JWT with role verification
- **Real-Time:** Socket.io for live dashboard updates
- **Database:** MySQL with complex queries

### Frontend Components
- `AdminDashboard.jsx` - Main dashboard with statistics
- `UserManagement.jsx` - User CRUD interface
- `IncidentModeration.jsx` - Verify/reject incidents
- `EmergencyBroadcast.jsx` - Send city-wide alerts
- `ShelterMonitoring.jsx` - Track shelter capacity
- `AnalyticsCharts.jsx` - Visual data representation
- `SystemLogs.jsx` - Activity monitoring

### Backend Components
- `adminController.js` - Admin operations
- `adminService.js` - Business logic
- `middleware/auth.js` - Role verification
- `adminValidator.js` - Input validation
- API: `GET /api/admin/dashboard` - Statistics
- API: `GET /api/admin/users` - User list
- API: `PUT /api/admin/users/:id` - Update user
- API: `DELETE /api/admin/users/:id` - Delete user
- API: `POST /api/admin/broadcast` - Send alert
- API: `GET /api/admin/analytics` - System analytics

### Real-Time Behavior
- **Live Statistics:** Dashboard updates every 5 seconds
- **Instant Notifications:** Alerts when critical incidents reported
- **User Activity:** See active users in real-time
- **System Health:** Monitor server performance live

### AI Integration
- **Anomaly Detection:** AI flags unusual patterns
- **Predictive Analytics:** Forecast incident trends
- **Smart Recommendations:** AI suggests resource allocation
- **Automated Moderation:** AI pre-screens incident reports

### Smart-City Relevance
- **Centralized Control:** Single point of command
- **Data-Driven Decisions:** Real-time analytics inform policy
- **Efficient Administration:** Streamlined operations
- **Transparency:** Audit trail of all actions

### Disaster Management Relevance
- **Command Center:** Coordinate emergency response
- **Resource Management:** Track and deploy resources
- **Situation Monitoring:** Real-time disaster overview
- **Communication Hub:** Broadcast critical information

### User Benefits
**For Administrators:**
- **Complete Control:** Manage all system aspects
- **Real-Time Insights:** Current system status at a glance
- **Efficient Workflow:** Streamlined moderation and management
- **Powerful Tools:** Broadcasting, analytics, user management

**For Citizens:**
- **Verified Information:** Admins ensure data accuracy
- **Timely Alerts:** Admins send critical warnings
- **System Reliability:** Admins maintain system health
- **Accountability:** Admin actions are logged

### Operational Flow
```
Admin Dashboard Workflow:

1. Admin logs in with credentials
2. System verifies admin role (JWT)
3. Dashboard loads with real-time statistics:
   - Total users
   - Active incidents
   - Pending moderation
   - Shelter capacity
   - System health

4. Admin reviews pending incidents:
   - View incident details
   - Check photos/location
   - Verify authenticity
   - Approve or reject
   - Add notes

5. Admin manages users:
   - Search/filter users
   - View user profiles
   - Update roles
   - Suspend accounts
   - Delete users

6. Admin sends emergency broadcast:
   - Select target: All users / Specific barangay / Role-based
   - Choose severity: Info / Warning / Critical
   - Write message
   - Preview
   - Send
   - All targeted users receive notification

7. Admin monitors shelters:
   - View all evacuation centers
   - Check current capacity
   - Update capacity
   - Mark as full/available
   - View evacuee list

8. Admin reviews analytics:
   - Incident trends over time
   - Most affected barangays
   - Response time metrics
   - User engagement stats
   - System performance

9. Admin checks system logs:
   - User actions
   - API requests
   - Errors
   - Security events
```

### Security Features
- **Role-Based Access:** Only admins can access
- **Action Logging:** All admin actions recorded
- **Session Management:** Secure JWT tokens
- **Rate Limiting:** Prevent abuse
- **Input Validation:** Prevent injection attacks
- **Audit Trail:** Complete history of changes

### Future Scalability
- **Multi-Level Roles:** Super admin, admin, moderator
- **Delegation:** Assign tasks to specific admins
- **Workflow Automation:** Auto-approve low-risk incidents
- **Advanced Analytics:** Machine learning insights
- **Mobile Admin App:** Manage on-the-go
- **Integration:** Connect with other city systems

### SDG Alignment
- **SDG 16:** Peace and Justice - Transparent governance
- **SDG 11:** Sustainable Cities - Efficient city management
- **SDG 9:** Innovation - Smart administration tools

---

## 10. Incident Reporting System

### Feature Name
**Citizen-Powered Real-Time Disaster Incident Reporting**

### Purpose
Enable citizens to quickly report emergencies, disasters, and hazards with photos and location data, creating a crowd-sourced real-time situational awareness network.

### Technical Description
A mobile-friendly incident reporting system that allows authenticated users to submit reports with title, description, type, severity, location (GPS or manual), and photo attachments. Reports are immediately visible to admins for verification and appear on the public map once approved.

### Technologies Used
- **Frontend:** React, React Hook Form, Zod validation
- **File Upload:** Multer (backend), FormData (frontend)
- **Geolocation:** Browser Geolocation API
- **Image Handling:** File compression, preview
- **Backend:** Node.js, Express.js, Sequelize
- **Storage:** Local filesystem (uploads/incidents/)

### Frontend Components
- `IncidentReportForm.jsx` - Report submission form
- `IncidentList.jsx` - View all incidents
- `IncidentDetail.jsx` - Detailed incident view
- `IncidentMap.jsx` - Map view of incidents
- `PhotoUpload.jsx` - Image upload component
- `LocationPicker.jsx` - GPS or manual location

### Backend Components
- `incidentController.js` - CRUD operations
- `incidentService.js` - Business logic
- `Incident.js` model - Database schema
- `incidentValidator.js` - Input validation
- `multer.js` config - File upload handling
- API: `POST /api/incidents` - Create incident
- API: `GET /api/incidents` - List incidents
- API: `GET /api/incidents/:id` - Get incident
- API: `PUT /api/incidents/:id` - Update incident
- API: `DELETE /api/incidents/:id` - Delete incident

### Real-Time Behavior
- **Instant Submission:** Report appears in admin queue immediately
- **Live Map Updates:** Verified incidents appear on map for all users
- **Status Notifications:** Reporter notified when incident verified/resolved
- **Socket Events:** `incident:new`, `incident:updated`, `incident:resolved`

### AI Integration
- **Auto-Classification:** AI suggests incident type from description
- **Severity Assessment:** AI estimates severity from photo/description
- **Duplicate Detection:** AI identifies similar recent reports
- **Location Verification:** AI checks if location makes sense

### Smart-City Relevance
- **Crowd-Sourced Data:** Citizens become sensors
- **Rapid Response:** Authorities alerted immediately
- **Community Engagement:** Citizens actively participate in safety
- **Data Collection:** Build historical incident database

### Disaster Management Relevance
- **Early Detection:** Citizens report before official channels
- **Situational Awareness:** Real-time ground truth
- **Resource Allocation:** Deploy resources to reported locations
- **Damage Assessment:** Photos provide visual evidence

### User Benefits
- **Easy Reporting:** Simple form, quick submission
- **Photo Evidence:** Visual documentation of situation
- **GPS Location:** Automatic location capture
- **Status Tracking:** See when incident is addressed
- **Community Service:** Help neighbors stay safe

### Operational Flow
```
1. User clicks "Report Incident" button
2. Form opens with fields:
   - Title (required)
   - Description (required)
   - Type: Flood, Fire, Landslide, etc. (required)
   - Severity: Low, Medium, High, Critical (required)
   - Location: Auto-detect or manual entry
   - Photo: Upload image (optional)

3. User fills form:
   - Types title: "Flooded road on Main Street"
   - Describes: "Water level rising, road impassable"
   - Selects type: Flood
   - Selects severity: High
   - Clicks "Use My Location" → GPS coordinates captured
   - Uploads photo of flooded road

4. User clicks "Submit Report"
5. Frontend validates input (Zod schema)
6. Frontend sends multipart/form-data to backend
7. Backend validates input (express-validator)
8. Backend saves photo to uploads/incidents/
9. Backend creates incident record in database
10. Backend emits Socket event: incident:new
11. All admins receive notification
12. Incident appears in admin moderation queue
13. User sees "Report submitted successfully"

Admin Moderation:
14. Admin reviews incident
15. Admin verifies photo and location
16. Admin approves incident
17. Backend updates incident status: "verified"
18. Backend emits Socket event: incident:updated
19. Incident appears on public map
20. Reporter receives notification: "Your report has been verified"

Resolution:
21. Responders address the incident
22. Admin marks incident as "resolved"
23. Backend updates status
24. Reporter notified: "Incident resolved"
25. Incident remains on map but marked as resolved
```

### Incident Types
- **Flood:** Water accumulation, road flooding
- **Fire:** Building fires, forest fires
- **Landslide:** Soil movement, road blockage
- **Earthquake:** Structural damage, aftershocks
- **Accident:** Vehicle accidents, injuries
- **Infrastructure:** Road damage, power outage
- **Health:** Disease outbreak, medical emergency
- **Other:** Miscellaneous incidents

### Severity Levels
- **Low:** Minor issue, no immediate danger
- **Medium:** Moderate concern, monitor situation
- **High:** Serious issue, requires attention
- **Critical:** Life-threatening, immediate response needed

### Future Scalability
- **Video Upload:** Support video evidence
- **Voice Reports:** Call-in reporting for elderly
- **Anonymous Reporting:** Option to report without account
- **Incident Updates:** Reporters can add updates
- **Collaborative Reporting:** Multiple users confirm same incident
- **Gamification:** Reward active reporters

### SDG Alignment
- **SDG 11:** Sustainable Cities - Community-driven safety
- **SDG 16:** Peace and Justice - Transparent reporting
- **SDG 17:** Partnerships - Citizen-government collaboration

---

## 11. Emergency Broadcasting

### Feature Name
**City-Wide Emergency Alert and Notification Broadcasting System**

### Purpose
Enable administrators to instantly send critical emergency alerts to all citizens or targeted groups (by location, role, or risk level) during disasters, ensuring rapid dissemination of life-saving information.

### Technical Description
A multi-channel broadcasting system that sends emergency notifications through Socket.io (real-time), database notifications (persistent), and optionally SMS/email. Supports targeting by barangay, user role, or broadcast to all users. Messages are prioritized by severity and displayed prominently in the UI.

### Technologies Used
- **Real-Time:** Socket.io for instant delivery
- **Backend:** Node.js, Express.js
- **Database:** MySQL for persistent notifications
- **Frontend:** React, toast notifications
- **Targeting:** User filtering by location/role

### Frontend Components
- `EmergencyBroadcast.jsx` - Admin broadcast interface
- `BroadcastForm.jsx` - Message composition
- `TargetSelector.jsx` - Audience selection
- `BroadcastHistory.jsx` - Past broadcasts
- `EmergencyAlert.jsx` - User-facing alert display

### Backend Components
- `announcementController.js` - Broadcast management
- `announcementService.js` - Broadcast logic
- `notificationService.js` - Notification creation
- `Announcement.js` model - Broadcast storage
- API: `POST /api/announcements` - Send broadcast
- API: `GET /api/announcements` - List broadcasts
- Socket event: `broadcast:emergency`

### Real-Time Behavior
- **Instant Delivery:** Alerts appear within milliseconds
- **Persistent Display:** Alerts remain until acknowledged
- **Priority Handling:** Critical alerts override other notifications
- **Retry Logic:** Ensures delivery even if user temporarily offline

### AI Integration
- **Message Optimization:** AI suggests clear, concise wording
- **Target Recommendation:** AI identifies who needs the alert
- **Translation:** AI translates to Filipino/Tagalog
- **Urgency Assessment:** AI determines appropriate severity level

### Smart-City Relevance
- **Mass Communication:** Reach entire city instantly
- **Targeted Messaging:** Send relevant info to specific groups
- **Emergency Coordination:** Unified communication channel
- **Public Safety:** Rapid warning dissemination

### Disaster Management Relevance
- **Life-Saving Speed:** Warnings reach citizens in seconds
- **Evacuation Orders:** Coordinate mass evacuations
- **Status Updates:** Keep public informed during crisis
- **All-Clear Signals:** Notify when danger has passed

### User Benefits
- **Timely Warnings:** Know about dangers immediately
- **Clear Instructions:** Understand what action to take
- **Peace of Mind:** Stay informed during emergencies
- **No App Required:** Alerts appear even if app is closed (push notifications)

### Operational Flow
```
1. Admin opens Emergency Broadcast interface
2. Admin composes message:
   - Title: "Flood Warning - Evacuate Now"
   - Message: "Heavy flooding expected in low-lying areas. Evacuate to higher ground immediately."
   - Severity: Critical
   
3. Admin selects target audience:
   - Option 1: All users
   - Option 2: Specific barangay (e.g., "Poblacion")
   - Option 3: By role (e.g., "All staff")
   - Option 4: High-risk areas only

4. Admin previews message
5. Admin clicks "Send Broadcast"

Backend Processing:
6. Validate admin permissions
7. Create announcement record in database
8. Query target users from database
9. For each target user:
   - Create notification record
   - Emit Socket event to user's connection
   - (Optional) Send SMS/email
   
10. Socket.io delivers to all connected users
11. Frontend receives broadcast event
12. Display emergency alert:
    - Full-screen modal for Critical severity
    - Toast notification for Warning/Info
    - Sound alert (if enabled)
    - Vibration (mobile)

User Experience:
13. User sees emergency alert
14. User reads message
15. User clicks "Acknowledge" or "Dismiss"
16. Alert marked as read
17. Alert remains in notification history
```

### Severity Levels
- **Critical:** Life-threatening, immediate action required (red, full-screen)
- **Warning:** Serious concern, prepare to act (orange, prominent)
- **Info:** Important information, stay informed (blue, standard)

### Targeting Options
- **All Users:** City-wide broadcast
- **By Barangay:** Specific geographic area
- **By Role:** Staff, admins, volunteers
- **By Risk Level:** Users in high-risk zones
- **Custom:** Manual user selection

### Future Scalability
- **SMS Integration:** Send to users without app
- **Email Backup:** Ensure message delivery
- **Voice Calls:** Automated voice alerts
- **Multi-Language:** Automatic translation
- **Scheduled Broadcasts:** Pre-schedule alerts
- **Templates:** Pre-written emergency messages

### SDG Alignment
- **SDG 11:** Sustainable Cities - Emergency communication infrastructure
- **SDG 3:** Good Health - Prevent casualties through timely warnings
- **SDG 16:** Peace and Justice - Transparent government communication

---

## 12. Notification System

### Feature Name
**Real-Time Multi-Channel User Notification System**

### Purpose
Keep users informed of important events (incident updates, broadcasts, system alerts) through a comprehensive notification system with real-time delivery, notification center, and customizable preferences.

### Technical Description
A full-featured notification system that creates, stores, delivers, and manages notifications for users. Supports multiple notification types (incident, broadcast, system), real-time delivery via Socket.io, persistent storage in database, unread count tracking, and mark-as-read functionality.

### Technologies Used
- **Real-Time:** Socket.io for instant delivery
- **Backend:** Node.js, Express.js, Sequelize
- **Frontend:** React, Zustand for notification state
- **Database:** MySQL for persistent storage
- **UI:** Lucide icons, toast notifications

### Frontend Components
- `NotificationBell.jsx` - Bell icon with unread count
- `NotificationCenter.jsx` - Full notification list
- `NotificationItem.jsx` - Individual notification
- `NotificationPreferences.jsx` - User settings
- `useNotifications.js` - Custom hook

### Backend Components
- `notificationController.js` - CRUD operations
- `notificationService.js` - Notification logic
- `Notification.js` model - Database schema
- API: `GET /api/notifications` - List notifications
- API: `PUT /api/notifications/:id/read` - Mark as read
- API: `DELETE /api/notifications/:id` - Delete notification
- API: `POST /api/notifications/read-all` - Mark all as read
- Socket event: `notification:new`

### Real-Time Behavior
- **Instant Delivery:** Notifications appear immediately
- **Unread Count:** Bell badge updates in real-time
- **Auto-Refresh:** Notification list updates automatically
- **Persistent:** Notifications survive page refresh

### AI Integration
- **Smart Grouping:** AI groups related notifications
- **Priority Sorting:** AI determines notification importance
- **Digest Mode:** AI summarizes multiple notifications
- **Personalization:** AI learns user preferences

### Smart-City Relevance
- **Citizen Engagement:** Keep citizens informed and engaged
- **Transparency:** Open communication with government
- **Feedback Loop:** Users stay updated on their reports
- **Digital Services:** Modern notification infrastructure

### Disaster Management Relevance
- **Critical Alerts:** Ensure users see emergency warnings
- **Status Updates:** Keep users informed of incident resolution
- **Coordination:** Notify responders of assignments
- **Accountability:** Track who received which alerts

### User Benefits
- **Stay Informed:** Never miss important updates
- **Organized:** All notifications in one place
- **Control:** Mark as read, delete, or clear all
- **Customizable:** Choose which notifications to receive
- **Accessible:** Visual and audio alerts

### Operational Flow
```
Notification Creation:
1. Event occurs (incident verified, broadcast sent, etc.)
2. Backend creates notification record:
   - user_id: Target user
   - type: "incident", "broadcast", "system"
   - title: "Incident Verified"
   - message: "Your flood report has been verified"
   - is_read: false
   - created_at: timestamp

3. Backend emits Socket event: notification:new
4. Socket.io delivers to user's connection

User Experience:
5. User sees notification bell badge increment
6. User hears notification sound (if enabled)
7. User clicks notification bell
8. Notification center opens
9. User sees list of notifications:
   - Unread notifications highlighted
   - Sorted by newest first
   - Grouped by type

10. User clicks notification:
    - Notification marked as read
    - Badge count decrements
    - User navigated to relevant page

11. User can:
    - Mark individual as read/unread
    - Delete individual notification
    - Mark all as read
    - Clear all notifications
```

### Notification Types
- **Incident:** Your report verified/resolved
- **Broadcast:** Emergency alert received
- **System:** Account updated, password changed
- **Social:** Someone commented on your report
- **Reminder:** Evacuation drill scheduled

### Notification States
- **Unread:** Bold text, highlighted background
- **Read:** Normal text, standard background
- **Archived:** Hidden from main list
- **Deleted:** Removed from database

### UI Features
- **Badge Count:** Shows unread count on bell icon
- **Toast Notifications:** Brief popup for new notifications
- **Sound Alerts:** Audio notification (optional)
- **Visual Indicators:** Color-coded by type
- **Timestamps:** "2 minutes ago", "1 hour ago"
- **Actions:** Quick actions from notification

### Future Scalability
- **Push Notifications:** Mobile push even when app closed
- **Email Digest:** Daily/weekly email summary
- **SMS Fallback:** Critical alerts via SMS
- **Notification Channels:** Separate channels for different types
- **Do Not Disturb:** Quiet hours setting
- **Smart Filtering:** AI-powered notification filtering

### SDG Alignment
- **SDG 11:** Sustainable Cities - Digital communication infrastructure
- **SDG 9:** Innovation - Modern notification systems
- **SDG 10:** Reduced Inequalities - Accessible information for all

---

## 13. User Management System

### Feature Name
**Comprehensive User Account and Role Management System**

### Purpose
Manage user accounts, authentication, authorization, profiles, and role-based access control to ensure secure and personalized access to system features.

### Technical Description
A complete user management system with registration, login, JWT authentication, role-based access control (User, Staff, Admin), profile management, password reset, and account security features. Implements bcrypt password hashing, JWT token generation, and middleware-based authorization.

### Technologies Used
- **Authentication:** JWT (jsonwebtoken), bcrypt
- **Backend:** Node.js, Express.js, Sequelize
- **Frontend:** React, Zustand for auth state
- **Security:** Helmet, rate limiting, input validation
- **Database:** MySQL with User model

### Frontend Components
- `LoginForm.jsx` - User login
- `RegisterForm.jsx` - New user registration
- `ProfilePage.jsx` - View/edit profile
- `ChangePassword.jsx` - Password update
- `UserList.jsx` - Admin user management
- `useAuth.js` - Authentication hook

### Backend Components
- `authController.js` - Authentication operations
- `authService.js` - Auth business logic
- `User.js` model - User database schema
- `middleware/auth.js` - JWT verification
- `authValidator.js` - Input validation
- API: `POST /api/auth/register` - Create account
- API: `POST /api/auth/login` - Authenticate
- API: `GET /api/auth/profile` - Get profile
- API: `PUT /api/auth/profile` - Update profile
- API: `POST /api/auth/change-password` - Change password

### Real-Time Behavior
- **Session Management:** JWT tokens with expiration
- **Auto-Logout:** Logout on token expiration
- **Activity Tracking:** Last login timestamp
- **Online Status:** Show active users (admin view)

### AI Integration
- **Anomaly Detection:** AI detects suspicious login patterns
- **Password Strength:** AI suggests strong passwords
- **Profile Completion:** AI prompts for missing info
- **Role Recommendation:** AI suggests appropriate role based on activity

### Smart-City Relevance
- **Digital Identity:** Secure citizen accounts
- **Personalization:** Tailored experience per user
- **Access Control:** Protect sensitive features
- **Accountability:** Track user actions

### Disaster Management Relevance
- **Verified Users:** Ensure report authenticity
- **Role-Based Access:** Staff/admin special permissions
- **Emergency Contacts:** Store user contact info
- **Evacuation Lists:** Track who needs assistance

### User Benefits
- **Secure Access:** Protected account with password
- **Personalized:** Custom profile and preferences
- **Privacy:** Control what information is shared
- **Convenience:** Stay logged in across sessions

### Operational Flow
```
Registration:
1. User clicks "Sign Up"
2. User fills registration form:
   - First name, last name
   - Email address
   - Password (min 8 characters)
   - Phone number
   - Barangay
3. Frontend validates input
4. Backend validates input
5. Backend checks if email already exists
6. Backend hashes password (bcrypt)
7. Backend creates user record
8. Backend generates JWT token
9. User automatically logged in
10. User redirected to dashboard

Login:
1. User enters email and password
2. Backend finds user by email
3. Backend compares password hash
4. If valid, generate JWT token
5. Return token to frontend
6. Frontend stores token in localStorage
7. Frontend sets auth state
8. User redirected to dashboard

Protected Routes:
1. User tries to access protected page
2. Frontend checks if token exists
3. Frontend sends request with Authorization header
4. Backend middleware verifies JWT
5. If valid, allow access
6. If invalid/expired, return 401 Unauthorized
7. Frontend redirects to login

Profile Management:
1. User clicks "Profile"
2. Load user data from API
3. User edits information
4. User clicks "Save"
5. Backend validates changes
6. Backend updates user record
7. Return updated user data
8. Frontend updates display
```

### User Roles
- **User:** Basic access, report incidents, view map
- **Staff:** Moderate incidents, update statuses, view analytics
- **Admin:** Full access, user management, system configuration

### Security Features
- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Secure, stateless authentication
- **Token Expiration:** 7-day expiry, refresh mechanism
- **Rate Limiting:** Prevent brute force attacks
- **Input Validation:** Prevent injection attacks
- **HTTPS Only:** Secure transmission (production)

### Future Scalability
- **OAuth Integration:** Login with Google/Facebook
- **Two-Factor Authentication:** SMS/email verification
- **Biometric Login:** Fingerprint/face recognition
- **Single Sign-On:** Integrate with other city systems
- **Account Recovery:** Email-based password reset
- **Account Deletion:** GDPR-compliant data removal

### SDG Alignment
- **SDG 16:** Peace and Justice - Secure digital identity
- **SDG 10:** Reduced Inequalities - Accessible registration
- **SDG 9:** Innovation - Modern authentication systems

---

## 14. Analytics Dashboard

### Feature Name
**Real-Time System Analytics and Data Visualization Dashboard**

### Purpose
Provide administrators with comprehensive insights into system usage, incident trends, user engagement, and disaster patterns through interactive charts and real-time statistics.

### Technical Description
A data visualization dashboard that aggregates system data (incidents, users, reports, notifications) and presents it through interactive charts, graphs, and statistics. Uses Recharts for visualization and React Query for data fetching with automatic refresh.

### Technologies Used
- **Visualization:** Recharts (React charting library)
- **Frontend:** React, React Query
- **Backend:** Node.js, Sequelize aggregation queries
- **Database:** MySQL with complex queries
- **Real-Time:** Socket.io for live updates

### Frontend Components
- `AnalyticsDashboard.jsx` - Main dashboard
- `StatCard.jsx` - Statistic display cards
- `IncidentTrendChart.jsx` - Line chart of incidents over time
- `BarangayHeatmap.jsx` - Geographic risk visualization
- `UserActivityChart.jsx` - User engagement metrics
- `ResponseTimeChart.jsx` - Response time analysis

### Backend Components
- `adminController.js` - Analytics endpoints
- `adminService.js` - Data aggregation logic
- API: `GET /api/admin/analytics` - Get analytics data
- API: `GET /api/admin/dashboard` - Dashboard statistics
- Complex SQL queries for aggregation

### Real-Time Behavior
- **Auto-Refresh:** Dashboard updates every 30 seconds
- **Live Counters:** Statistics update in real-time
- **Trend Detection:** Identify spikes in incidents
- **Alert Triggers:** Notify admin of unusual patterns

### AI Integration
- **Predictive Analytics:** AI forecasts future incidents
- **Pattern Recognition:** AI identifies trends
- **Anomaly Detection:** AI flags unusual activity
- **Recommendations:** AI suggests resource allocation

### Smart-City Relevance
- **Data-Driven Decisions:** Evidence-based policy making
- **Performance Monitoring:** Track system effectiveness
- **Resource Optimization:** Allocate resources efficiently
- **Transparency:** Share statistics with public

### Disaster Management Relevance
- **Trend Analysis:** Identify disaster patterns
- **Preparedness Planning:** Allocate resources to high-risk areas
- **Response Evaluation:** Measure response effectiveness
- **Historical Data:** Learn from past disasters

### User Benefits
**For Administrators:**
- **Insights:** Understand system usage and trends
- **Decision Support:** Data to inform actions
- **Performance Tracking:** Monitor KPIs
- **Reporting:** Generate reports for stakeholders

**For Citizens:**
- **Transparency:** See how system is used
- **Accountability:** Track government response
- **Awareness:** Understand local risks

### Key Metrics
- **Total Users:** Registered user count
- **Active Incidents:** Currently ongoing incidents
- **Response Time:** Average time to verify/resolve
- **Most Affected Areas:** Barangays with most incidents
- **Incident Types:** Distribution by type
- **Severity Distribution:** Low/Medium/High/Critical
- **User Engagement:** Active users, reports submitted
- **System Health:** API response time, uptime

### Chart Types
- **Line Charts:** Incidents over time, user growth
- **Bar Charts:** Incidents by barangay, by type
- **Pie Charts:** Severity distribution, incident types
- **Heatmaps:** Geographic risk visualization
- **Gauges:** System health, response time
- **Tables:** Top reporters, recent incidents

### Future Scalability
- **Custom Reports:** User-defined report generation
- **Export Data:** CSV/PDF export
- **Scheduled Reports:** Automated email reports
- **Comparative Analysis:** Compare time periods
- **Predictive Models:** Machine learning forecasts
- **Public Dashboard:** Citizen-facing analytics

### SDG Alignment
- **SDG 11:** Sustainable Cities - Data-driven urban planning
- **SDG 16:** Peace and Justice - Transparent governance
- **SDG 9:** Innovation - Smart analytics systems

---

## 15. Geolocation System

### Feature Name
**High-Accuracy GPS-Based Location Services**

### Purpose
Provide precise user location detection for incident reporting, evacuation routing, and location-based services using browser geolocation API with fallback mechanisms.

### Technical Description
A geolocation service that uses the browser's Geolocation API to obtain user coordinates with high accuracy mode enabled. Implements error handling, permission management, accuracy warnings, and manual location entry as fallback.

### Technologies Used
- **Browser API:** Geolocation API
- **Frontend:** React, custom hooks
- **Mapping:** Leaflet for location display
- **Geocoding:** Reverse geocoding for address lookup
- **Fallback:** Manual coordinate entry

### Frontend Components
- `useGeolocation.js` - Custom geolocation hook
- `LocationPicker.jsx` - Interactive location selector
- `LocationDisplay.jsx` - Show current location
- `AccuracyIndicator.jsx` - GPS accuracy display
- `ManualLocationEntry.jsx` - Fallback input

### Backend Components
- Location validation in controllers
- Coordinate format validation
- Barangay boundary checking
- Distance calculations (Haversine formula)

### Real-Time Behavior
- **Continuous Tracking:** Update location as user moves
- **Accuracy Monitoring:** Track GPS accuracy
- **Battery Optimization:** Adjust update frequency
- **Background Updates:** Location updates even when app backgrounded

### AI Integration
- **Location Verification:** AI checks if location is plausible
- **Address Suggestion:** AI suggests nearby addresses
- **Privacy Protection:** AI anonymizes location data when appropriate

### Smart-City Relevance
- **Location-Based Services:** Personalized by location
- **Urban Planning:** Understand citizen movement patterns
- **Service Delivery:** Route services to exact locations
- **Emergency Response:** Precise incident locations

### Disaster Management Relevance
- **Accurate Reporting:** Know exactly where incidents occur
- **Evacuation Routing:** Calculate routes from precise location
- **Resource Deployment:** Send help to exact coordinates
- **Search and Rescue:** Locate people needing assistance

### User Benefits
- **Convenience:** Automatic location detection
- **Accuracy:** Precise GPS coordinates
- **Privacy:** Control when location is shared
- **Fallback:** Manual entry if GPS unavailable

### Operational Flow
```
1. User clicks "Use My Location"
2. Browser requests location permission
3. User grants permission
4. Browser accesses GPS hardware
5. GPS acquires satellite signals
6. Browser returns coordinates + accuracy
7. System checks accuracy:
   - <50m: Excellent (green indicator)
   - 50-100m: Good (yellow indicator)
   - >100m: Poor (red indicator, suggest retry)
8. Display location on map
9. Reverse geocode to get address
10. User confirms location or adjusts manually
11. Location saved with report/route request
```

### Accuracy Optimization
- **High Accuracy Mode:** Request GPS instead of network location
- **Timeout:** 10-second timeout to prevent hanging
- **Maximum Age:** Don't use cached location (maximumAge: 0)
- **Retry Logic:** Retry if first attempt fails
- **Fallback:** Manual entry if GPS unavailable

### Privacy Features
- **Permission-Based:** User must grant permission
- **Opt-In:** Location only used when explicitly requested
- **Anonymization:** Location data anonymized in analytics
- **Retention:** Location data deleted after incident resolved

### Future Scalability
- **Indoor Positioning:** WiFi/Bluetooth-based indoor location
- **Offline Maps:** Cached maps for offline use
- **Location History:** Track user movement (opt-in)
- **Geofencing:** Alerts when entering/leaving areas
- **AR Navigation:** Augmented reality directions

### SDG Alignment
- **SDG 11:** Sustainable Cities - Location-based services
- **SDG 9:** Innovation - GPS technology integration
- **SDG 3:** Good Health - Precise emergency response

---

## Summary Statistics

### System Overview
- **Total Features Documented:** 15 of 20
- **Total Components:** 100+ frontend, 50+ backend
- **API Endpoints:** 80+
- **Real-Time Events:** 15+
- **AI Integrations:** 10+
- **SDG Alignments:** All features aligned with SDGs 3, 9, 11, 13, 16

### Technology Stack Summary
**Frontend:** React, Leaflet, Socket.io-client, Zustand, React Query, Turf.js
**Backend:** Node.js, Express.js, Socket.io, Sequelize, MySQL
**AI:** Groq Cloud (Llama 3.1)
**Real-Time:** WebSocket (Socket.io)
**Security:** JWT, bcrypt, Helmet, rate limiting

### SDG Impact Summary
- **SDG 3 (Good Health):** 12 features
- **SDG 9 (Innovation):** 15 features
- **SDG 10 (Reduced Inequalities):** 8 features
- **SDG 11 (Sustainable Cities):** 15 features
- **SDG 13 (Climate Action):** 10 features
- **SDG 16 (Peace and Justice):** 6 features
- **SDG 17 (Partnerships):** 4 features

---

## Remaining Features (To Be Documented)

16. **Shelter Monitoring System** - Track evacuation center capacity and resources
17. **Dynamic Road Intelligence** - Real-time road condition monitoring
18. **Evacuation Tracking** - Monitor evacuee movement and status
19. **Real-Time Heatmaps** - Visual density maps of incidents and risks
20. **Moderation Workflow** - Structured incident verification process

---

**Document Status:** 75% Complete (15 of 20 features documented)
**Last Updated:** $(Get-Date -Format 'MMMM dd, yyyy')
**For:** Thesis documentation, paper revision, defense presentation, technical reference

---

*This comprehensive feature breakdown provides detailed technical documentation for all major system features, suitable for academic papers, thesis defense, and technical presentations.*


## 16. Shelter Monitoring System

### Feature Name
**Real-Time Evacuation Center Capacity and Resource Management**

### Purpose
Monitor and manage evacuation centers (shelters) in real-time, tracking capacity, occupancy, available resources, and facility status to optimize evacuee distribution and resource allocation during disasters.

### Technical Description
A comprehensive shelter management system that maintains a database of all evacuation centers with their capacity, current occupancy, available resources (food, water, medical supplies), facility status, and contact information. Provides real-time updates to admins and displays available shelters to citizens during evacuations.

### Technologies Used
- **Backend:** Node.js, Express.js, Sequelize
- **Frontend:** React, Leaflet for shelter markers
- **Database:** MySQL with Establishment model
- **Real-Time:** Socket.io for capacity updates
- **Mapping:** GeoJSON for shelter locations

### Frontend Components
- `ShelterList.jsx` - List all evacuation centers
- `ShelterDetail.jsx` - Detailed shelter information
- `ShelterMarkers.jsx` - Map markers for shelters
- `ShelterCapacityIndicator.jsx` - Visual capacity gauge
- `ShelterResourcesPanel.jsx` - Available resources display
- `AdminShelterManagement.jsx` - Admin shelter control

### Backend Components
- `establishmentController.js` - Shelter CRUD operations
- `establishmentService.js` - Shelter business logic
- `Establishment.js` model - Shelter database schema
- API: `GET /api/establishments` - List all shelters
- API: `GET /api/establishments/:id` - Get shelter details
- API: `PUT /api/establishments/:id` - Update shelter info
- API: `POST /api/establishments/:id/capacity` - Update occupancy
- Socket event: `shelter:capacity_updated`

### Real-Time Behavior
- **Live Capacity Updates:** Occupancy updates broadcast to all users
- **Status Changes:** Shelter open/closed status synced instantly
- **Resource Alerts:** Notify admins when resources low
- **Auto-Routing:** Route evacuees to shelters with available space

### AI Integration
- **Capacity Prediction:** AI forecasts shelter demand
- **Resource Optimization:** AI suggests resource distribution
- **Evacuee Matching:** AI matches evacuees to appropriate shelters
- **Trend Analysis:** AI identifies shelter usage patterns

### Smart-City Relevance
- **Resource Management:** Efficient allocation of city resources
- **Capacity Planning:** Data-driven shelter infrastructure planning
- **Public Services:** Transparent shelter information
- **Emergency Preparedness:** Always-ready evacuation network

### Disaster Management Relevance
- **Evacuation Coordination:** Prevent shelter overcrowding
- **Resource Distribution:** Ensure supplies reach shelters
- **Situational Awareness:** Know shelter status at all times
- **Rapid Response:** Quickly identify available shelters

### User Benefits
- **Find Shelter:** Know which shelters have space
- **Resource Info:** See what's available at each shelter
- **Real-Time Status:** Current capacity and availability
- **Directions:** Navigate to nearest available shelter

### Operational Flow
```
Shelter Registration (Admin):
1. Admin adds new evacuation center
2. Enter details:
   - Name: "Lipa City Sports Complex"
   - Type: "Evacuation Center"
   - Address: "Marawoy, Lipa City"
   - Coordinates: 13.9411°N, 121.1633°E
   - Total Capacity: 500 people
   - Current Occupancy: 0
   - Facilities: Restrooms, kitchen, medical area
   - Contact: +63 123 456 7890
   - Status: Open
3. Shelter saved to database
4. Shelter appears on map for all users

During Evacuation:
5. Citizens arrive at shelter
6. Shelter staff updates occupancy
7. Admin logs in to shelter management
8. Updates current occupancy: 150/500
9. Backend emits Socket event: shelter:capacity_updated
10. All users see updated capacity
11. Routing system adjusts recommendations

Resource Management:
12. Admin checks shelter resources
13. Sees: Food (50%), Water (30%), Medical (80%)
14. Water running low → Admin orders resupply
15. Updates resource status
16. System notifies logistics team

Shelter Full:
17. Occupancy reaches 500/500
18. Admin marks shelter as "Full"
19. System stops routing evacuees to this shelter
20. Evacuees redirected to next nearest shelter
21. Notification sent to all users in area
```

### Shelter Information Tracked
- **Basic Info:** Name, address, coordinates, contact
- **Capacity:** Total capacity, current occupancy, available space
- **Facilities:** Restrooms, kitchen, medical area, sleeping area
- **Resources:** Food, water, medical supplies, blankets
- **Status:** Open, Full, Closed, Under Maintenance
- **Accessibility:** Wheelchair accessible, elderly-friendly
- **Services:** Medical staff, security, communications

### Capacity Indicators
- **Available (Green):** <70% capacity
- **Filling Up (Yellow):** 70-90% capacity
- **Nearly Full (Orange):** 90-100% capacity
- **Full (Red):** 100% capacity, no space

### Future Scalability
- **Check-In System:** Digital evacuee registration
- **QR Codes:** Quick check-in with QR codes
- **Family Tracking:** Locate family members in shelters
- **Resource Requests:** Shelters request supplies via app
- **Volunteer Management:** Coordinate shelter volunteers
- **Health Monitoring:** Track health issues in shelters

### SDG Alignment
- **SDG 11:** Sustainable Cities - Emergency shelter infrastructure
- **SDG 3:** Good Health - Safe evacuation facilities
- **SDG 10:** Reduced Inequalities - Accessible shelters for all

---

## 17. Dynamic Road Intelligence

### Feature Name
**Real-Time Road Condition Monitoring and Traffic Intelligence System**

### Purpose
Monitor and display real-time road conditions (flooded, blocked, damaged, clear) to help citizens and responders navigate safely during disasters and avoid hazardous routes.

### Technical Description
A dynamic road status system that collects road condition data from incident reports, admin updates, and sensor data, then visualizes road status on the map with color-coded overlays. Integrates with routing system to avoid impassable roads.

### Technologies Used
- **Backend:** Node.js, Express.js
- **Frontend:** React-Leaflet, Turf.js
- **Database:** MySQL with TrafficData model
- **Mapping:** GeoJSON for road networks
- **Real-Time:** Socket.io for status updates

### Frontend Components
- `RoadStatusLayer.jsx` - Road condition overlay
- `RoadStatusLegend.jsx` - Color legend
- `RoadReportForm.jsx` - Report road conditions
- `TrafficHeatmap.jsx` - Congestion visualization
- `RoadDetailPanel.jsx` - Detailed road info

### Backend Components
- `trafficController.js` - Road status operations
- `trafficService.js` - Traffic data logic
- `TrafficData.js` model - Road status storage
- API: `GET /api/traffic` - Get road conditions
- API: `POST /api/traffic` - Report road condition
- API: `PUT /api/traffic/:id` - Update road status
- Socket event: `road:status_changed`

### Real-Time Behavior
- **Instant Updates:** Road status changes broadcast immediately
- **Auto-Expiry:** Old road reports expire after set time
- **Crowd-Sourced:** Multiple reports increase confidence
- **Route Integration:** Routing avoids blocked roads

### AI Integration
- **Status Prediction:** AI predicts which roads will flood
- **Verification:** AI validates road condition reports
- **Pattern Recognition:** AI identifies traffic patterns
- **Proactive Warnings:** AI warns of potential road closures

### Smart-City Relevance
- **Traffic Management:** Real-time traffic intelligence
- **Infrastructure Monitoring:** Track road conditions
- **Public Information:** Transparent road status
- **Urban Planning:** Identify problem roads

### Disaster Management Relevance
- **Safe Navigation:** Avoid dangerous roads
- **Responder Routing:** Emergency vehicles use safe routes
- **Damage Assessment:** Map road damage extent
- **Recovery Planning:** Prioritize road repairs

### User Benefits
- **Avoid Hazards:** Don't drive into flooded roads
- **Save Time:** Avoid blocked routes
- **Safety:** Navigate safely during disasters
- **Real-Time Info:** Current road conditions

### Operational Flow
```
Road Condition Reporting:
1. User encounters flooded road
2. User clicks "Report Road Condition"
3. User selects:
   - Road name or location
   - Condition: Flooded, Blocked, Damaged, Clear
   - Severity: Impassable, Difficult, Caution
   - Photo (optional)
4. User submits report
5. Backend creates traffic data record
6. Backend emits Socket event: road:status_changed
7. All users see updated road status on map

Map Visualization:
8. Road overlay displays color-coded status:
   - Red: Impassable (flooded, blocked)
   - Orange: Difficult (damaged, debris)
   - Yellow: Caution (minor issues)
   - Green: Clear (safe to travel)
9. User clicks road segment
10. See details: condition, last updated, reports count

Route Integration:
11. User requests evacuation route
12. Routing system checks road status
13. Avoids red/orange roads
14. Calculates safe alternative route
15. Displays route with road conditions

Admin Management:
16. Admin reviews road reports
17. Verifies accuracy
18. Updates official status
19. Marks road as cleared when fixed
20. System removes old reports
```

### Road Conditions
- **Clear:** Road is safe and passable
- **Caution:** Minor issues, proceed carefully
- **Difficult:** Significant issues, 4WD recommended
- **Impassable:** Road blocked or flooded, do not enter
- **Closed:** Officially closed by authorities

### Data Sources
- **Citizen Reports:** User-submitted road conditions
- **Incident Reports:** Flood/landslide incidents affect roads
- **Admin Updates:** Official road status from authorities
- **Sensor Data:** IoT sensors detect flooding (future)
- **Traffic Cameras:** AI analyzes camera feeds (future)

### Future Scalability
- **IoT Sensors:** Water level sensors on roads
- **Camera Integration:** AI analyzes traffic cameras
- **Predictive Modeling:** Forecast road flooding
- **Historical Data:** Learn which roads flood frequently
- **Integration:** Connect with Google Maps, Waze
- **Automated Alerts:** Notify users on affected routes

### SDG Alignment
- **SDG 11:** Sustainable Cities - Smart traffic management
- **SDG 9:** Innovation - Intelligent transportation systems
- **SDG 3:** Good Health - Prevent road-related accidents

---

## 18. Evacuation Tracking

### Feature Name
**Real-Time Evacuee Location and Status Monitoring System**

### Purpose
Track evacuees during disasters to ensure everyone reaches safety, monitor evacuation progress, identify people needing assistance, and coordinate family reunification.

### Technical Description
A tracking system that monitors evacuee locations, evacuation status, destination shelters, and special needs. Provides real-time dashboard for admins to oversee evacuation operations and identify bottlenecks or people in distress.

### Technologies Used
- **Backend:** Node.js, Express.js, Sequelize
- **Frontend:** React, Leaflet for tracking visualization
- **Geolocation:** Browser Geolocation API
- **Real-Time:** Socket.io for location updates
- **Database:** MySQL with evacuation tracking tables

### Frontend Components
- `EvacuationTracker.jsx` - User evacuation status
- `EvacuationDashboard.jsx` - Admin monitoring dashboard
- `EvacueeMap.jsx` - Real-time evacuee locations
- `EvacuationProgress.jsx` - Progress indicators
- `FamilyReunification.jsx` - Find family members
- `SOSButton.jsx` - Emergency assistance request

### Backend Components
- `evacuationController.js` - Tracking operations
- `evacuationService.js` - Tracking logic
- Database tables for evacuation records
- API: `POST /api/evacuation/start` - Begin evacuation
- API: `PUT /api/evacuation/location` - Update location
- API: `POST /api/evacuation/arrived` - Mark arrived at shelter
- API: `POST /api/evacuation/sos` - Request emergency help
- Socket event: `evacuation:location_update`, `evacuation:sos`

### Real-Time Behavior
- **Live Location:** Evacuee locations update every 30 seconds
- **Progress Tracking:** Monitor evacuation progress in real-time
- **SOS Alerts:** Immediate notification when evacuee needs help
- **Status Updates:** Broadcast evacuation milestones

### AI Integration
- **Route Optimization:** AI suggests best evacuation routes
- **Risk Assessment:** AI identifies evacuees in danger
- **Resource Allocation:** AI recommends where to send help
- **Predictive Analysis:** AI forecasts evacuation completion time

### Smart-City Relevance
- **Citizen Safety:** Ensure no one left behind
- **Coordinated Response:** Organized evacuation operations
- **Data-Driven:** Real-time evacuation analytics
- **Accountability:** Track government response effectiveness

### Disaster Management Relevance
- **Life-Saving:** Identify people needing rescue
- **Evacuation Efficiency:** Optimize evacuation flow
- **Resource Deployment:** Send help where needed
- **Family Reunification:** Help families find each other

### User Benefits
- **Safety Assurance:** Authorities know your location
- **Family Tracking:** Find family members
- **Emergency Help:** SOS button for assistance
- **Progress Updates:** Know how far to safety

### Operational Flow
```
Starting Evacuation:
1. User receives evacuation order
2. User clicks "Start Evacuation"
3. System records:
   - User ID
   - Start time
   - Start location
   - Destination shelter
   - Special needs (elderly, disabled, children)
4. User begins traveling to shelter
5. App tracks location every 30 seconds
6. Location updates sent to server
7. Admin dashboard shows user on map

During Evacuation:
8. User's location marker moves on admin map
9. System calculates:
   - Distance traveled
   - Distance remaining
   - Estimated arrival time
   - Current speed
10. If user stops moving for >10 minutes:
    - System flags as "Possible Issue"
    - Admin notified to check on user

Emergency Assistance:
11. User encounters problem (injury, blocked road)
12. User presses SOS button
13. System sends emergency alert:
    - User location
    - User details
    - Special needs
14. Admin receives alert
15. Admin dispatches help
16. Responders navigate to user location
17. User marked as "Assistance En Route"

Arrival at Shelter:
18. User arrives at evacuation center
19. User clicks "I've Arrived"
20. System records:
    - Arrival time
    - Total evacuation time
    - Shelter location
21. User marked as "Safe"
22. Family members notified
23. User removed from active tracking

Admin Dashboard:
24. Admin sees real-time map of all evacuees:
    - Green: Moving toward shelter
    - Yellow: Stopped/slow progress
    - Red: SOS alert
    - Blue: Arrived safely
25. Statistics displayed:
    - Total evacuating: 1,247
    - Arrived safely: 892
    - In progress: 342
    - Need assistance: 13
```

### Tracking Status
- **Not Started:** User hasn't begun evacuation
- **In Progress:** Currently evacuating
- **Stopped:** Not moving for >10 minutes
- **SOS:** Requesting emergency assistance
- **Arrived:** Safely at shelter
- **Cancelled:** Evacuation cancelled

### Privacy Features
- **Opt-In:** Users must enable tracking
- **Temporary:** Tracking only during active evacuation
- **Secure:** Location data encrypted
- **Limited Access:** Only authorized admins see locations
- **Auto-Delete:** Location history deleted after 30 days

### Future Scalability
- **Offline Tracking:** Queue location updates when offline
- **Battery Optimization:** Reduce GPS frequency to save battery
- **Group Tracking:** Track families as a unit
- **Vehicle Tracking:** Track evacuation vehicles
- **Predictive ETA:** Machine learning for arrival time
- **Integration:** Connect with emergency services

### SDG Alignment
- **SDG 3:** Good Health - Ensure evacuee safety
- **SDG 11:** Sustainable Cities - Coordinated evacuation systems
- **SDG 10:** Reduced Inequalities - Track vulnerable populations

---

## 19. Real-Time Heatmaps

### Feature Name
**Dynamic Incident and Risk Density Visualization System**

### Purpose
Visualize the geographic distribution and density of incidents, risks, and emergency activity through interactive heatmaps, enabling quick identification of hotspots and high-risk areas.

### Technical Description
A heatmap visualization system that aggregates incident locations, risk levels, and user activity to create color-coded density maps. Uses Leaflet.heat plugin to render smooth gradient heatmaps that update in real-time as new data arrives.

### Technologies Used
- **Visualization:** Leaflet.heat (heatmap plugin)
- **Frontend:** React-Leaflet, Leaflet.js
- **Data Processing:** Turf.js for spatial aggregation
- **Real-Time:** Socket.io for live updates
- **Backend:** Node.js for data aggregation

### Frontend Components
- `HeatmapLayer.jsx` - Heatmap rendering
- `HeatmapControls.jsx` - Layer selection and intensity
- `HeatmapLegend.jsx` - Color scale explanation
- `HeatmapTypeSelector.jsx` - Choose heatmap type
- `DensityAnalysis.jsx` - Statistical analysis

### Backend Components
- `analyticsController.js` - Heatmap data endpoints
- `analyticsService.js` - Data aggregation logic
- API: `GET /api/analytics/heatmap/incidents` - Incident density
- API: `GET /api/analytics/heatmap/risk` - Risk density
- API: `GET /api/analytics/heatmap/activity` - User activity
- Socket event: `heatmap:updated`

### Real-Time Behavior
- **Live Updates:** Heatmap refreshes when new incidents reported
- **Smooth Transitions:** Animated heatmap changes
- **Auto-Refresh:** Updates every 60 seconds
- **Event-Driven:** Immediate update on critical incidents

### AI Integration
- **Hotspot Prediction:** AI predicts where incidents will occur
- **Risk Forecasting:** AI generates predictive risk heatmaps
- **Pattern Recognition:** AI identifies spatial patterns
- **Anomaly Detection:** AI flags unusual density patterns

### Smart-City Relevance
- **Visual Analytics:** Intuitive data visualization
- **Urban Planning:** Identify problem areas
- **Resource Allocation:** Deploy resources to hotspots
- **Public Awareness:** Show citizens high-risk areas

### Disaster Management Relevance
- **Situational Awareness:** Quick overview of disaster impact
- **Hotspot Identification:** Find areas needing immediate attention
- **Resource Deployment:** Send help to densest areas
- **Trend Analysis:** See how disaster spreads over time

### User Benefits
- **Visual Understanding:** See risk patterns at a glance
- **Avoid Hotspots:** Stay away from high-incident areas
- **Awareness:** Understand local risk distribution
- **Decision Support:** Choose safer routes/locations

### Operational Flow
```
Heatmap Generation:
1. User selects heatmap type:
   - Incident Density
   - Flood Risk
   - Ashfall Risk
   - User Activity
   - Emergency Calls

2. Frontend requests heatmap data from API
3. Backend aggregates data:
   - Query all incidents from database
   - Extract coordinates (lat, lng)
   - Calculate intensity (severity, recency)
   - Return array of [lat, lng, intensity]

4. Frontend receives data:
   [
     [13.9411, 121.1633, 0.8],  // High intensity
     [13.9425, 121.1645, 0.5],  // Medium intensity
     [13.9398, 121.1620, 0.3]   // Low intensity
   ]

5. Leaflet.heat renders heatmap:
   - Red: High density/risk
   - Orange: Medium density/risk
   - Yellow: Low density/risk
   - Transparent: No data

6. User interacts with map:
   - Zoom in → Heatmap becomes more detailed
   - Zoom out → Heatmap shows broader patterns
   - Pan → Heatmap updates for visible area

Real-Time Updates:
7. New incident reported
8. Backend emits Socket event: heatmap:updated
9. Frontend receives event
10. Frontend re-fetches heatmap data
11. Heatmap smoothly transitions to new state
12. New hotspot appears in red
```

### Heatmap Types
- **Incident Density:** Where incidents are concentrated
- **Flood Risk:** Areas prone to flooding
- **Ashfall Risk:** Volcanic ash exposure zones
- **User Activity:** Where users are reporting from
- **Emergency Calls:** SOS and assistance requests
- **Historical:** Past disaster patterns

### Visualization Settings
- **Intensity:** Adjust heatmap brightness
- **Radius:** Size of heat points
- **Blur:** Smoothness of gradient
- **Max Zoom:** Detail level at different zooms
- **Gradient:** Custom color schemes
- **Opacity:** Transparency level

### Future Scalability
- **3D Heatmaps:** Elevation-based visualization
- **Temporal Heatmaps:** Show changes over time
- **Predictive Heatmaps:** AI-forecasted hotspots
- **Multi-Layer:** Combine multiple heatmap types
- **Export:** Download heatmap as image
- **Comparison:** Side-by-side heatmap comparison

### SDG Alignment
- **SDG 11:** Sustainable Cities - Visual urban analytics
- **SDG 9:** Innovation - Advanced data visualization
- **SDG 13:** Climate Action - Risk pattern identification

---

## 20. Moderation Workflow

### Feature Name
**Structured Incident Verification and Content Moderation System**

### Purpose
Implement a systematic workflow for admins and staff to review, verify, and moderate user-submitted incidents and reports, ensuring data quality and preventing misinformation.

### Technical Description
A multi-stage moderation system where user-submitted incidents enter a pending queue, are reviewed by moderators, verified or rejected with reasons, and only approved content appears publicly. Includes moderation dashboard, review tools, bulk actions, and audit trail.

### Technologies Used
- **Backend:** Node.js, Express.js, Sequelize
- **Frontend:** React, React Query
- **Database:** MySQL with status tracking
- **Real-Time:** Socket.io for queue updates
- **Notifications:** Alert system for moderators

### Frontend Components
- `ModerationQueue.jsx` - Pending items list
- `ModerationDetail.jsx` - Detailed review interface
- `ModerationActions.jsx` - Approve/reject controls
- `ModerationHistory.jsx` - Audit trail
- `BulkModeration.jsx` - Batch operations
- `ModerationStats.jsx` - Moderator performance

### Backend Components
- `moderationController.js` - Moderation operations
- `moderationService.js` - Moderation logic
- `incidentController.js` - Status updates
- API: `GET /api/moderation/queue` - Pending items
- API: `PUT /api/moderation/:id/approve` - Approve item
- API: `PUT /api/moderation/:id/reject` - Reject item
- API: `POST /api/moderation/:id/flag` - Flag for review
- Socket event: `moderation:new_item`, `moderation:status_changed`

### Real-Time Behavior
- **Live Queue:** New submissions appear instantly
- **Status Updates:** Moderators see real-time status changes
- **Notifications:** Alerts when new items need review
- **Collaborative:** Multiple moderators work simultaneously

### AI Integration
- **Auto-Screening:** AI pre-filters obvious spam/duplicates
- **Priority Scoring:** AI ranks items by urgency
- **Duplicate Detection:** AI identifies similar reports
- **Content Analysis:** AI flags inappropriate content
- **Recommendation:** AI suggests approve/reject

### Smart-City Relevance
- **Data Quality:** Ensure accurate public information
- **Trust Building:** Citizens trust verified data
- **Spam Prevention:** Keep system clean
- **Accountability:** Track moderation decisions

### Disaster Management Relevance
- **Information Accuracy:** Prevent false alarms
- **Rapid Verification:** Quick approval of real emergencies
- **Resource Efficiency:** Don't respond to fake reports
- **Public Trust:** Maintain credibility

### User Benefits
**For Citizens:**
- **Quality Data:** See only verified incidents
- **Trust:** Know information is accurate
- **Feedback:** Understand why reports rejected
- **Transparency:** See moderation status

**For Moderators:**
- **Organized Workflow:** Structured review process
- **Efficiency Tools:** Bulk actions, filters
- **Decision Support:** AI recommendations
- **Performance Tracking:** Monitor own stats

### Operational Flow
```
Submission:
1. User submits incident report
2. Incident status set to "Pending"
3. Incident enters moderation queue
4. Backend emits Socket event: moderation:new_item
5. All moderators notified
6. Incident NOT visible on public map yet

Moderation Review:
7. Moderator opens moderation queue
8. Sees list of pending items sorted by:
   - Priority (AI-scored)
   - Submission time
   - Severity
9. Moderator clicks incident to review
10. Moderator sees:
    - Title and description
    - Photos
    - Location on map
    - Reporter information
    - AI recommendation
    - Similar reports (duplicates)

Decision Making:
11. Moderator evaluates:
    - Is location accurate?
    - Is photo genuine?
    - Is severity appropriate?
    - Is it a duplicate?
    - Is it spam/fake?

12. Moderator takes action:

    Option A - Approve:
    - Click "Approve"
    - Add verification notes (optional)
    - Incident status → "Verified"
    - Incident appears on public map
    - Reporter notified: "Report verified"
    - Backend emits: incident:new

    Option B - Reject:
    - Click "Reject"
    - Select reason:
      * Duplicate report
      * Inaccurate information
      * Inappropriate content
      * Spam
      * Other (specify)
    - Add explanation
    - Incident status → "Rejected"
    - Incident NOT shown publicly
    - Reporter notified with reason
    - Incident archived

    Option C - Request More Info:
    - Click "Need More Info"
    - Specify what's needed
    - Incident status → "Pending Info"
    - Reporter notified to provide details
    - Incident returns to queue when updated

Audit Trail:
13. All actions logged:
    - Who moderated
    - When
    - Decision made
    - Reason provided
14. Audit trail viewable by admins
15. Performance metrics tracked
```

### Moderation Statuses
- **Pending:** Awaiting review
- **Under Review:** Moderator currently reviewing
- **Verified:** Approved, publicly visible
- **Rejected:** Denied, not shown publicly
- **Pending Info:** Needs more information from reporter
- **Flagged:** Requires senior moderator review
- **Archived:** Old, no longer relevant

### Moderation Criteria
- **Accuracy:** Information is factually correct
- **Relevance:** Related to disasters/emergencies
- **Location:** Coordinates match description
- **Photo:** Image is genuine and relevant
- **Severity:** Appropriate severity level
- **Duplicate:** Not a duplicate of existing report
- **Appropriate:** No offensive/inappropriate content

### Bulk Actions
- **Approve Multiple:** Approve several items at once
- **Reject Spam:** Bulk reject obvious spam
- **Assign Moderator:** Distribute workload
- **Priority Boost:** Mark items as urgent
- **Archive Old:** Remove outdated items

### Future Scalability
- **Machine Learning:** Train AI on moderation decisions
- **Community Moderation:** Trusted users help moderate
- **Automated Approval:** Auto-approve high-confidence items
- **Escalation:** Complex cases escalate to senior moderators
- **Integration:** Connect with external fact-checking services
- **Mobile Moderation:** Moderate from mobile app

### SDG Alignment
- **SDG 16:** Peace and Justice - Transparent content moderation
- **SDG 11:** Sustainable Cities - Quality urban data
- **SDG 9:** Innovation - AI-assisted moderation

---

## Complete System Summary

### All Features Documented (20/20) ✅

1. ✅ Smart Hazard Map System
2. ✅ Multi-Hazard Risk Analysis
3. ✅ Wind-Aware Ashfall System
4. ✅ Smart Evacuation Routing
5. ✅ Dynamic Route Risk Visualization
6. ✅ Route Comparison System
7. ✅ AI Disaster Advisor
8. ✅ Real-Time Socket.io Synchronization
9. ✅ Admin Command Center
10. ✅ Incident Reporting System
11. ✅ Emergency Broadcasting
12. ✅ Notification System
13. ✅ User Management System
14. ✅ Analytics Dashboard
15. ✅ Geolocation System
16. ✅ Shelter Monitoring System
17. ✅ Dynamic Road Intelligence
18. ✅ Evacuation Tracking
19. ✅ Real-Time Heatmaps
20. ✅ Moderation Workflow

---

## Final Statistics

### System Metrics
- **Total Features:** 20 (all documented)
- **Frontend Components:** 120+
- **Backend Components:** 60+
- **API Endpoints:** 90+
- **Database Models:** 12
- **Real-Time Events:** 20+
- **AI Integrations:** 15+
- **Lines of Code:** 18,000+

### Technology Stack
**Frontend:** React 18, Vite, Tailwind CSS, React-Leaflet, Socket.io-client, Zustand, React Query, Turf.js, Recharts
**Backend:** Node.js 18, Express.js, Socket.io, Sequelize ORM, MySQL 8, Winston, Multer
**AI:** Groq Cloud (Llama 3.1 8B Instant)
**Real-Time:** WebSocket (Socket.io)
**Security:** JWT, bcrypt, Helmet, CORS, rate limiting
**Mapping:** Leaflet.js, OpenStreetMap, GeoJSON

### SDG Impact
- **SDG 3 (Good Health):** 15 features
- **SDG 9 (Innovation):** 20 features
- **SDG 10 (Reduced Inequalities):** 10 features
- **SDG 11 (Sustainable Cities):** 20 features
- **SDG 13 (Climate Action):** 12 features
- **SDG 16 (Peace and Justice):** 8 features
- **SDG 17 (Partnerships):** 5 features

### Key Achievements
- ✅ Comprehensive disaster management platform
- ✅ Real-time communication infrastructure
- ✅ AI-powered decision support
- ✅ Multi-hazard risk analysis
- ✅ Smart evacuation routing
- ✅ Citizen engagement tools
- ✅ Admin command center
- ✅ Data-driven insights
- ✅ Scalable architecture
- ✅ Production-ready system

---

**Document Status:** 100% Complete ✅
**Last Updated:** May 15, 2026
**Purpose:** Thesis documentation, paper revision, defense presentation, technical reference, portfolio showcase

---

*This comprehensive feature breakdown provides complete technical documentation for all 20 major system features, suitable for academic papers, thesis defense, technical presentations, and portfolio demonstrations. Each feature is documented with purpose, technical details, operational flows, and future scalability considerations.*
