from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    scans = db.relationship('Scan', backref='owner', lazy=True)

class Scan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    prediction = db.Column(db.String(100))
    confidence = db.Column(db.Float)
    risk_level = db.Column(db.String(50))
    location = db.Column(db.String(100)) # Added: Clinical body location
    image_url = db.Column(db.String(255)) # Persistent clinical image reference
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
