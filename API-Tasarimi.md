```yaml
openapi: 3.0.3
info:
  title: FlexiFit API
... (kodların geri kalanı) ...
```
openapi: 3.0.3
info:
  title: FlexiFit API
  description: |
    FlexiFit Akıllı Beslenme ve Sağlık Takip Platformu için RESTful API.

    ## Özellikler
    - Kullanıcı kayıt ve kimlik doğrulama (JWT)
    - Günlük kalori ve su tüketimi takibi
    - Vücut kitle indeksi (VKİ) ve kilo analizi
    - Haftalık ilerleme grafikleri
    - Barkod ile ürün tanıma
    - AI destekli kişiselleştirilmiş öğün önerileri
  version: 1.0.0
  contact:
    name: Adil Mammadov
    email: adil@flexifit.com
    url: https://api.flexifit.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.flexifit.com/v1
    description: Production server
  - url: https://staging-api.flexifit.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri
  - name: consumptions
    description: Kalori ve su tüketimi işlemleri
  - name: progress
    description: İlerleme ve grafik işlemleri
  - name: users
    description: Kullanıcı profili işlemleri
  - name: settings
    description: Uygulama ayarları
  - name: products
    description: Barkod ve ürün tanıma işlemleri
  - name: ai
    description: Yapay zeka modülü işlemleri

paths:

  /auth/register:
    post:
      tags:
        - auth
      summary: Kayıt Ol
      description: Kullanıcıların fiziksel verilerini ve hedeflerini kaydederek yeni hesap oluşturur
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
            examples:
              example1:
                summary: Örnek kullanıcı kaydı
                value:
                  fullName: Adil Mammadov
                  email: adil@example.com
                  password: SecurePassword123!
                  height: 186
                  weight: 96
                  goalWeight: 85
                  activityLevel: "1.55"
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: Email adresi zaten kullanımda
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags:
        - auth
      summary: Giriş Yap
      description: Kullanıcının sisteme kimlik doğrulaması yaparak JWT token almasını sağlar
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginCredentials'
            examples:
              example1:
                summary: Örnek giriş
                value:
                  email: adil@example.com
                  password: SecurePassword123!
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /consumptions:
    post:
      tags:
        - consumptions
      summary: Tüketim Ekle
      description: Tüketilen gıdaların kalori değerini veya içilen su miktarını sisteme ekler
      operationId: addConsumption
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ConsumptionCreate'
            examples:
              example1:
                summary: Su tüketimi ekleme
                value:
                  type: water
                  amount: 0.25
              example2:
                summary: Kalori ekleme
                value:
                  type: food
                  name: Izgara Tavuk
                  amount: 350
      responses:
        '201':
          description: Tüketim başarıyla eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Consumption'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /consumptions/history:
    get:
      tags:
        - consumptions
      summary: Geçmişi Görüntüle
      description: Sisteme eklenen tüm yiyecek ve su kayıtlarının listesini getirir
      operationId: getConsumptionHistory
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Geçmiş listesi başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Consumption'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /consumptions/{consumptionId}:
    delete:
      tags:
        - consumptions
      summary: Kaydı Sil
      description: Yanlışlıkla eklenen bir kalori veya su kaydını sistemden kaldırır
      operationId: deleteConsumption
      security:
        - BearerAuth: []
      parameters:
        - name: consumptionId
          in: path
          required: true
          schema:
            type: string
          description: Silinecek kaydın ID'si
      responses:
        '204':
          description: Kayıt başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

  /users/{userId}:
    get:
      tags:
        - users
      summary: Özellikleri Görüntüle
      description: Kullanıcının profil bilgilerini (boy, kilo, hedefler) getirir
      operationId: getUserProfile
      security:
        - BearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Kullanıcı profili başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags:
        - users
      summary: Hesabı Sil
      description: Kullanıcının tüm sağlık verilerini ve profilini kalıcı olarak siler
      operationId: deleteUser
      security:
        - BearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Hesap kalıcı olarak silindi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}/weight:
    put:
      tags:
        - users
      summary: Mevcut Kiloyu Güncelle
      description: Kullanıcının güncel kilo bilgisini değiştirir ve hedefleri yeniden hesaplar
      operationId: updateWeight
      security:
        - BearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                newWeight:
                  type: number
                  example: 94.5
      responses:
        '200':
          description: Kilo başarıyla güncellendi
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}/activity-level:
    put:
      tags:
        - users
      summary: Hareket Seviyesini Güncelle
      description: Kullanıcının günlük aktivite çarpanını günceller
      operationId: updateActivityLevel
      security:
        - BearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                activityLevel:
                  type: string
                  enum: ["1.2", "1.55", "1.725"]
                  example: "1.725"
      responses:
        '200':
          description: Aktivite seviyesi güncellendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /settings/{userId}/theme:
    put:
      tags:
        - settings
      summary: Tema Ayarını Güncelle
      description: Uygulama arayüzünü Light veya Dark mode olarak değiştirir
      operationId: updateTheme
      security:
        - BearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                theme:
                  type: string
                  enum: [light, dark]
                  example: dark
      responses:
        '200':
          description: Tema başarıyla güncellendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /progress/weight:
    get:
      tags:
        - progress
      summary: İlerleme Durumu
      description: Kullanıcının başlangıç, mevcut ve hedef kilosunu karşılaştırmalı olarak getirir
      operationId: getWeightProgress
      security:
        - BearerAuth: []
      responses:
        '200':
          description: İlerleme verileri başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProgressData'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /progress/weekly:
    get:
      tags:
        - progress
      summary: Haftalık Çizelge
      description: Haftanın 7 günü için alınan kalori istatistiklerini getirir
      operationId: getWeeklyChart
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Haftalık grafik verileri başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WeeklyChart'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /products/barcode/{barcodeNo}:
    get:
      tags:
        - products
      summary: Barkod Tarama
      description: Open Food Facts API'si üzerinden barkoda göre ürünün kalori değerini bulur
      operationId: scanBarcode
      security:
        - BearerAuth: []
      parameters:
        - name: barcodeNo
          in: path
          required: true
          schema:
            type: string
            example: "8690504000000"
      responses:
        '200':
          description: Ürün bilgileri başarıyla bulundu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResult'
        '404':
          $ref: '#/components/responses/NotFound'

  /ai/recommendations/meal:
    get:
      tags:
        - ai
      summary: Öğün Önerisi Alma
      description: Kullanıcının günlük kalan kalorisine ve makro ihtiyacına göre yapay zeka tavsiyesi üretir
      operationId: getAIRecommendation
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Öneri başarıyla üretildi
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Bugün protein eksiğin var, akşam yemeğinde ızgara tavuk ve bol salata tercih edebilirsin."
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile güvenli kimlik doğrulama

  schemas:
    UserRegistration:
      type: object
      required:
        - fullName
        - email
        - password
        - height
        - weight
        - goalWeight
      properties:
        fullName:
          type: string
          minLength: 2
        email:
          type: string
          format: email
        password:
          type: string
          format: password
          minLength: 8
        height:
          type: number
        weight:
          type: number
        goalWeight:
          type: number
        activityLevel:
          type: string
          enum: ["1.2", "1.55", "1.725"]

    LoginCredentials:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password

    User:
      type: object
      properties:
        id:
          type: string
        fullName:
          type: string
        email:
          type: string
        dailyGoalKcal:
          type: integer
        theme:
          type: string
          enum: [light, dark]
        createdAt:
          type: string
          format: date-time

    AuthToken:
      type: object
      properties:
        token:
          type: string
        tokenType:
          type: string
          example: Bearer
        expiresIn:
          type: integer
          example: 86400
        user:
          $ref: '#/components/schemas/User'

    ConsumptionCreate:
      type: object
      required:
        - type
        - amount
      properties:
        type:
          type: string
          enum: [food, water]
        amount:
          type: number
          description: Kalori (kcal) veya Litre (L) cinsinden miktar
        name:
          type: string
          description: Tüketilen yiyeceğin adı (sadece food için)

    Consumption:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
          enum: [food, water]
        amount:
          type: number
        name:
          type: string
        timestamp:
          type: string
          format: date-time

    ProgressData:
      type: object
      properties:
        startWeight:
          type: number
        currentWeight:
          type: number
        goalWeight:
          type: number
        progressPercentage:
          type: integer
          minimum: 0
          maximum: 100

    WeeklyChart:
      type: object
      properties:
        labels:
          type: array
          items:
            type: string
            example: "Pzt"
        datasets:
          type: array
          items:
            type: integer
            example: 2100

    ProductResult:
      type: object
      properties:
        productName:
          type: string
        kcalPer100g:
          type: number

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
        message:
          type: string

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: BAD_REQUEST
            message: İstek parametreleri geçersiz veya eksik
    Unauthorized:
      description: Kimlik doğrulama gerekli
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: UNAUTHORIZED
            message: Kimlik doğrulama başarısız veya token süresi doldu
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: NOT_FOUND
            message: İstenilen kayıt veya kaynak bulunamadı
            ```yaml
openapi: 3.0.3
info:
  title: FlexiFit API
... (kodların geri kalanı) ...
```
