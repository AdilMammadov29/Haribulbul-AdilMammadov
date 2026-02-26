# Xaribulbul-AdilMammadov
FlexiFit-Yapay zeka destekli beslenme asistani
GEREKSINIMLER
1.Kayıt Ol (POST): Uygulamayı kullanacak kişinin yaş, boy, kilo ve cinsiyet gibi 
fiziksel verilerini sisteme ilk kez kaydetmesi.
2.Giriş Yap (POST): Daha önce kayıt olan kişinin kendi profiline tekrar erişim 
sağlaması.
3.Tüketim Ekle (POST): Gün içinde yenen gıdaların enerji değerini veya içilen su 
miktarını sisteme girmesi ve ona göre grafikte ilerleme kaydetmesi
4.Fiziksel Özellikleri Görüntüle (GET): Kişinin sisteme daha önceden kaydettiği 
boy, yaş ve kilo gibi özelliklerini ekranda görmesi.
5.Tüketim Geçmişini Görüntüle (GET): O gün içinde sisteme eklenen tüm 
yiyeceklerin ve suyun ekranda liste halinde gösterilmesi.
6.Kilo İlerleme Grafiğini Görüntüle (GET): Kişinin başlangıç ağırlığı ile hedef 
ağırlığı arasındaki farkı ve hedefe ne kadar yaklaştığını görsel bir ilerleme çubuğu 
üzerinde görmesi.
7.Haftalık Çizelgeyi Görüntüle (GET): Haftanın günlerine ait tamamlanma 
durumlarını ve geçmiş günlerin enerji verilerini görsel bir grafik üzerinde görmesi.
8.Mevcut Kiloyu Güncelle (UPDATE): Kişinin zamanla değişen vücut ağırlığını 
sistemde yenisiyle değiştirmesi.
9.Hareket Seviyesini Güncelle (UPDATE): Kişinin günlük yaşamındaki 
hareketlilik durumunu sonradan değiştirmesi.
10.Tema Ayarını Güncelle (UPDATE): Uygulamanın ekran görünümünü dark 
mode veya aydınlık mod olacak şekilde değiştirmesi.
11.Hatalı Kaydı Sil (DELETE): Sisteme yanlışlıkla girilen bir yiyecek veya su 
verisinin listeden çıkarılması.
12..Hesabı Sil (DELETE): Kişinin sistemdeki hesabını ve kendine ait tüm geçmiş 
kayıtlarını tamamen kaldırması.
13.Ürün Barkodu Tara (GET): Cihazın kamerasını kullanarak paketli bir gıdanın 
barkodunu okutması ve o ürünün besin değerlerini ekrana getirmesi.
14.Öğün Önerisi Al (GET): Uygulamanın; günün saatine ve alınan enerji miktarına 
bakarak sıradaki öğün için yiyecek tavsiyesi üretmesi
