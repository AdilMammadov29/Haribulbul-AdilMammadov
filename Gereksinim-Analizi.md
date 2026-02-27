# FlexiFit Pro - API Tasarımı
> **Görev Dağılımı Notu:** Bu proje tek kişilik bir ekip tarafından yürütüldüğü için, aşağıda numaralandırılmış olan tüm gereksinimlerin (15 adet) tasarımı, API geliştirme süreçleri ve testleri **Adil Mammadov**'a atanmıştır.
1. **Kayıt Olma**
   * **API Metodu:** `POST /auth/register`
   * **Açıklama:** Uygulamayı kullanacak kişilerin yaş, boy, kilo ve cinsiyet verilerini sisteme kaydederek yeni bir hesap oluşturmasını sağlar. Kişisel bilgilerin toplanmasını ve veritabanına işlenmesini içerir.

2. **Giriş Yapma**
   * **API Metodu:** `POST /auth/login`
   * **Açıklama:** Kayıtlı kişilerin sisteme kimlik doğrulaması yaparak kendi profillerine erişim sağlamasını kontrol eder. Başarılı giriş durumunda güvenlik oturumu (token) başlatılır.

3. **Tüketim Ekleme**
   * **API Metodu:** `POST /consumptions`
   * **Açıklama:** Tüketilen gıdaların enerji değerini ve içilen su miktarını sisteme ekler. Güvenlik için giriş yapmış olmak gerekir ve veriler doğrudan o anki kullanıcının profiline yazılır.

4. **Özellikleri Görüntüleme**
   * **API Metodu:** `GET /users/{userId}`
   * **Açıklama:** Kişinin sisteme kaydettiği boy, yaş ve kilo gibi fiziksel verilerini getirir. Kullanıcılar yalnızca kendi fiziksel profillerini görüntüleyebilir.

5. **Geçmişi Görüntüleme**
   * **API Metodu:** `GET /consumptions/history`
   * **Açıklama:** Sisteme daha önceden eklenen tüm yiyecek ve su kayıtlarını tarih sırasına göre liste halinde getirir. Güvenlik için yetkilendirme (token) gerektirir.

6. **İlerleme Durumunu Görüntüleme**
   * **API Metodu:** `GET /progress/weight`
   * **Açıklama:** Başlangıç ağırlığı ile hedef ağırlığı arasındaki sayısal farkı hesaplayarak ilerleme çubuğu verilerini getirir. 

7. **Haftalık Çizelgeyi Görüntüleme**
   * **API holistic:** `GET /progress/weekly`
   * **Açıklama:** Haftanın günlerine ait tamamlanma durumlarını ve geçmiş günlerin enerji verilerini grafiksel çizim için sayısal formatta sunar.

8. **Mevcut Kiloyu Güncelleme**
   * **API Metodu:** `PUT /users/{userId}/weight`
   * **Açıklama:** Kişinin zamanla değişen vücut ağırlığı verisini sistemde yenisiyle değiştirmesini sağlar. Kullanıcılar yalnızca kendi verilerini güncelleyebilir.

9. **Hareket Seviyesini Güncelleme**
   * **API Metodu:** `PUT /users/{userId}/activity-level`
   * **Açıklama:** Günlük hareketlilik durumu (aktivite seviyesi) verisini değiştirir. Yeni seviyeye göre sistemdeki kalori ihtiyacı arka planda yeniden hesaplanır.

10. **Tema Ayarını Güncelleme**
    * **API Metodu:** `PUT /settings/{userId}/theme`
    * **Açıklama:** Ekran modunu (karanlık/aydınlık) değiştirmesi için kullanıcı arayüzü tercihlerini veritabanında günceller.

11. **Kaydı Silme**
    * **API Metodu:** `DELETE /consumptions/{consumptionId}`
    * **Açıklama:** Sisteme yanlışlıkla girilen belirli bir yiyecek veya su verisinin ID'sine göre bulunup veritabanından kalıcı olarak çıkarılmasını sağlar.

12. **Hesabı Silme**
    * **API Metodu:** `DELETE /users/{userId}`
    * **Açıklama:** Kişinin hesabını, profil bilgilerini ve kendine ait tüm tüketim geçmişi kayıtlarını sistemden tamamen siler. Güvenlik için şifre onayı gerektirir.

13. **Barkod Tarama**
    * **API Metodu:** `GET /products/barcode/{barcodeNo}`
    * **Açıklama:** Cihaz kamerasıyla okutulan gıda barkod numarasını dış veya iç veritabanında sorgular ve eşleşen ürünün besin değerlerini ekrana getirir.

14. **Öğün Önerisi Alma (Yapay Zeka Modülü)**
    * **API Metodu:** `GET /ai/recommendations/meal`
    * **Açıklama:** Uygulamanın; anlık saat verisine ve o ana kadar alınan enerji miktarına göre yapay zeka algoritmasını tetikleyerek sıradaki öğün için yiyecek tavsiyesi üretmesini sağlar.
