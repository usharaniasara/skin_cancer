import os
import time
import urllib.request
from urllib.parse import urlparse
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from model_utils import load_model, predict_image
import json
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import timedelta, datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Scan, OTPVerification
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes (allows React frontend to talk to us)
CORS(app, resources={r"/api/*": {"origins": "*"}, r"/uploads/*": {"origins": "*"}})

# --- Configuration ---
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB max upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'heic'}

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///skynex_db.db')


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dermai-super-secret-key-123')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

# Load the model directly when the server boots
print("Initializing ML model...")
model, class_names, device = load_model()
print("ML Model is ready to accept requests.")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- Email Configuration ---
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 465))
SMTP_EMAIL = os.getenv('SMTP_EMAIL', '')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')

def send_otp_email(to_email, otp_code, action):
    try:
        import requests
        script_url = "https://script.google.com/macros/s/AKfycbwfKNoiabvw4NDWjUukwwm8FYWkDENu6nnIm-dWoo-yVx0Z3IGSCF2elHbdKCxthc8p/exec"
        action_text = "registration" if action == 'register' else "login"
        body = f"Your verification code for {action_text} is: {otp_code}\n\nThis code will expire in 5 minutes."
        
        payload = {
            "to": to_email,
            "subject": "Your Dermisyn Clinical Portal Verification Code",
            "body": body
        }
        
        print(f"Sending OTP via Google Script to {to_email}...", flush=True)
        response = requests.post(script_url, json=payload, timeout=15)
        
        if response.status_code == 200:
            print("Email sent successfully via Google Script!", flush=True)
            return True
        else:
            print(f"Failed to send email. Status: {response.status_code}", flush=True)
            return False
    except Exception as e:
        print(f"Error sending email via Google Script: {e}", flush=True)
        return False

# --- Core Diagnostic Helper ---
def process_single_analysis(file, image_url_input, location, current_user_id=None, force=False):
    filename = None
    filepath = None

    if file:
        if file.filename == '':
            raise ValueError('No selected file')
        if not allowed_file(file.filename):
            raise ValueError('File type not allowed. Please upload JPG or PNG.')
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
    elif image_url_input:
        try:
            url_path = urlparse(image_url_input).path
            ext = url_path.rsplit('.', 1)[1].lower() if '.' in url_path else 'jpg'
            if ext not in ALLOWED_EXTENSIONS: ext = 'jpg'
            
            filename = f"url_import_{int(time.time() * 1000)}.{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
            
            req = urllib.request.Request(image_url_input, headers=headers)
            with urllib.request.urlopen(req) as response:
                with open(filepath, 'wb') as f:
                    f.write(response.read())
        except Exception as e:
            raise ValueError(f'Failed to fetch online image: {str(e)}')

    if filepath and os.path.exists(filepath):
        try:
            prediction_result = predict_image(filepath, model, class_names, device, force=force)
            image_url = f"http://localhost:5000/uploads/{filename}"
            prediction_result['image_url'] = image_url

            if current_user_id:
                new_scan = Scan(
                    user_id=current_user_id,
                    prediction=prediction_result.get('prediction', 'Unknown'),
                    confidence=prediction_result.get('confidence', 0.0),
                    risk_level=prediction_result.get('risk_level', 'Unknown'),
                    location=location,
                    image_url=image_url
                )
                db.session.add(new_scan)
                db.session.commit()
                
            return prediction_result
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            raise e
    raise ValueError('Failed to process image')

# --- Authentication Endpoints ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'User already exists'}), 400
        
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user_data = json.dumps({'name': data['name'], 'password_hash': hashed_password})
    
    OTPVerification.query.filter_by(email=data['email']).delete()
    
    otp_record = OTPVerification(
        email=data['email'], 
        otp_code=otp_code, 
        action='register', 
        data=user_data, 
        expires_at=expires_at
    )
    db.session.add(otp_record)
    db.session.commit()
    
    email_sent = send_otp_email(data['email'], otp_code, 'register')
    
    if not email_sent:
        OTPVerification.query.filter_by(email=data['email']).delete()
        db.session.commit()
        return jsonify({'error': 'Failed to send OTP email.'}), 500
    
    return jsonify({'message': 'OTP sent to email', 'requires_otp': True, 'email': data['email']}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        otp_code = str(random.randint(100000, 999999))
        expires_at = datetime.utcnow() + timedelta(minutes=5)
        
        OTPVerification.query.filter_by(email=data['email']).delete()
        
        otp_record = OTPVerification(
            email=data['email'], 
            otp_code=otp_code, 
            action='login', 
            expires_at=expires_at
        )
        db.session.add(otp_record)
        db.session.commit()
        
        email_sent = send_otp_email(data['email'], otp_code, 'login')
        
        if not email_sent:
            OTPVerification.query.filter_by(email=data['email']).delete()
            db.session.commit()
            return jsonify({'error': 'Failed to send OTP email.'}), 500
            
        return jsonify({'message': 'OTP sent to email', 'requires_otp': True, 'email': data['email']}), 200
        
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('otp_code'):
        return jsonify({'error': 'Missing email or OTP'}), 400
        
    otp_record = OTPVerification.query.filter_by(
        email=data['email'], 
        otp_code=data['otp_code']
    ).order_by(OTPVerification.created_at.desc()).first()
    
    if not otp_record:
        return jsonify({'error': 'Invalid OTP'}), 401
        
    if datetime.utcnow() > otp_record.expires_at:
        return jsonify({'error': 'OTP has expired'}), 401
        
    if otp_record.action == 'register':
        user_data = json.loads(otp_record.data)
        new_user = User(name=user_data['name'], email=otp_record.email, password_hash=user_data['password_hash'])
        db.session.add(new_user)
        db.session.commit()
        user = new_user
    else: 
        user = User.query.filter_by(email=otp_record.email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
    OTPVerification.query.filter_by(email=data['email']).delete()
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Verification successful', 
        'token': access_token, 
        'user': {'name': user.name, 'email': user.email}
    }), 200

@app.route('/api/user', methods=['GET', 'PUT'])
@jwt_required()
def manage_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user: return jsonify({'error': 'User not found'}), 404
    
    if request.method == 'PUT':
        data = request.get_json()
        if not data: return jsonify({'error': 'No data provided'}), 400
        
        if 'name' in data: 
            user.name = data['name']
            
        if 'email' in data and data['email'] != user.email:
            # Check if this new email is already taken by another user
            existing = User.query.filter_by(email=data['email']).first()
            if existing:
                return jsonify({'error': 'Email is already registered to another medical account'}), 400
            user.email = data['email']
            
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'user': {'name': user.name, 'email': user.email}}), 200
        
    return jsonify({'name': user.name, 'email': user.email}), 200

@app.route('/api/scans', methods=['GET'])
@jwt_required()
def get_scans():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user: return jsonify({'error': 'User not found'}), 404
    scans = Scan.query.filter_by(user_id=user.id).order_by(Scan.created_at.desc()).all()
    scans_data = [{
        'id': scan.id, 'prediction': scan.prediction, 'confidence': scan.confidence,
        'risk_level': scan.risk_level, 'location': scan.location,
        'image_url': scan.image_url, 'created_at': scan.created_at.isoformat()
    } for scan in scans]
    return jsonify(scans_data), 200

# --- Primary Analysis Endpoints ---

@app.route('/api/analyze', methods=['POST'])
@jwt_required(optional=True)
def analyze_lesion():
    file = request.files.get('image')
    image_url_input = request.form.get('image_url') or (request.json.get('image_url') if request.is_json else None)
    location = request.form.get('location') or (request.json.get('location') if request.is_json else 'Unknown')
    force = request.form.get('force') == 'true' or (request.json.get('force') if request.is_json else False)
    current_user_id = get_jwt_identity()

    try:
        result = process_single_analysis(file, image_url_input, location, current_user_id, force=force)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Analysis failed', 'details': str(e)}), 500

@app.route('/api/analyze-batch', methods=['POST'])
@jwt_required(optional=True)
def analyze_batch():
    """Batch endpoint for multiple specimens"""
    current_user_id = get_jwt_identity()
    items = []
    if request.is_json:
        items = request.json.get('items', [])
    else:
        # Multiform batching
        files = request.files.getlist('images')
        locations = request.form.getlist('locations')
        for i, file in enumerate(files):
            items.append({'file': file, 'location': locations[i] if i < len(locations) else 'Unknown'})

    batch_results = []
    for item in items:
        try:
            res = process_single_analysis(
                item.get('file'), 
                item.get('image_url'), 
                item.get('location', 'Unknown'), 
                current_user_id,
                force=item.get('force', False)
            )
            batch_results.append({'status': 'success', 'result': res})
        except Exception as e:
            batch_results.append({'status': 'failed', 'error': str(e)})

    return jsonify({'batch_results': batch_results}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
