# REST API (Adil Mammadov)

**REST API Yayın Adresi:** https://flexifit-api.onrender.com
**Proje Tanıtım ve Test Videosu:** [VİDEO LİNKİNİ BURAYA KOYACAKSIN]

## OpenAPI YAML Dosyası
YAML Dosyası (OpenAPI 3.0): [openapi.yml](./openapi.yml)

## Sorumlu Olduğum REST API Metotları

Aşağıdaki metotlar tarafımdan tasarlanmış, geliştirilmiş ve Postman üzerinden test edilmiştir:

### 1. Kullanıcı Kayıt İşlemi (Register)
* **Yol (Endpoint):** `/auth/register`
* **Metot:** `POST`
* **Açıklama:** Yeni bir kullanıcının sisteme ad, soyad, e-posta, şifre ve fiziksel özellikleri ile kayıt olmasını sağlar.
* **Request Body (JSON):**
  ```json
  {
    "full_name": "Adil Mammadov",
    "email": "memmedovadil2910@gmail.com",
    "password": "123456",
    "height": 180,
    "weight": 80
  }
