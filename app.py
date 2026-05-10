from groq import Groq
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')

CORS(app, supports_credentials=True)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@app.route('/')
def home():
    return app.send_static_file('index.html')
# =========================
# TEST ROUTE
# =========================

# =========================
# RISK ANALYSIS ROUTE
# =========================


@app.route("/analyze-risk", methods=["POST"])
def analyze_risk():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        print("RECEIVED:", data)  # DEBUG

        score = float(data.get("_risk_score", 0))
        q50 = float(data.get("q50", 0))
        q80 = float(data.get("q80", 0))

        print("VALUES:", score, q50, q80)  # DEBUG

        if score >= q80:
            risk = "High"
        elif score >= q50:
            risk = "Medium"
        else:
            risk = "Low"

        return jsonify({
            "risk": risk,
            "score": score
        })

    except ValueError as e:
        print("VALUE ERROR:", e)
        return jsonify({"error": "Invalid numeric values"}), 400
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Internal server error"}), 500

# =========================
# CHATBOT ROUTE
# =========================


@app.route("/chatbot", methods=["POST"])
def chatbot():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        print("🔥 RAW DATA:", data)

        question = data.get("question", "")

        if not question or not question.strip():
            return jsonify({"reply": "Please ask a question about the area."}), 200

        risk = data.get("risk", "unknown")
        elevation = data.get("elevation", "unknown")
        distance = data.get("distance", "unknown")
        ashfall = data.get("ashfall", "unknown")
        wind = data.get("wind", "unknown")

        # 🔥 CLEAN INPUTS
        question_clean = question.lower().strip()
        ashfall_clean = str(ashfall).lower().strip()
        risk_clean = str(risk).lower().strip()

        # 🔍 DEBUG (SAFE TO KEEP)
        print("RAW ASHFALL:", ashfall)
        print("CLEAN ASHFALL:", ashfall_clean)

        # =========================
        # 🚨 GLOBAL SAFETY OVERRIDE (FINAL FIX)
        # =========================
        if risk_clean == "high" or "high" in ashfall_clean:
            return jsonify({
                "reply": f"Your area is not safe because ashfall risk is {ashfall}. It is best to stay indoors and avoid exposure."
            })

        print("DEBUG QUESTION:", question_clean)

        # =========================
        # 🌋 ASHFALL-SPECIFIC RESPONSE
        # =========================
        if "ashfall" in question_clean:
            if "high" in ashfall_clean:
                return jsonify({
                    "reply": f"The ashfall risk in your area is {ashfall}, so the area is not safe and ashfall exposure is likely."
                })
            elif "moderate" in ashfall_clean:
                return jsonify({
                    "reply": "Ashfall risk is moderate, so it’s best to limit outdoor activity and wear protection like a mask."
                })
            else:
                return jsonify({
                    "reply": "Ashfall risk is low, so the area is generally safe, but it’s still good to stay aware of any changes."
                })
        # 🔥 =========================
        # NORMAL AI FLOW (SIMPLIFIED PROMPT)
        # 🔥 =========================
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

        print("SENDING TO GROQ...")

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # ✅ CURRENT WORKING MODEL
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful disaster response assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        reply = response.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        print("🔥 FULL ERROR:", repr(e))

        # 🔥 FALLBACK (NO CRASH)
        if "flood" in question.lower():
            return jsonify({
                "reply": f"Flood risk in your area is {risk}, so it’s generally safe, but stay alert for any sudden changes in weather."
            })

        return jsonify({
            "reply": "Based on the current data, please refer to the risk levels shown on the map and stay cautious."
        })


# =========================
# RUN SERVER
# =========================\
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
