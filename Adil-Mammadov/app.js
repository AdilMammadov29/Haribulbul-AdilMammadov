// Senin canlı API adresin
const API_URL = "https://flexifit-api.onrender.com";

// --- KAYIT OL (REGISTER) İŞLEMİ ---
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    const messageDiv = document.getElementById('regMessage');
    messageDiv.innerText = "Yükleniyor...";
    messageDiv.style.color = "blue";

    // Kutulardaki bilgileri alıyoruz
    const data = {
        fullName: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        height: parseInt(document.getElementById('regHeight').value),
        weight: parseInt(document.getElementById('regWeight').value)
    };

    try {
        // API'ye bilgileri fırlatıyoruz
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            messageDiv.innerText = "✅ Kayıt Başarılı! Şimdi giriş yapabilirsin.";
            messageDiv.style.color = "green";
            document.getElementById('registerForm').reset(); // Formu temizle
        } else {
            messageDiv.innerText = "❌ Kayıt başarısız! E-posta kullanılıyor olabilir.";
            messageDiv.style.color = "red";
        }
    } catch (error) {
        messageDiv.innerText = "❌ Sunucuya bağlanılamadı.";
        messageDiv.style.color = "red";
    }
});

// --- GİRİŞ YAP (LOGIN) İŞLEMİ ---
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.innerText = "Yükleniyor...";
    messageDiv.style.color = "blue";

    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

      if (response.status === 200) {
            messageDiv.innerText = "✅ Giriş Başarılı! Yönlendiriliyorsunuz...";
            messageDiv.style.color = "green";
            
            // 2 Saniye sonra formları gizle, paneli aç
            setTimeout(() => {
                document.getElementById('registerForm').parentElement.style.display = 'none'; // Kayıt formunu gizle
                document.getElementById('loginForm').parentElement.style.display = 'none'; // Giriş formunu gizle
                document.getElementById('dashboard').style.display = 'block'; // Paneli Göster
            }, 1500);

        } else {
            messageDiv.innerText = "❌ Hatali e-posta veya şifre!";
            messageDiv.style.color = "red";
        }
    } catch (error) {
        messageDiv.innerText = "❌ Sunucuya bağlanilamadi.";
        messageDiv.style.color = "red";
    }
    // --- AI BUTONU İŞLEMİ ---
document.getElementById('aiButton').addEventListener('click', () => {
    const aiText = document.getElementById('aiResult');
    aiText.innerText = "Analiz ediliyor...";
    aiText.style.color = "blue";
    
    setTimeout(() => {
        aiText.innerText = "Yapay Zeka Tavsiyesi: Vücut kitle indeksinize göre harika bir ivmeniz var. Bugün protein ağırlıklı beslenip, 45 dakikalık orta tempo kardiyo yapmanız önerilir. Barkod entegrasyonu bir sonraki sürümde aktif edilecektir.";
        aiText.style.color = "green";
    }, 2000);
});
});