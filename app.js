let isLoginMode = true;

// BU FONKSİYON EKRANLAR ARASI GEÇİŞİ SAĞLAR
function toggleAuth() {
    isLoginMode = !isLoginMode;
    
    const formTitle = document.getElementById("form-title");
    const authBtn = document.getElementById("auth-btn");
    const toggleText = document.querySelector(".toggle-link");
    const registerFields = document.getElementById("register-fields");

    if (isLoginMode) {
        formTitle.innerText = "Sisteme Giriş Yap";
        authBtn.innerText = "Giriş Yap";
        toggleText.innerText = "Hesabın yok mu? Kayıt Ol";
        registerFields.classList.add("hidden");
    } else {
        formTitle.innerText = "Yeni Hesap Oluştur";
        authBtn.innerText = "Kayıt Ol";
        toggleText.innerText = "Zaten hesabın var mı? Giriş Yap";
        registerFields.classList.remove("hidden");
    }
}

// GİRİŞ VE KAYIT İŞLEMİ
function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if(!email || !password) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }
    
    if(!isLoginMode) {
        // KAYIT OLMA MODU
        const name = document.getElementById("fullname").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;

        if(!name || !height || !weight) {
            alert("Lütfen boy, kilo ve ad soyad girin!");
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userHeight", height);
        localStorage.setItem("userWeight", weight);
        
        alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
        toggleAuth(); // Giriş ekranına geri gönder
    } else {
        // GİRİŞ YAPMA MODU
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadDashboard();
    }
}

// DASHBOARD VERİLERİNİ YÜKLE
function loadDashboard() {
    const name = localStorage.getItem("userName") || "Değerli Kullanıcı";
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    
    document.getElementById("home-name").innerText = name;
    document.getElementById("p-name").value = name;
    document.getElementById("p-weight").value = weight;
    document.getElementById("p-height").value = height;

    const bmi = (weight / ((height/100)**2)).toFixed(1);
    document.getElementById("home-bmi").innerText = `VKİ: ${bmi} (${getBMICategory(bmi)})`;
}

// VKİ KATEGORİSİ
function getBMICategory(bmi) {
    if(bmi < 18.5) return "Zayıf";
    if(bmi < 25) return "Normal";
    if(bmi < 30) return "Fazla Kilolu";
    return "Obez";
}

// TAB DEĞİŞTİRME SİSTEMİ
function switchTab(tab) {
    const tabs = ["home", "diet", "profile", "ai"];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.add("hidden");
        document.getElementById(`nav-${t}`).classList.remove("tab-active", "text-green-600");
        document.getElementById(`nav-${t}`).classList.add("text-gray-400");
    });
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
    const activeNav = document.getElementById(`nav-${tab}`);
    activeNav.classList.add("tab-active", "text-green-600");
    activeNav.classList.remove("text-gray-400");
}

// YEMEK EKLEME
function addFood() {
    const name = document.getElementById("food-name").value;
    const cal = document.getElementById("food-cal").value;
    if(!name || !cal) return;
    const item = `<div class="flex justify-between p-3 bg-gray-50 border rounded-lg text-sm mb-2">
                    <span>${name}</span><span class="font-bold text-green-600">${cal} kcal</span>
                  </div>`;
    document.getElementById("food-list").insertAdjacentHTML('afterbegin', item);
    document.getElementById("food-name").value = "";
    document.getElementById("food-cal").value = "";
}

// AI TAVSİYESİ (HER SEFERİNDE FARKLI)
function generateAIAdvice() {
    const res = document.getElementById("ai-chat-result");
    res.classList.remove("hidden");
    res.innerHTML = "Verilerin analiz ediliyor... 🤖";
    
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    const bmi = (weight / ((height/100)**2)).toFixed(1);

    const advices = [
        `VKİ değerin ${bmi}. Bugün protein ağırlıklı beslenip akşam yürüyüşünü 15 dakika uzatırsan metabolizman %5 hızlanır.`,
        `Şu an ${weight} kilosun. Kas kütleni korumak için bugün kg başına 1.5g protein almayı unutma! 💪`,
        `Su tüketimin vücut ağırlığına göre düşük görünüyor. Bugün 3 litreyi tamamlamaya odaklan. 💧`,
        `Boyun ${height} cm. Postürünü düzeltmek için bugün 10 dakikalık esneme hareketleri yapmalısın.`,
        `Harika gidiyorsun! Bugün karbonhidratı sadece antrenman öncesi tüketerek yağ yakımını maksimize edebilirsin.`
    ];

    setTimeout(() => {
        res.innerHTML = "<strong>AI Coach:</strong> " + advices[Math.floor(Math.random() * advices.length)];
    }, 1200);
}

// PROFİL GÜNCELLEME
function updateProfile() {
    localStorage.setItem("userName", document.getElementById("p-name").value);
    localStorage.setItem("userWeight", document.getElementById("p-weight").value);
    localStorage.setItem("userHeight", document.getElementById("p-height").value);
    alert("Profil Bilgileri Güncellendi!");
    loadDashboard();
    switchTab('home');
}

// ÇIKIŞ
function logout() {
    location.reload();
}
