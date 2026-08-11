# 🤖 AI Service Architecture Guide

## Overview

The **AI Service Architecture** provides intelligent disaster response capabilities powered by Groq's LLaMA 3.1 model. The system includes context-aware chatbot responses, comprehensive risk analysis, and intelligent route recommendations with safety overrides.

---

## 🎯 Features

### Core AI Services
- ✅ **Context-Aware Chatbot** - Natural language disaster response assistant
- ✅ **Risk Analysis** - Comprehensive hazard assessment
- ✅ **Route Recommendations** - Intelligent routing with safety considerations
- ✅ **Multi-Hazard Analysis** - Combined risk evaluation
- ✅ **Evacuation Center Finder** - Nearest safe location identification
- ✅ **Safety Override Logic** - Critical safety warnings take precedence
- ✅ **Fallback Responses** - Graceful degradation when AI is unavailable

### Safety Features
- ✅ **Automatic Safety Overrides** - High-risk conditions trigger immediate warnings
- ✅ **Multi-Hazard Awareness** - Considers flood, ashfall, wind, and other factors
- ✅ **Context-Sensitive Responses** - Tailored advice based on current conditions
- ✅ **Actionable Recommendations** - Clear, direct safety instructions

---

## 📁 Architecture

### Files Created

```
backend/
├── services/
│   ├── aiService.js                      # Core AI logic & Groq API integration
│   ├── chatbotService.js                 # Context-aware chatbot
│   ├── riskAnalysisService.js            # Risk assessment & analysis
│   └── routeRecommendationService.js     # Intelligent routing
├── controllers/
│   └── aiController.js                   # AI HTTP handlers
├── validators/
│   └── aiValidator.js                    # AI input validation
└── routes/
    └── aiRoutes.js                       # AI API routes (updated)
```

---

## 🔌 API Endpoints

### Chatbot Endpoints

#### 1. Process Chatbot Query
```http
POST /api/ai/chatbot
```

**Request Body:**
```json
{
  "question": "Is my area safe?",
  "hazard_data": {
    "flood_risk": "high",
    "ashfall_risk": "medium",
    "wind_direction": "northeast",
    "wind_speed": "15 km/h",
    "barangay_name": "Barangay 12"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Your area is not safe due to high flood risk. Please evacuate to higher ground immediately and follow official evacuation orders.",
    "context": {
      "flood_risk": "high",
      "ashfall_risk": "medium",
      "wind_direction": "northeast",
      "barangay_name": "Barangay 12",
      "is_safe": false
    },
    "source": "safety_override"
  },
  "message": "Chatbot response generated successfully"
}
```

**Sources:**
- `safety_override` - Critical safety warning (highest priority)
- `specific_override` - Specific hazard response
- `ai` - AI-generated response from Groq
- `fallback` - Rule-based fallback response

---

#### 2. Get Chatbot Suggestions
```http
POST /api/ai/chatbot/suggestions
```

**Request Body:**
```json
{
  "hazard_data": {
    "flood_risk": "high",
    "ashfall_risk": "low"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "What should I do during a flood?",
      "Where are the nearest evacuation centers?",
      "How do I prepare an emergency kit?"
    ]
  },
  "message": "Suggestions retrieved successfully"
}
```

---

### Risk Analysis Endpoints

#### 3. Analyze Location Risk
```http
POST /api/ai/analyze-risk
```

**Request Body:**
```json
{
  "latitude": 13.9411,
  "longitude": 121.1628,
  "risk_score": 0.85,
  "q50": 0.5,
  "q80": 0.8,
  "flood_risk": "high",
  "ashfall_risk": "medium",
  "elevation": 95,
  "distance_to_volcano": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "overall_risk": "high",
      "risk_score": 0.85,
      "flood_risk": "high",
      "ashfall_risk": "medium",
      "is_safe": false,
      "risk_factors": [
        {
          "factor": "High Flood Risk",
          "severity": "critical",
          "description": "Area is prone to severe flooding"
        },
        {
          "factor": "Low Elevation",
          "severity": "medium",
          "description": "Low-lying area susceptible to flooding"
        }
      ],
      "recommendations": [
        {
          "priority": "immediate",
          "action": "Evacuate to designated evacuation center",
          "reason": "High hazard levels detected"
        },
        {
          "priority": "immediate",
          "action": "Move to higher ground immediately",
          "reason": "High flood risk"
        }
      ],
      "location": {
        "latitude": 13.9411,
        "longitude": 121.1628,
        "elevation": 95,
        "distance_to_volcano": 25
      }
    }
  },
  "message": "Risk analysis completed successfully"
}
```

---

#### 4. Analyze Barangay Risk
```http
GET /api/ai/analyze-risk/barangay/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "barangay_id": 1,
      "barangay_name": "Barangay 12 Poblacion",
      "base_risk_level": "high",
      "calculated_risk_score": 75,
      "recent_incidents": 12,
      "critical_incidents": 2,
      "population": 5000,
      "risk_assessment": "Critical - Immediate action required",
      "recommendations": [
        "Deploy emergency response teams",
        "Activate evacuation protocols",
        "Establish emergency operations center"
      ]
    }
  },
  "message": "Barangay risk analysis completed successfully"
}
```

---

#### 5. Multi-Hazard Analysis
```http
POST /api/ai/analyze-risk/multi-hazard
```

**Request Body:**
```json
{
  "hazard_data": {
    "flood_risk": "high",
    "ashfall_risk": "medium",
    "wind_direction": "northeast",
    "wind_speed": "20 km/h"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "primary_hazard": {
        "type": "flood",
        "level": "high",
        "severity": 100,
        "description": "Severe flooding likely, evacuation recommended"
      },
      "all_hazards": [
        {
          "type": "flood",
          "level": "high",
          "severity": 100,
          "description": "Severe flooding likely, evacuation recommended"
        },
        {
          "type": "ashfall",
          "level": "medium",
          "severity": 50,
          "description": "Moderate ashfall expected, limit outdoor activities"
        }
      ],
      "combined_risk_level": "high",
      "is_safe": false,
      "immediate_actions": [
        "Evacuate to higher ground immediately"
      ],
      "long_term_preparations": [
        "Maintain emergency kit with 3-day supplies",
        "Know evacuation routes and centers",
        "Keep important documents in waterproof container",
        "Establish family communication plan",
        "Stay informed through official channels"
      ]
    }
  },
  "message": "Multi-hazard analysis completed successfully"
}
```

---

### Route Recommendation Endpoints

#### 6. Get Route Recommendation
```http
POST /api/ai/route-recommendation
```

**Request Body:**
```json
{
  "origin": {
    "lat": 13.9411,
    "lng": 121.1628
  },
  "destination": {
    "lat": 13.9500,
    "lng": 121.1700
  },
  "flood_risk": "high",
  "ashfall_risk": "medium",
  "wind_direction": "northeast",
  "avoid_high_risk": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "route": {
        "origin": { "lat": 13.9411, "lng": 121.1628 },
        "destination": { "lat": 13.9500, "lng": 121.1700 },
        "is_safe": false,
        "safety_score": 10,
        "estimated_risk_level": "high"
      },
      "hazards": [
        {
          "type": "flood",
          "level": "high",
          "impact": "Route may be impassable due to flooding"
        },
        {
          "type": "ashfall",
          "level": "medium",
          "impact": "Reduced visibility possible"
        }
      ],
      "warnings": [
        {
          "severity": "critical",
          "message": "This route is not recommended due to high hazard levels",
          "action": "Consider alternative routes or delay travel"
        },
        {
          "severity": "high",
          "message": "High flood risk along route",
          "action": "Route may be impassable due to flooding"
        }
      ],
      "recommendations": [
        "Avoid travel if possible",
        "If travel is necessary, use alternative routes",
        "Travel only during daylight hours",
        "Never attempt to cross flooded roads",
        "Turn around if you encounter water on the road"
      ],
      "alternatives": [
        {
          "name": "Alternative Route 1",
          "description": "Via main highway (longer but safer)",
          "estimated_safety": "medium"
        },
        {
          "name": "Alternative Route 2",
          "description": "Via elevated roads (recommended)",
          "estimated_safety": "high"
        }
      ]
    }
  },
  "message": "Route recommendation generated successfully"
}
```

---

#### 7. Find Nearest Evacuation Center
```http
POST /api/ai/route-recommendation/evacuation-center
```

**Request Body:**
```json
{
  "latitude": 13.9411,
  "longitude": 121.1628,
  "barangay_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "found": true,
    "nearest": {
      "id": 5,
      "name": "Barangay 12 Covered Court",
      "address": "Main Street, Barangay 12",
      "latitude": 13.9420,
      "longitude": 121.1635,
      "distance": 0.15,
      "barangay": {
        "id": 1,
        "name": "Barangay 12 Poblacion",
        "risk_level": "high"
      },
      "capacity": 500,
      "contact": "043-123-4567"
    },
    "alternatives": [
      {
        "id": 8,
        "name": "Lipa City Sports Complex",
        "distance": 1.2
      }
    ],
    "total_available": 5
  },
  "message": "Nearest evacuation center found successfully"
}
```

---

#### 8. Get Route Hazard Score
```http
POST /api/ai/route-recommendation/hazard-score
```

**Request Body:**
```json
{
  "route_points": [
    { "lat": 13.9411, "lng": 121.1628 },
    { "lat": 13.9450, "lng": 121.1650 },
    { "lat": 13.9500, "lng": 121.1700 }
  ],
  "hazard_data": {
    "flood_risk": "medium",
    "ashfall_risk": "low"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": {
      "average_score": 25,
      "max_risk_level": "medium",
      "is_recommended": true,
      "points_analyzed": 3
    }
  },
  "message": "Route hazard score calculated successfully"
}
```

---

#### 9. Check Route Incidents
```http
POST /api/ai/route-recommendation/check-incidents
```

**Request Body:**
```json
{
  "barangay_ids": [1, 2, 3, 12]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "has_incidents": true,
    "incident_count": 2,
    "incidents": [
      {
        "id": 15,
        "type": "flood",
        "severity": "critical",
        "title": "Severe flooding on Main Street",
        "barangay": "Barangay 12 Poblacion",
        "created_at": "2026-05-14T10:30:00Z"
      },
      {
        "id": 18,
        "type": "road_damage",
        "severity": "high",
        "title": "Road collapsed near bridge",
        "barangay": "Barangay 2",
        "created_at": "2026-05-14T09:15:00Z"
      }
    ]
  },
  "message": "Route incidents checked successfully"
}
```

---

#### 10. AI Service Health Check
```http
GET /api/ai/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "operational",
    "services": {
      "chatbot": "available",
      "risk_analysis": "available",
      "route_recommendation": "available"
    },
    "groq_api": "configured",
    "fallback_mode": false
  },
  "message": "AI service health check completed"
}
```

---

## 🛡️ Safety Override System

### Priority Levels

1. **Safety Override (Highest Priority)**
   - Triggered when flood_risk OR ashfall_risk is "high"
   - Bypasses AI and provides immediate safety warning
   - Cannot be overridden by AI responses

2. **Specific Override**
   - Triggered for specific hazard questions with high risk
   - Example: Asking about ashfall when ashfall_risk is high

3. **AI Response**
   - Generated by Groq API when no overrides are triggered
   - Context-aware and tailored to current conditions

4. **Fallback Response**
   - Used when AI service is unavailable
   - Rule-based responses based on hazard levels

### Safety Override Examples

```javascript
// High flood risk - Safety override
{
  "flood_risk": "high",
  "ashfall_risk": "low"
}
// Response: "Your area is not safe due to high flood risk..."

// High ashfall risk - Safety override
{
  "flood_risk": "low",
  "ashfall_risk": "high"
}
// Response: "Your area is not safe due to high ashfall risk..."

// Both high - Safety override (flood takes precedence)
{
  "flood_risk": "high",
  "ashfall_risk": "high"
}
// Response: "Your area is not safe due to high flood risk..."
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### Get Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

---

## 🧪 Testing Examples

### Test Chatbot (cURL)

```bash
curl -X POST http://localhost:5000/api/ai/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Is my area safe?",
    "hazard_data": {
      "flood_risk": "high",
      "ashfall_risk": "medium"
    }
  }'
```

### Test Risk Analysis (JavaScript)

```javascript
const response = await fetch('http://localhost:5000/api/ai/analyze-risk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    latitude: 13.9411,
    longitude: 121.1628,
    risk_score: 0.85,
    flood_risk: 'high',
    ashfall_risk: 'medium'
  })
});

const data = await response.json();
console.log(data.data.analysis);
```

### Test Route Recommendation (Python)

```python
import requests

response = requests.post('http://localhost:5000/api/ai/route-recommendation', json={
    'origin': {'lat': 13.9411, 'lng': 121.1628},
    'destination': {'lat': 13.9500, 'lng': 121.1700},
    'flood_risk': 'high',
    'ashfall_risk': 'medium'
})

print(response.json())
```

---

## 📊 Service Architecture

### AI Service (Core)
- Groq API integration
- Risk level calculation
- Safety override logic
- Hazard context building
- Fallback response generation

### Chatbot Service
- Natural language processing
- Context-aware responses
- Suggestion generation
- Input sanitization
- Multi-source response handling

### Risk Analysis Service
- Location risk assessment
- Barangay risk scoring
- Multi-hazard analysis
- Risk factor identification
- Recommendation generation

### Route Recommendation Service
- Route safety analysis
- Evacuation center finder
- Hazard score calculation
- Incident checking
- Alternative route suggestions

---

## 🔄 Response Flow

```
User Query
    ↓
Input Validation
    ↓
Safety Override Check
    ↓ (if no override)
AI Service (Groq API)
    ↓ (if AI fails)
Fallback Response
    ↓
Response to User
```

---

## 🎯 Use Cases

### 1. Emergency Chatbot
```javascript
// User asks: "Should I evacuate?"
// System checks hazard levels
// If high risk: Safety override response
// If medium/low: AI-generated contextual advice
```

### 2. Risk Assessment
```javascript
// User provides location
// System analyzes all hazards
// Returns comprehensive risk profile
// Provides actionable recommendations
```

### 3. Safe Routing
```javascript
// User plans route
// System checks hazards along route
// Warns about dangerous areas
// Suggests safer alternatives
```

### 4. Evacuation Planning
```javascript
// User needs evacuation center
// System finds nearest safe location
// Provides distance and directions
// Lists alternative centers
```

---

## 📝 Best Practices

### For Developers

1. **Always check safety overrides first**
   - High-risk conditions must trigger immediate warnings
   - Never bypass safety logic

2. **Handle AI failures gracefully**
   - Implement fallback responses
   - Log errors for monitoring
   - Inform users when using fallback mode

3. **Validate all inputs**
   - Use provided validators
   - Sanitize user input
   - Check coordinate ranges

4. **Cache responses when appropriate**
   - Risk analysis results can be cached briefly
   - Chatbot responses should be fresh

5. **Monitor API usage**
   - Track Groq API calls
   - Implement rate limiting
   - Handle quota exceeded errors

### For Users

1. **Provide accurate location data**
   - Use GPS coordinates when possible
   - Specify barangay if known

2. **Include hazard context**
   - More context = better responses
   - Include all available risk data

3. **Trust safety overrides**
   - High-risk warnings are critical
   - Follow evacuation orders immediately

4. **Use suggestions**
   - Contextual suggestions help guide questions
   - Ask follow-up questions for clarity

---

## 🚀 Next Steps

Phase 4 is now **COMPLETE**! ✅

**Ready for Phase 5: Real-Time Route Intelligence**

The AI service architecture is fully functional with:
- ✅ Context-aware chatbot
- ✅ Comprehensive risk analysis
- ✅ Intelligent route recommendations
- ✅ Safety override system
- ✅ Fallback responses
- ✅ 10 new API endpoints
- ✅ Groq API integration

---

## 📚 Related Documentation

- [Real-time Implementation Guide](REALTIME_IMPLEMENTATION_GUIDE.md)
- [Admin Dashboard Guide](ADMIN_DASHBOARD_GUIDE.md)
- [Incident Reporting Guide](INCIDENT_REPORTING_GUIDE.md)
- [Project Status](PROJECT_STATUS.md)
- [Quick Reference](QUICK_REFERENCE.md)

---

**Built with ❤️ for Lipa City**

**Powered by Groq LLaMA 3.1** 🤖
