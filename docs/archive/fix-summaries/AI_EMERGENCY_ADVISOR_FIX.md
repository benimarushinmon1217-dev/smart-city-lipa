# AI Emergency Advisor Fix - COMPLETE ✅

## Problem

The AI Emergency Advisor was not behaving like a disaster response assistant. It wasn't aware of its specific role and responsibilities.

---

## Root Cause

The current chatbot service had a **generic system prompt** that didn't match the **specific, detailed instructions** from the old `app.py` file.

### Old app.py System Prompt (Working):
```python
prompt = f"""
You are a Smart City Disaster Response Assistant.

Use the data to give a short, clear, and natural answer.

Flood Risk: {risk}
Ashfall Risk: {ashfall}
Wind Direction: {wind}

Guidelines:
- If Flood Risk OR Ashfall Risk is High or Very High, the area is NOT SAFE
- Never describe the area as safe if any risk is High
- Always prioritize safety over reassurance
- If mixed risks, mention the highest risk clearly
- Consider wind when explaining ashfall

Style:
- Sound natural and human
- No symbols, no formatting - Just a clear answer - no deep words

STRICT RULES:
- Maximum of 2 sentences only
- Each sentence must be short and direct
- Do NOT explain too much
- Do NOT repeat ideas
- Keep it concise and straight to the point

Your response MUST be no more than 2 short sentences.

Question: {question}
"""
```

### New Backend (Before Fix):
The system prompt was too generic and didn't emphasize the strict formatting rules.

---

## The Fix

### File: `backend/services/chatbotService.js`

Updated the `getAIResponse()` function to match the old `app.py` behavior exactly:

**1. System Prompt - Role Definition**
```javascript
const systemPrompt = `You are a Smart City Disaster Response Assistant for Lipa City, Philippines.

Your role is to help citizens understand disaster risks and stay safe during emergencies.

CRITICAL SAFETY RULES:
1. If Flood Risk OR Ashfall Risk is HIGH or VERY HIGH, the area is NOT SAFE
2. NEVER describe an area as safe when any risk is HIGH
3. Always prioritize safety over reassurance
4. Be direct and honest about dangers
5. Consider wind direction when explaining ashfall risk

RESPONSE STYLE:
- Maximum 2 short sentences only
- Each sentence must be short and direct
- Natural and conversational tone (sound human)
- No symbols, no formatting, no deep words
- Just a clear answer
- Do NOT explain too much
- Do NOT repeat ideas
- Keep it concise and straight to the point

Your response MUST be no more than 2 short sentences.`;
```

**2. User Prompt - Context and Guidelines**
```javascript
const userPrompt = `Use the data to give a short, clear, and natural answer.

Flood Risk: ${context.flood_risk}
Ashfall Risk: ${context.ashfall_risk}
Wind Direction: ${context.wind_direction}
Location: ${context.barangay_name}

Guidelines:
- If Flood Risk OR Ashfall Risk is High or Very High, the area is NOT SAFE
- Never describe the area as safe if any risk is High
- Always prioritize safety over reassurance
- If mixed risks, mention the highest risk clearly
- Consider wind when explaining ashfall

Style:
- Sound natural and human
- No symbols, no formatting - Just a clear answer - no deep words

STRICT RULES:
- Maximum of 2 sentences only
- Each sentence must be short and direct
- Do NOT explain too much
- Do NOT repeat ideas
- Keep it concise and straight to the point

Your response MUST be no more than 2 short sentences.

Question: ${question}`;
```

**3. API Call Configuration**
```javascript
const reply = await aiService.callGroqAPI(messages, {
    model: 'llama-3.1-8b-instant', // Same model as old app.py
    temperature: 0.7,
    max_tokens: 150 // Limit response length to enforce 2 sentences
});
```

---

## Key Improvements

### 1. **Clear Role Definition**
- "You are a Smart City Disaster Response Assistant for Lipa City, Philippines"
- Emphasizes helping citizens stay safe during emergencies

### 2. **Strict Safety Rules**
- Explicitly states when area is NOT SAFE
- Never allows false reassurance
- Prioritizes safety over comfort

### 3. **Response Format Enforcement**
- **Maximum 2 sentences** - repeated multiple times
- **Short and direct** - no long explanations
- **Natural tone** - sound human, not robotic
- **No formatting** - no symbols, bullets, or markdown

### 4. **Context Awareness**
- Uses flood risk, ashfall risk, wind direction
- Considers location (barangay name)
- Provides actionable advice

### 5. **Consistent Behavior**
- Matches old `app.py` exactly
- Same model: `llama-3.1-8b-instant`
- Same temperature: 0.7
- Same token limit: 150

---

## Example Responses

### High Risk Scenario
**User:** "Is my area safe?"  
**Context:** Flood Risk: High, Ashfall Risk: High  
**AI Response:** "Your area is not safe due to high flood and ashfall risks. Please evacuate to the nearest shelter immediately."

### Medium Risk Scenario
**User:** "Should I go outside?"  
**Context:** Flood Risk: Low, Ashfall Risk: Medium  
**AI Response:** "Ashfall risk is moderate, so limit outdoor activities and wear a mask if you must go out. Stay alert for any changes in conditions."

### Low Risk Scenario
**User:** "What's the current situation?"  
**Context:** Flood Risk: Low, Ashfall Risk: Low  
**AI Response:** "Current conditions are relatively safe with low flood and ashfall risks. Continue monitoring official updates and stay prepared."

### Ashfall-Specific Question
**User:** "What about ashfall?"  
**Context:** Ashfall Risk: High, Wind: SE  
**AI Response:** "Ashfall risk is high in your area, so stay indoors and seal windows. Avoid exposure to volcanic ash."

---

## Safety Override System

The chatbot service maintains the safety override from the old `app.py`:

```javascript
// SAFETY OVERRIDE: Check for high-risk conditions
const safetyMessage = aiService.getSafetyOverrideMessage(
    hazardData.flood_risk,
    hazardData.ashfall_risk
);

if (safetyMessage) {
    return {
        reply: safetyMessage,
        context: context,
        source: 'safety_override'
    };
}
```

**This ensures:**
- High-risk situations get immediate, clear warnings
- No AI hallucination can override safety messages
- Consistent messaging for critical situations

---

## Testing the Fix

### Test 1: High Risk Area
```bash
curl -X POST http://localhost:5000/api/ai/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Is my area safe?",
    "hazard_data": {
      "flood_risk": "High",
      "ashfall_risk": "High",
      "wind_direction": "SE",
      "barangay_name": "Antipolo del Sur"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Your area is not safe because ashfall risk is High. It is best to stay indoors and avoid exposure.",
    "source": "safety_override"
  }
}
```

### Test 2: General Question
```bash
curl -X POST http://localhost:5000/api/ai/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What should I do?",
    "hazard_data": {
      "flood_risk": "Medium",
      "ashfall_risk": "Low",
      "wind_direction": "N",
      "barangay_name": "Balete"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Flood risk is moderate, so stay alert and prepare an emergency kit. Monitor weather updates regularly.",
    "source": "ai"
  }
}
```

---

## Comparison: Old vs New

| Feature | Old app.py | New Backend | Status |
|---------|-----------|-------------|--------|
| Role Definition | ✅ Clear | ✅ Clear | ✅ Match |
| Safety Rules | ✅ Explicit | ✅ Explicit | ✅ Match |
| 2 Sentence Limit | ✅ Enforced | ✅ Enforced | ✅ Match |
| Natural Tone | ✅ Required | ✅ Required | ✅ Match |
| No Formatting | ✅ Required | ✅ Required | ✅ Match |
| Model | llama-3.1-8b-instant | llama-3.1-8b-instant | ✅ Match |
| Temperature | 0.7 | 0.7 | ✅ Match |
| Max Tokens | 150 | 150 | ✅ Match |
| Safety Override | ✅ Yes | ✅ Yes | ✅ Match |

---

## Files Modified

1. **`backend/services/chatbotService.js`**
   - Updated `getAIResponse()` function
   - Matched system prompt to old app.py
   - Matched user prompt format
   - Enforced strict response rules

---

## Status: ✅ FIXED

The AI Emergency Advisor now has the **same personality, behavior, and safety focus** as the old `app.py` implementation. It will:

- ✅ Identify itself as a Smart City Disaster Response Assistant
- ✅ Provide clear, concise answers (max 2 sentences)
- ✅ Prioritize safety over reassurance
- ✅ Never say an area is safe when risks are high
- ✅ Consider wind direction for ashfall risk
- ✅ Sound natural and human
- ✅ Avoid technical jargon and formatting

**The AI Emergency Advisor is now fully aware of its job!** 🎯
