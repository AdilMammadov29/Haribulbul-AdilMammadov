from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flexifit.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    height = db.Column(db.Float)
    weight = db.Column(db.Float)

with app.app_context():
    db.create_all()

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "FlexiFit API Canli Yayinda!"})

# --- KAYIT OLMA ---
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"status": "error", "message": "Bu email zaten kayitli!"}), 409
    
    new_user = User(
        full_name=data.get('fullName'),
        email=data.get('email'),
        password=generate_password_hash(data.get('password')),
        height=data.get('height'),
        weight=data.get('weight')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"status": "success", "message": "Kayit basarili!"}), 201

# --- GİRİŞ YAPMA (YENİ!) ---
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and check_password_hash(user.password, data.get('password')):
        return jsonify({
            "status": "success",
            "message": "Giris basarili!",
            "user": {"id": user.id, "fullName": user.full_name}
        }), 200
    
    return jsonify({"status": "error", "message": "Email veya sifre hatali!"}), 401

# --- ŞAHİTLİK/DEBUG (YENİ!) ---
@app.route('/debug/users', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify({"users": [{"id": u.id, "email": u.email, "name": u.full_name} for u in users]})

if __name__ == '__main__':
    app.run(debug=True)