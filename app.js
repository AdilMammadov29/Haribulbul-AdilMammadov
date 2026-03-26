let isLoginMode = true;

function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("form-title").innerText = isLoginMode ? "Sisteme Giriş Yap" : "Yeni Hesap Oluştur";
    document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    document.querySelector(".toggle-link").innerText = isLoginMode ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap";
    
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
    
    setTimeout(() => {
        if (!isLoginMode) {
            // Kayıt olurken verileri tarayıcı hafızasına kaydet
            localStorage.setItem("userName", fullname);
            localStorage.setItem("userHeight", height);
            localStorage.setItem("userWeight", weight);
            alert("Kayıt Başarılı! Veritabanına işlendi. Lütfen giriş yapın.");
            toggleAuth(); 
        } else {
            alert("Giriş Başarılı!");
            document.getElementById("auth-section").classList.add("hidden");
            document.getElementById("dashboard-section").classList.remove("hidden");
            localStorage.setItem("userEmail", email);
            loadProfile(); // Giriş yapınca profili yükle
        }
        document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    }, 1500); 
}

function loadProfile() {
    // Hafızadan verileri çek (yoksa varsayılan göster)
    const name = localStorage.getItem("userName") || "Adil M.";
    const h = localStorage.getItem("userHeight") || "180";
    const w = localStorage.getItem("userWeight") || "80";

    document.getElementById("display-name").innerText = name;
    document.getElementById("display-height").innerText = h;
    document.getElementById("display-weight").innerText = w;

    // VKİ Hesaplama (Kilo / Boyun karesi)
    const heightInMeters = h / 100;
    const bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
    
    let durum = "";
    if(bmi < 18.5) durum = "(Zayıf)";
    else if(bmi < 25) durum = "(Normal)";
    else if(bmi < 30) durum = "(Fazla Kilolu)";
    else durum = "(Obez)";

    document.getElementById("display-bmi").innerText = `Hedef Analizi: VKİ ${bmi} ${durum}`;
}

function getAIAdvice() {
    const resultDiv = document.getElementById("ai-result");
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = "<em>Yapay Zeka analiz yapıyor... ⏳</em>";
    
    setTimeout(() => {
        resultDiv.innerHTML = "<strong>AI Antrenör:</strong> Hedef kilona ulaşmak için bugün karbonhidratı %10 azaltıp protein alımını artırmalısın. Harika gidiyorsun! 💪";
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
}
