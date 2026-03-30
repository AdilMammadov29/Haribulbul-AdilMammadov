# FlexiFit Pro - REST API Dokümantasyonu
**YouTube Sunum Linki:** [https://youtu.be/iUbSTOnaI1o?si=NcxtU7SOTj52N1f3]
**Backend Domain:** https://flexifit-backend-thna.onrender.com

### API Metotları ve Gereksinim Eşleşmeleri
| Gereksinim | Metot | Endpoint | Açıklama |
| :--- | :--- | :--- | :--- |
| Kayıt Ol | POST | `/auth/register` | Kullanıcı bilgilerini MongoDB'ye kaydeder. |
| Giriş Yap | POST | `/auth/login` | Kimlik doğrulaması yapar. |
| Tüketim Ekle | POST | `/api/consumption` | Yemek ve kalori verisini geçmişe ekler. |
| Profil Görüntüle | GET | `/api/profile/<email>` | Boy, kilo ve kullanıcı verilerini getirir. |
| Geçmişi Görüntüle | GET | `/api/history/<email>` | Tüm tüketim kaydını listeler. |
| Mevcut Kiloyu Güncelle | PUT | `/api/update-weight` | Kullanıcının güncel ağırlığını değiştirir. |
| Kaydı Sil | DELETE | `/api/delete-food` | Yanlış girilen besin kaydını siler. |
| Hesabı Sil | DELETE | `/api/delete-account` | Tüm kullanıcı verilerini kalıcı olarak siler. |
| Öğün Önerisi Al | GET | `/api/recommendation/<hour>` | Saate göre yapay zeka tavsiyesi verir. |

**Not:** Testler Postman üzerinden başarıyla gerçekleştirilmiştir. Koleksiyon dosyası repoda mevcuttur.
