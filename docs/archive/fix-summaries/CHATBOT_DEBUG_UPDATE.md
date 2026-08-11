# Chatbot Debug Update

## Issue
After fixing the request field names (`question` and `hazard_data`), a new error appeared:
```
TypeError: Cannot read properties of undefined (reading 'reply')
at Object.onSuccess (AIAdvisorWidget.jsx:68:44)
```

## Root Cause
The `data` parameter in the `onSuccess` callback was `undefined`, suggesting either:
1. The mutation is failing silently
2. The response structure is different than expected
3. The callback isn't receiving the data properly

## Debug Changes Applied

### 1. Enhanced Error Handling in Widget
**File**: `frontend/src/components/ai/AIAdvisorWidget.jsx`

Added comprehensive error handling and logging:
```javascript
onSuccess: (data) => {
    console.log('Chatbot response:', data);
    
    // Handle different response structures
    let replyText = 'No response received';
    
    if (data) {
        // Try different possible structures
        replyText = data.data?.reply || data.reply || data.data?.response || data.response || replyText;
    }
    
    const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: replyText,
        timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, aiMessage]);
},
onError: (error) => {
    console.error('Chatbot error:', error);
    // ... error handling
}
```

**Benefits**:
- ✅ Logs the actual response structure
- ✅ Tries multiple possible field paths
- ✅ Provides fallback text if all fail
- ✅ Logs errors with details

### 2. Added Logging to Mutation
**File**: `frontend/src/hooks/useAIAdvisor.js`

Added console logging to see the raw API response:
```javascript
const askQuestion = useMutation({
    mutationFn: async ({ question, context }) => {
        const response = await api.post(API_ENDPOINTS.AI.CHATBOT, {
            question: question,
            hazard_data: context || {},
        });
        console.log('Chatbot API response:', response.data);
        return response.data;
    },
});
```

**Benefits**:
- ✅ Shows the exact response from the API
- ✅ Helps identify structure mismatches
- ✅ Confirms the request is succeeding

## Expected Response Structure

### From Backend
```javascript
{
  success: true,
  message: "Chatbot response generated successfully",
  data: {
    reply: "Your AI response here...",
    context: {
      flood_risk: "low",
      ashfall_risk: "low",
      wind_direction: "unknown",
      barangay_name: "unknown"
    },
    source: "ai" | "fallback" | "safety_override"
  }
}
```

### In Frontend Callback
The `data` parameter in `onSuccess` should be the entire response:
```javascript
data = {
  success: true,
  message: "...",
  data: {
    reply: "...",
    context: {...},
    source: "..."
  }
}
```

So accessing `data.data.reply` should work.

## Testing Instructions

1. **Refresh the browser** to load the updated code
2. **Open browser console** (F12 → Console tab)
3. **Open AI Emergency Advisor** widget
4. **Ask a question** (e.g., "What hazards are near me?")
5. **Check console logs**:
   - Look for: `Chatbot API response: {...}`
   - Look for: `Chatbot response: {...}`
   - Check if there are any errors

## What to Look For

### If Successful
Console should show:
```
Chatbot API response: { success: true, data: { reply: "...", ... } }
Chatbot response: { success: true, data: { reply: "...", ... } }
```
And the AI response should appear in the chat.

### If Still Failing
Console might show:
- `Chatbot error: ...` - The request is failing
- `Chatbot response: undefined` - The callback isn't receiving data
- `Chatbot response: { ... }` but no `reply` field - Structure mismatch

## Possible Issues to Check

### 1. GROQ API Key Not Configured
If the backend doesn't have a GROQ API key, it should use fallback responses. Check backend logs for:
```
AI service unavailable, using fallback
```

### 2. Backend Error
Check backend terminal for errors when the request is made.

### 3. CORS Issues
Check browser console for CORS errors (should be fixed already).

### 4. Network Issues
Check Network tab in browser DevTools to see the actual request/response.

## Next Steps

After testing with the debug logs:
1. Share the console output to identify the exact issue
2. Once working, we can remove the console.log statements
3. Verify the chatbot responds correctly to different questions

## Files Modified
- ✅ `frontend/src/components/ai/AIAdvisorWidget.jsx` - Enhanced error handling
- ✅ `frontend/src/hooks/useAIAdvisor.js` - Added response logging
