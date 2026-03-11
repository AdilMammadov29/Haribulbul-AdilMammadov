from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)

# Veritabanı Ayarları (flexifit.db adında bir dosya oluşturacak)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flexifit.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Kullanıcı Tablosu (Veritabanındaki kolonlarımız)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    goal_weight = db.Column(db.Float, nullable=False)
    activity_level = db.Column(db.String(20), nullable=False)

# Kod ilk çalıştığında veritabanı dosyasını ve tabloları otomatik oluşturur
with app.app_context():
    db.create_all()

# Ana Test Rotası
@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "FlexiFit API ve Veritabani Hazir!"})

# KAYIT OLMA (REGISTER) ROTASI
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    # Email veritabanında var mı diye kontrol et
    existing_user = User.query.filter_by(email=data.get('email')).first()
    if existing_user:
        return jsonify({"status": "error", "message": "Bu email adresi zaten kayitli!"}), 409

    # Şifreyi güvenlik için şifrele (Hash)
    hashed_password = generate_password_hash(data.get('password'))

    # Yeni kullanıcıyı veritabanı formatında hazırla
    new_user = User(
        full_name=data.get('fullName'),
        email=data.get('email'),
        password=hashed_password,
        height=data.get('height'),
        weight=data.get('weight'),
        goal_weight=data.get('goalWeight'),
        activity_level=data.get('activityLevel')
    )

    # Veritabanına ekle ve kaydet
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "status": "success", 
        "message": "Kullanici basariyla olusturuldu!",
        "user_id": new_user.id
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)