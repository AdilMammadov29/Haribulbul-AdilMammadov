# FlexiFit - REST API Tasarımı (OpenAPI)

> **Görev Dağılımı Notu:** Bu proje tek kişilik bir ekip tarafından yürütüldüğü için, OpenAPI tasarımı **Adil Mammadov**'a atanmıştır.

🔗 **[FlexiFit OpenAPI YAML Dosyasını Görüntülemek İçin Tıklayınız](./openapi.yml)**

Aşağıda, projemizin OpenAPI 3.0.3 formatındaki formatlı kaynak kodu yer almaktadır:

```yaml
openapi: 3.0.3
info:
  title: FlexiFit API
  description: |
    FlexiFit platformu için RESTful API.

    ## Özellikler
    - Kullanıcı kayıt ve kimlik doğrulama
    - Günlük kalori ve su tüketimi takibi
    - Kilo ve hedef ilerleme takibi
    - Günlük ve haftalık istatistikler
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: SoloSoft - Adil Mammadov
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
    description: İlerleme takip işlemleri
  - name: users
    description: Kullanıcı yönetimi işlemleri

paths:

  /auth/register:
    post:
      tags:
        - auth
      summary: Kayıt Ol
      description: Yaş, boy ve kilo verileriyle ilk kayıt işlemini gerçekleştirir
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
                  password: Guvenli123!
                  height: 186
                  weight: 96
                  goalWeight: 85
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

  /auth/login:
    post:
      tags:
        - auth
      summary: Giriş Yap
      description: Kayıtlı kullanıcının sisteme güvenli erişim sağlaması (JWT)
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
                  password: Guvenli123!
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /consumptions:
    post:
      tags:
        - consumptions
      summary: Tüketim Ekle
      description: Günlük kalori veya su tüketimini sisteme ekler
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
                summary: Örnek tüketim
                value:
                  type: food
                  amount: 450
      responses:
        '201':
          description: Tüketim başarıyla eklendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /consumptions/{consumptionId}:
    delete:
      tags:
        - consumptions
      summary: Hatalı Kaydı Sil
      description: Yanlış eklenen kalori/su kaydını sistemden kaldırır
      operationId: deleteConsumption
      security:
        - BearerAuth: []
      parameters:
        - name: consumptionId
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Kayıt başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

  /progress/daily/{userId}:
    get:
      tags:
        - progress
      summary: Günlük İlerleme Grafiği
      description: Alınan kalorinin günlük hedefe oranını getirir
      operationId: getDailyProgress
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
          description: Günlük veriler başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DailyProgress'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /progress/weekly/{userId}:
    get:
      tags:
        - progress
      summary: Haftalık Çizelge
      description: Haftalık kalori takibi için Chart grafik verilerini getirir
      operationId: getWeeklyProgress
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
          description: Haftalık veriler başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WeeklyProgress'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}/weight:
    put:
      tags:
        - users
      summary: Mevcut Kiloyu Güncelle
      description: Kullanıcının değişen kilo bilgisini sistemde günceller
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
                weight:
                  type: integer
                  example: 95
      responses:
        '200':
          description: Kilo başarıyla güncellendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}:
    delete:
      tags:
        - users
      summary: Hesabı Sil
      description: Tüm sağlık verilerini ve profil bilgilerini temizler
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

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama

  schemas:
    UserRegistration:
      type: object
      required:
        - fullName
        - email
        - password
      properties:
        fullName:
          type: string
        email:
          type: string
          format: email
        password:
          type: string
          format: password
        height:
          type: integer
        weight:
          type: integer

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

    AuthToken:
      type: object
      properties:
        token:
          type: string
        tokenType:
          type: string
          example: Bearer

    ConsumptionCreate:
      type: object
      properties:
        type:
          type: string
          enum: [food, water]
        amount:
          type: integer

    DailyProgress:
      type: object
      properties:
        userId:
          type: string
        date:
          type: string
          format: date
        consumedKcal:
          type: integer
        targetKcal:
          type: integer

    WeeklyProgress:
      type: object
      properties:
        userId:
          type: string
        weekStart:
          type: string
          format: date
        dailyStats:
          type: array
          items:
            type: integer

    Error:
      type: object
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
    Unauthorized:
      description: Kimlik doğrulama gerekli
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```
