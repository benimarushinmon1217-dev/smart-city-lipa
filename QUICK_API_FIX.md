# Quick API Fix Reference

## 🎯 Problem
```
❌ POST http://127.0.0.1:5000/chatbot net::ERR_CONNECTION_REFUSED
❌ POST http://localhost:5000/analyze-risk net::ERR_CONNECTION_REFUSED
```

## ✅ Solution
Changed 2 lines in `js/utils.js`:

```javascript
// BEFORE (Line 72)
fetch("http://localhost:5000/analyze-risk", {

// AFTER
fetch("/analyze-risk", {
```

```javascript
// BEFORE (Line 135)
fetch("http://127.0.0.1:5000/chatbot", {

// AFTER
fetch("/chatbot", {
```

---

## 📦 What Changed

**File:** `js/utils.js`
**Lines Changed:** 2
**Endpoints Fixed:** 2

1. `/analyze-risk` - Flood risk calculation
2. `/chatbot` - AI assistant

---

## 🚀 Deploy Now

```bash
git add js/utils.js
git commit -m "Fix: API endpoints use relative paths"
git push origin main
```

Render will auto-deploy in ~2 minutes.

---

## ✅ Test After Deploy

1. **Open your Render URL**
2. **Select a barangay**
3. **Type in chat:** "Is this area safe?"
4. **Press Enter**
5. **Expected:** AI responds ✅
6. **Check Console (F12):** No errors ✅

---

## 🔍 Verify Fix

Open browser console and check Network tab:

```
✅ POST /chatbot → 200 OK
✅ POST /analyze-risk → 200 OK
```

No more `ERR_CONNECTION_REFUSED` errors!

---

## 📝 Why This Works

| Environment | Relative Path Resolves To |
|-------------|---------------------------|
| Development | `http://localhost:5000/chatbot` |
| Production | `https://your-app.onrender.com/chatbot` |

**Same code works everywhere!**

---

## ⚠️ Important

Make sure `GROQ_API_KEY` is set in Render environment variables, or AI won't work even with correct endpoints!

---

**Status:** 🟢 READY TO DEPLOY
