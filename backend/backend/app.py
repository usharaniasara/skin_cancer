import os
import time
import urllib.request
from urllib.parse import urlparse
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from model_utils import load_model, predict_image
from datetime import timedelta
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Scan
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
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({'message': 'User created successfully', 'token': access_token, 'user': {'name': new_user.name, 'email': new_user.email}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'message': 'Login successful', 'token': access_token, 'user': {'name': user.name, 'email': user.email}}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

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
