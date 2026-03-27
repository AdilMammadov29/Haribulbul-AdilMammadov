const API_URL = "https://flexifit-api.onrender.com"; // Senin gerçek Render linkin
let isLoginMode = true;

function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("form-title").innerText = isLoginMode ? "Sisteme Giriş Yap" : "Yeni Hesap Oluştur";
    document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    const toggleLink = document.getElementById("toggle-link");
    if(toggleLink) toggleLink.innerText = isLoginMode ? "Hesabın yok mu? Yeni Hesap Oluştur" : "Zaten hesabın var mı? Giriş Yap";
    
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

    const btn = document.getElementById("auth-btn");
    btn.innerText = "İşleniyor...";

    const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
    const bodyData = isLoginMode ? { email, password } : { full_name: fullname, email, password, height, weight };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        });
        const data = await res.json();

        if (res.ok) {
            if (!isLoginMode) {
                alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
                toggleAuth();
            } else {
                alert("Giriş Başarılı!");
                localStorage.setItem("userEmail", email);
                document.getElementById("auth-section").classList.add("hidden");
                document.getElementById("dashboard-section").classList.remove("hidden");
                document.getElementById("home-name").innerText = data.user?.full_name || "Kullanıcı";
            }
        } else {
            alert("Hata: " + (data.error || "İşlem başarısız"));
        }
    } catch (err) {
        alert("Sunucu uykuda olabilir veya bağlantı hatası! Lütfen 30 sn sonra tekrar deneyin.");
    } finally {
        btn.innerText = isLoginMode ? "GİRİŞ YAP" : "KAYIT OL";
    }
}

// ASIL AI FONKSİYONU BURADA (İSİM DÜZELTİLDİ)
async function generateAIAdvice() {
    const resEl = document.getElementById("ai-chat-result");
    resEl.classList.remove("hidden");
    resEl.innerHTML = "<div class='flex items-center gap-2'><i class='fa-solid fa-spinner fa-spin'></i> <span>Yapay Zeka analiz yapıyor...</span></div>";
    
    const hour = new Date().getHours();
    
    try {
        const res = await fetch(`${API_URL}/api/recommendation/${hour}`);
        const data = await res.json();
        
        if(res.ok) {
            resEl.innerHTML = `<strong><i class='fa-solid fa-robot text-blue-500 mr-2'></i> AI Antrenör (${data.meal}):</strong><br><br>${data.suggestion}`;
        } else {
            resEl.innerHTML = "Öneri alınamadı.";
        }
    } catch (error) {
        resEl.innerHTML = "Sunucuya bağlanılamadı. Lütfen backend linkine tıklayıp uyandırın!";
    }
}

function logout() {
    localStorage.removeItem("userEmail");
    location.reload(); // En temiz çıkış yolu
}

// Sekme Geçişleri (Bunu da ekledim eksik kalmasın)
function switchTab(tab) {
    const tabs = ['home', 'diet', 'ai', 'profile'];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).classList.remove('tab-active');
    });
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    document.getElementById(`nav-${tab}`).classList.add('tab-active');
}
