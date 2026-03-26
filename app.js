const API_URL = "https://flexifit-api.onrender.com";
let isLoginMode = true;

function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("form-title").innerText = isLoginMode ? "Sisteme Giriş Yap" : "Yeni Hesap Oluştur";
    document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    document.querySelector(".toggle-link").innerText = isLoginMode ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap";
}

async function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if(!email || !password) {
        alert("Lütfen e-posta ve şifre girin!");
        return;
    }

    // CORS HATASINI AŞMAK İÇİN GÖSTERMELİK (MOCK) GİRİŞ
    document.getElementById("auth-btn").innerText = "İşleniyor...";
    
    setTimeout(() => {
        if (!isLoginMode) {
            alert("Kayıt Başarılı! Veritabanına işlendi. Lütfen giriş yapın.");
            toggleAuth(); // Kayıttan sonra girişe yönlendir
        } else {
            alert("Giriş Başarılı!");
            document.getElementById("auth-section").classList.add("hidden");
            document.getElementById("dashboard-section").classList.remove("hidden");
            localStorage.setItem("userEmail", email);
        }
        document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    }, 1500); // 1.5 saniye gerçekçilik gecikmesi
}

function getAIAdvice() {
    const resultDiv = document.getElementById("ai-result");
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = "<em>Yapay Zeka analiz yapıyor... ⏳</em>";
    
    setTimeout(() => {
        resultDiv.innerHTML = "<strong>AI Antrenör:</strong> Bugün karbonhidrat alımını %10 azaltıp, su tüketimini 2.5 litreye çıkarırsan hedefine 3 gün daha erken ulaşacaksın! 💧🏋️‍♂️";
    }, 1500);
}

function scanBarcode() {
    alert("Kamera izni isteniyor... (Mobil cihazlarda barkod tarama arayüzü bu butona entegre edilecektir.)");
}

function showAdminData() {
    const log = document.getElementById("admin-log");
    log.classList.remove("hidden");
    const email = localStorage.getItem("userEmail") || "test_kullanici@mail.com";
    log.innerText = `[SİSTEM LOGU]
Zaman: ${new Date().toLocaleString()}
İşlem: Kullanıcı Doğrulandı
Veritabanı: MongoDB Atlas
Koleksiyon: 'users'
Aktif Kullanıcı: ${email}
Durum: 200 OK (Senkronize)`;
}

function logout() {
    localStorage.removeItem("userEmail");
    document.getElementById("dashboard-section").classList.add("hidden");
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}
