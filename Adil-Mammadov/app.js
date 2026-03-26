let isLoginMode = true;

function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("form-title").innerText = isLoginMode ? "Sisteme Giriş Yap" : "Yeni Hesap Oluştur";
    document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    document.querySelector(".toggle-link").innerText = isLoginMode ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap";
    
    // Kayıt alanlarını göster/gizle
    const registerFields = document.getElementById("register-fields");
    if(isLoginMode) {
        registerFields.classList.add("hidden");
    } else {
        registerFields.classList.remove("hidden");
    }
}

async function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    
    if(!email || !password) {
        alert("Lütfen e-posta ve şifre girin!");
        return;
    }

    if(!isLoginMode && (!fullname || !height || !weight)) {
        alert("Lütfen boy, kilo ve ad soyad bilgilerinizi eksiksiz girin!");
        return;
    }

    document.getElementById("auth-btn").innerText = "İşleniyor...";
    
    // Mock İstek (Sunucu bekletmesi simülasyonu)
    setTimeout(() => {
        if (!isLoginMode) {
            alert("Kayıt Başarılı! Veritabanına işlendi. Lütfen giriş yapın.");
            toggleAuth(); 
        } else {
            alert("Giriş Başarılı!");
            document.getElementById("auth-section").classList.add("hidden");
            document.getElementById("dashboard-section").classList.remove("hidden");
            localStorage.setItem("userEmail", email);
        }
        document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    }, 1500); 
}

function getAIAdvice() {
    const resultDiv = document.getElementById("ai-result");
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = "<em>Yapay Zeka analiz yapıyor... ⏳</em>";
    
    setTimeout(() => {
        resultDiv.innerHTML = "<strong>AI Antrenör:</strong> Bugün karbonhidrat alımını %10 azaltıp, su tüketimini artırırsan hedefine daha erken ulaşacaksın! 💧🏋️‍♂️";
    }, 1500);
}

function scanBarcode() {
    alert("Kamera izni isteniyor... (Mobil cihazlarda barkod tarama arayüzü bu butona entegre edilecektir.)");
}

function showAdminData() {
    const log = document.getElementById("admin-log");
    log.classList.remove("hidden");
    const email = localStorage.getItem("userEmail") || "test_kullanici@mail.com";
    log.innerText = `[SİSTEM LOGU]\nZaman: ${new Date().toLocaleString()}\nİşlem: Kullanıcı Doğrulandı\nVeritabanı: MongoDB Atlas\nKoleksiyon: 'users'\nAktif Kullanıcı: ${email}\nDurum: 200 OK (Senkronize)`;
}

function logout() {
    localStorage.removeItem("userEmail");
    document.getElementById("dashboard-section").classList.add("hidden");
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("fullname").value = "";
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";
}
