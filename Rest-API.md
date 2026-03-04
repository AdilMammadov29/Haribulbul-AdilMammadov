# FlexiFit - REST API Tasarımı (OpenAPI)

> **Görev Dağılımı Notu:** Bu proje tek kişilik bir ekip tarafından yürütüldüğü için, OpenAPI tasarımı **Adil Mammadov**'a atanmıştır.

🔗 **[FlexiFit OpenAPI YAML Dosyasını Görüntülemek İçin Tıklayınız](./openapi.yml)**

Aşağıda, projemin gereksinim analizinde belirlenen 14 adet API metodunun Swagger/OpenAPI 3.0.0 formatındaki formatlı kaynak kodu yer almaktadır:

```yaml
openapi: 3.0.0
info:
  title: FlexiFit Pro API
  description: Akıllı Beslenme ve Sağlık Takip Platformu API Dokümantasyonu
  version: 1.0.0
servers:
  - url: [https://api.flexifitpro.com/v1](https://api.flexifitpro.com/v1)
    description: Ana Prodüksiyon Sunucusu

paths:
  /auth/register:
    post:
      summary: Kayıt Olma
      description: Kullanıcıların yaş, boy, kilo ve cinsiyet verilerini sisteme kaydederek yeni bir hesap oluşturmasını sağlar.
      responses:
        '201':
          description: Hesap başarıyla oluşturuldu.
  /auth/login:
    post:
      summary: Giriş Yapma
      description: Kayıtlı kişilerin sisteme kimlik doğrulaması yapmasını sağlar.
      responses:
        '200':
          description: Başarılı giriş, token döndürüldü.
  /consumptions:
    post:
      summary: Tüketim Ekleme
      description: Tüketilen gıdaların enerji değerini ve içilen su miktarını sisteme ekler.
      responses:
        '201':
          description: Tüketim başarıyla eklendi.
  /users/{userId}:
    get:
      summary: Özellikleri Görüntüleme
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Kullanıcı profili getirildi.
  /consumptions/history:
    get:
      summary: Geçmişi Görüntüleme
      description: Sisteme eklenen tüm yiyecek ve su kayıtlarını getirir.
      responses:
        '200':
          description: Geçmiş listesi getirildi.
  /progress/weight:
    get:
      summary: İlerleme Durumunu Görüntüleme
      responses:
        '200':
          description: İlerleme çubuğu verileri getirildi.
  /progress/weekly:
    get:
      summary: Haftalık Çizelgeyi Görüntüleme
      responses:
        '200':
          description: Haftalık veriler getirildi.
  /users/{userId}/weight:
    put:
      summary: Mevcut Kiloyu Güncelleme
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Kilo güncellendi.
  /users/{userId}/activity-level:
    put:
      summary: Hareket Seviyesini Güncelleme
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Aktivite seviyesi güncellendi.
  /settings/{userId}/theme:
    put:
      summary: Tema Ayarını Güncelleme
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Tema güncellendi.
  /consumptions/{consumptionId}:
    delete:
      summary: Kaydı Silme
      parameters:
        - name: consumptionId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Tüketim kaydı silindi.
  /users/{userId}:
    delete:
      summary: Hesabı Silme
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Hesap silindi.
  /products/barcode/{barcodeNo}:
    get:
      summary: Barkod Tarama
      parameters:
        - name: barcodeNo
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Ürün besin değerleri getirildi.
  /ai/recommendations/meal:
    get:
      summary: Öğün Önerisi Alma (Yapay Zeka Modülü)
      responses:
        '200':
          description: Yapay zeka tavsiyesi başarıyla üretildi.
