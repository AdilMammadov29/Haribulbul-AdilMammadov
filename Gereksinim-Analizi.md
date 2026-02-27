# FlexiFit Pro - Gereksinim Analizi

> **Görev Dağılımı Notu:** Bu proje tek kişilik bir ekip tarafından yürütüldüğü için, aşağıda numaralandırılmış olan tüm gereksinimlerin tasarımı, API geliştirme süreçleri ve testleri **Adil Mammadov**'a atanmıştır.

## Fonksiyonel Gereksinim Listesi

1. **Kayıt Ol (POST):** Uygulamayı kullanacak kişinin yaş, boy, kilo ve cinsiyet verilerini sisteme kaydetmesi.
2. **Giriş Yap (POST):** Kayıtlı kişinin kendi profiline erişim sağlaması.
3. **Tüketim Ekle (POST):** Tüketilen gıdaların enerji değerini ve içilen su miktarını sisteme girmesi.
4. **Özellikleri Görüntüle (GET):** Kişinin sisteme kaydettiği boy, yaş ve kilo verilerini ekranda görmesi.
5. **Geçmişi Görüntüle (GET):** Sisteme eklenen yiyecek ve su kayıtlarını liste halinde görmesi.
6. **İlerleme Durumunu Görüntüle (GET):** Başlangıç ağırlığı ile hedef ağırlığı arasındaki sayısal farkı ilerleme çubuğu üzerinde görmesi.
7. **Haftalık Çizelgeyi Görüntüle (GET):** Haftanın günlerine ait tamamlanma durumlarını ve enerji verilerini grafik üzerinde görmesi.
8. **Mevcut Kiloyu Güncelle (UPDATE):** Vücut ağırlığı verisini sistemde yenisiyle değiştirmesi.
9. **Hareket Seviyesini Güncelle (UPDATE):** Günlük hareketlilik durumu verisini değiştirmesi.
10. **Tema Ayarını Güncelle (UPDATE):** Ekran modunu (karanlık/aydınlık) değiştirmesi.
11. **Kaydı Sil (DELETE):** Sisteme girilen yiyecek veya su verisini listeden çıkarması.
12. **Hesabı Sil (DELETE):** Kişinin hesabını ve geçmiş kayıtlarını sistemden silmesi.
13. **Barkod Tara (GET):** Cihaz kamerasını kullanarak gıda barkodunu okutması ve ürünün besin değerlerini ekrana getirmesi.
14. **Öğün Önerisi Al (GET):** Uygulamanın; saat ver
