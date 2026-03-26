from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Bağlantı Linkin
MONGO_URI = "mongodb+srv://adil:apEqF2376sbjyR4n@cluster0.p8sqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.FlexiFitDatabase
users_collection = db.users

# DİKKAT: create_index satırı varsa sildik, çünkü hata verdiriyor!

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "Backend calisiyor!"}), 200

@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        # Önce bu mail var mı diye kontrol edelim (Manuel kontrol daha güvenli)
        if users_collection.find_one({"email": data['email']}):
            return jsonify({"error": "Bu e-posta zaten kayitli!"}), 400
            
        users_collection.insert_one(data)
        return jsonify({"message": "Kayit basarili!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = users_collection.find_one({"email": data['email'], "password": data['password']})
        if user:
            return jsonify({"message": "Giris basarili!"}), 200
        return jsonify({"error": "Hatali e-posta veya sifre!"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run()
