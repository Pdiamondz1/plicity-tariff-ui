from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "plicity_logs.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class ERPLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(120))
    action = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    detail = db.Column(db.Text)

with app.app_context():
    db.create_all()

@app.route('/api/ask', methods=['POST'])
def ask():
    data = request.json
    sku = data.get('sku')
    prompt_key = data.get('prompt_key')
    log_enabled = request.args.get('log', 'true') == 'true'
    insight = f"Insight generated for SKU '{sku}' with prompt '{prompt_key}'."

    if log_enabled:
        log = ERPLog(sku=sku, action="Insight generated", detail=insight)
        db.session.add(log)
        db.session.commit()

    return jsonify({'response': insight})

@app.route('/api/push-to-erp', methods=['POST'])
def push_to_erp():
    data = request.json
    sku = data.get('sku')
    detail = f"Pushed {sku} to mock ERP"
    log_enabled = request.args.get('log', 'true') == 'true'

    if log_enabled:
        log = ERPLog(sku=sku, action="Pushed to ERP", detail=detail)
        db.session.add(log)
        db.session.commit()

    return jsonify({'message': 'ERP update successful'})

@app.route('/api/logs/filter', methods=['GET'])
def filter_logs():
    sku = request.args.get('sku')
    action = request.args.get('action')
    start = request.args.get('start')
    end = request.args.get('end')

    query = ERPLog.query
    if sku:
        query = query.filter(ERPLog.sku == sku)
    if action:
        query = query.filter(ERPLog.action.ilike(f"%{action}%"))
    if start:
        try:
            start_dt = datetime.strptime(start, "%Y-%m-%d")
            query = query.filter(ERPLog.timestamp >= start_dt)
        except ValueError:
            pass
    if end:
        try:
            end_dt = datetime.strptime(end, "%Y-%m-%d")
            query = query.filter(ERPLog.timestamp <= end_dt)
        except ValueError:
            pass

    logs = query.order_by(ERPLog.timestamp.desc()).all()
    return jsonify([
        {
            "id": log.id,
            "sku": log.sku,
            "action": log.action,
            "detail": log.detail,
            "timestamp": log.timestamp.isoformat()
        } for log in logs
    ])

@app.route('/api/logs/summary', methods=['GET'])
def log_summary():
    from sqlalchemy import func
    recent_logs = (
        db.session.query(ERPLog.sku, func.count().label("count"))
        .filter(ERPLog.action == "Pushed to ERP")
        .group_by(ERPLog.sku)
        .order_by(func.count().desc())
        .limit(5)
        .all()
    )

    per_day = (
        db.session.query(func.date(ERPLog.timestamp), func.count().label("count"))
        .filter(ERPLog.action == "Pushed to ERP")
        .group_by(func.date(ERPLog.timestamp))
        .order_by(func.date(ERPLog.timestamp))
        .all()
    )

    return jsonify({
        "top_skus": [{"sku": sku, "count": count} for sku, count in recent_logs],
        "per_day": [{"date": date, "count": count} for date, count in per_day]
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
