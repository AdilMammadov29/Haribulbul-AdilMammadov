openapi: 3.0.3
info:
  title: TalantLoop API
  description: |
    TalantLoop yetenek ve zaman takası (kredi) platformu için RESTful API.

    ## Özellikler
    - Kullanıcı kayıt ve kimlik doğrulama
    - Profil yönetimi
    - İlan (Ders/Yetenek) oluşturma ve listeleme
    - Kredi transferi ve bakiye sorgulama
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: TalantLoop Support
    email: support@talantloop.com
    url: https://api.talantloop.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.talantloop.com/v1
    description: Production server
  - url: https://staging-api.talantloop.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri
  - name: users
    description: Profil ve bakiye işlemleri
  - name: ads
    description: İlan yönetimi işlemleri
  - name: transactions
    description: Kredi transfer işlemleri

paths:

  /auth/register:
    post:
      tags:
        - auth
      summary: Kullanıcı Kayıt Ol
      description: Yeni bir hesap oluşturma işlemi
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
            examples:
              example1:
                summary: Örnek kayıt
                value:
                  fullName: Adil Mammadov
                  email: adil@example.com
                  password: Password123!
                  skills: ["Python", "Matematik"]
      responses:
        '201':
          description: Hesap başarıyla oluşturuldu
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
      summary: Kullanıcı Giriş Yap
      description: Sisteme erişim yetkisi alma ve JWT token üretimi
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
                  password: Password123!
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}:
    put:
      tags:
        - users
      summary: Profil Bilgilerini Güncelle
      description: Kullanıcı adı veya yetkinlik güncelleme
      operationId: updateUser
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
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: Profil başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'

    delete:
      tags:
        - users
      summary: Profilini Sil
      description: Üyeliği sonlandırma ve hesabı kaldırma
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
          description: Üyelik başarıyla sonlandırıldı
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}/balance:
    get:
      tags:
        - users
      summary: Bakiye Sorgula
      description: Kullanıcının kaç kredisi kaldığını görüntüleme
      operationId: getBalance
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
          description: Bakiye başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BalanceResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ads:
    post:
      tags:
        - ads
      summary: Yeni İlan Oluştur
      description: '"1 saat ders verebilirim" gibi yeni bir yetenek ilanı açma'
      operationId: createAd
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdCreate'
            examples:
              example1:
                summary: Örnek ilan
                value:
                  title: "1 saat Python dersi verebilirim"
                  description: "Sıfırdan temel seviye Python eğitimi"
                  creditCost: 1
      responses:
        '201':
          description: İlan başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ad'
        '401':
          $ref: '#/components/responses/Unauthorized'

    get:
      tags:
        - ads
      summary: İlanları Listele
      description: Mevcut tüm ilanları ana sayfada görme
      operationId: getAds
      responses:
        '200':
          description: İlan listesi başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Ad'

  /ads/{adId}:
    put:
      tags:
        - ads
      summary: İlan Güncelle
      description: Açılan ilanın açıklamasını veya detaylarını değiştirme
      operationId: updateAd
      security:
        - BearerAuth: []
      parameters:
        - name: adId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdUpdate'
      responses:
        '200':
          description: İlan başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ad'
        '401':
          $ref: '#/components/responses/Unauthorized'

    delete:
      tags:
        - ads
      summary: İlan Sil
      description: Verilen ilanı sistemden kaldırma
      operationId: deleteAd
      security:
        - BearerAuth: []
      parameters:
        - name: adId
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: İlan başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /transactions/transfer:
    post:
      tags:
        - transactions
      summary: Kredi Transferi Yap
      description: İşlem bittiğinde 1 krediyi birinden diğerine aktarma
      operationId: transferCredit
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TransferRequest'
            examples:
              example1:
                summary: Örnek transfer
                value:
                  senderId: "user_123"
                  receiverId: "user_456"
                  amount: 1
      responses:
        '200':
          description: Transfer işlemi başarıyla gerçekleşti
        '400':
          $ref: '#/components/responses/BadRequest'
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
        skills:
          type: array
          items:
            type: string

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
        skills:
          type: array
          items:
            type: string
        credits:
          type: integer
          description: Mevcut yetenek takası kredisi

    UserUpdate:
      type: object
      properties:
        fullName:
          type: string
        skills:
          type: array
          items:
            type: string

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

    AdCreate:
      type: object
      required:
        - title
        - description
        - creditCost
      properties:
        title:
          type: string
        description:
          type: string
        creditCost:
          type: integer

    AdUpdate:
      type: object
      properties:
        title:
          type: string
        description:
          type: string

    Ad:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        title:
          type: string
        description:
          type: string
        creditCost:
          type: integer
        createdAt:
          type: string
          format: date-time

    TransferRequest:
      type: object
      required:
        - senderId
        - receiverId
        - amount
      properties:
        senderId:
          type: string
        receiverId:
          type: string
        amount:
          type: integer
          minimum: 1

    BalanceResponse:
      type: object
      properties:
        userId:
          type: string
        availableCredits:
          type: integer
          example: 5

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
            message: İstek parametreleri geçersiz veya yetersiz bakiye
    Unauthorized:
      description: Kimlik doğrulama gerekli
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: UNAUTHORIZED
            message: Kimlik doğrulama başarısız
