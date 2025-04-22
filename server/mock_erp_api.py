from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "mock_erp_data.json"

# Load SKU data from file
def load_data():
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

# Save SKU data to file
def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# Get SKU info
@app.route("/erp/sku/<sku_id>", methods=["GET"])
def get_sku(sku_id):
    data = load_data()
    sku = data.get(sku_id)
    if not sku:
        return jsonify({"error": "SKU not found"}), 404
    return jsonify(sku)

# Update SKU pricing info
@app.route("/erp/sku/<sku_id>/price-update", methods=["POST"])
def update_price(sku_id):
    data = load_data()
    if sku_id not in data:
        return jsonify({"error": "SKU not found"}), 404
    payload = request.json
    data[sku_id]["SuggestedPrice"] = payload.get("SuggestedPrice")
    data[sku_id]["EffectiveDate"] = payload.get("EffectiveDate")
    save_data(data)
    return jsonify({"status": "Price updated", "sku": sku_id})

if __name__ == "__main__":
    app.run(port=5050)
