from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

PROMPT_MAP = {
    "sku_cost_change": "prompts/sku_cost_change.txt",
    "customer_explanation": "prompts/customer_explanation.txt",
    "sku_tariff_scan": "prompts/sku_tariff_scan.txt"
}

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    sku = data.get("sku")
    prompt_key = data.get("prompt_key", "sku_cost_change")
    prompt_file = PROMPT_MAP.get(prompt_key)

    if not prompt_file or not os.path.exists(prompt_file):
        return jsonify({"error": "Invalid prompt key or file not found."}), 400

    with open(prompt_file) as f:
        prompt_template = f.read()

    filled_prompt = prompt_template.replace("{{ sku }}", sku)\
        .replace("{{ hts_code }}", "7318152060")\
        .replace("{{ country }}", "China")\
        .replace("{{ old_tariff }}", "6.5%")\
        .replace("{{ new_tariff }}", "25%")\
        .replace("{{ landed_cost_delta }}", "18.5")

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": filled_prompt}],
        temperature=0.3
    )

    return jsonify({"response": response["choices"][0]["message"]["content"]})
