let isLoginMode = true;

function toggleAuth() {
    isLoginMode = !isLoginMode;
    
    const formTitle = document.getElementById("form-title");
    const authBtn = document.getElementById("auth-btn");
    const toggleLink = document.getElementById("toggle-link");
    const registerFields = document.getElementById("register-fields");

    if (isLoginMode) {
        formTitle.innerText = "Sisteme Giriş Yap";
        authBtn.innerText = "Giriş Yap";
        toggleLink.innerText = "Hesabın yok mu? Kayıt Ol";
        registerFields.classList.add("hidden");
    } else {
        formTitle.innerText = "Yeni Hesap Oluştur";
        authBtn.innerText = "Kayıt Ol";
        toggleLink.innerText = "Zaten hesabın var mı? Giriş Yap";
        registerFields.classList.remove("hidden");
    }
}

function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if(!email || !password) {
        alert("Lütfen e-posta ve şifrenizi girin!");
        return;
    }

    if(!isLoginMode) {
        // KAYIT MODU
        const name = document.getElementById("fullname").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;

        if(!name || !height || !weight) {
            alert("Lütfen ad, boy ve kilo bilgilerinizi eksiksiz girin!");
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userHeight", height);
        localStorage.setItem("userWeight", weight);
        
        alert("Kayıt Başarılı! Sisteme giriş yapılıyor...");
        
        // Kayıt olur olmaz panele atıyoruz
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadDashboard();

    } else {
        // GİRİŞ MODU (Girişte boy/kilo sormaz)
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadDashboard();
    }
}

function switchTab(tab) {
    const tabs = ["home", "diet", "profile", "ai"];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.add("hidden");
        const navBtn = document.getElementById(`nav-${t}`);
        navBtn.classList.remove("tab-active");
        navBtn.classList.add("text-gray-400");
    });
    
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
    const activeNav = document.getElementById(`nav-${tab}`);
    activeNav.classList.add("tab-active");
    activeNav.classList.remove("text-gray-400");
}

function loadDashboard() {
    const name = localStorage.getItem("userName") || "Sporcu";
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    
    // Özet sekmesini doldur
    document.getElementById("home-name").innerText = name;
    
    // Profil sekmesini doldur
    document.getElementById("p-name").value = name;
    document.getElementById("p-weight").value = weight;
    document.getElementById("p-height").value = height;

    // VKİ Hesapla
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    document.getElementById("home-bmi").innerText = `VKİ: ${bmi} (${getBMICategory(bmi)})`;
}

function getBMICategory(bmi) {
    if(bmi < 18.5) return "Zayıf";
    if(bmi < 25) return "Normal";
    if(bmi < 30) return "Fazla Kilolu";
    return "Obez";
}

function addFood() {
    const name = document.getElementById("food-name").value;
    const cal = document.getElementById("food-cal").value;
    
    if(!name || !cal) {
        alert("Lütfen yemek adını ve kalorisini yazın.");
        return;
    }

    const emptyMsg = document.getElementById("empty-food");
    if(emptyMsg) emptyMsg.style.display = "none";

    const item = `<div class="flex justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm mb-2">
                    <span class="text-gray-700 font-medium">${name}</span>
                    <span class="font-bold text-green-500">+${cal} kcal</span>
                  </div>`;
    
    document.getElementById("food-list").insertAdjacentHTML('afterbegin', item);
    document.getElementById("food-name").value = "";
    document.getElementById("food-cal").value = "";
}

function generateAIAdvice() {
    const res = document.getElementById("ai-chat-result");
    res.classList.remove("hidden");
    res.innerHTML = "<span class='text-gray-500 italic'><i class='fa-solid fa-spinner fa-spin'></i> Vücut indeksin ve hedeflerin analiz ediliyor...</span>";
    
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    const bmi = (weight / ((height/100)**2)).toFixed(1);

    const advices = [
        `Mevcut VKİ değerin <strong>${bmi}</strong>. Bugün protein miktarını artırıp akşam 20 dakikalık tempolu bir yürüyüş yaparsan metabolizma hızın %5 artacaktır.`,
        `Şu anki vücut ağırlığın <strong>${weight} kg</strong>. Kas kütleni korumak için bugün kilogram başına 1.5 gram protein almayı unutma! 💪`,
        `Vücut analizine göre su tüketimin düşük kalmış olabilir. <strong>${weight} kg</strong> ağırlığındaki bir birey olarak bugün 3 litreyi tamamlamaya odaklan. 💧`,
        `Boyun <strong>${height} cm</strong> olduğu için duruş (postür) egzersizleri senin için çok önemli. Bugün 10 dakikalık sırt esneme hareketleri yapmalısın.`,
        `Mükemmel gidiyorsun! Bugün karbonhidratı sadece antrenman öncesi tüketerek yağ yakımını maksimize edebilirsin.`
    ];

    setTimeout(() => {
        const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
        res.innerHTML = "<strong><i class='fa-solid fa-bolt text-yellow-500'></i> AI Coach:</strong><br><br>" + randomAdvice;
    }, 1200);
}

function updateProfile() {
    const newName = document.getElementById("p-name").value;
    const newWeight = document.getElementById("p-weight").value;
    const newHeight = document.getElementById("p-height").value;

    if(!newName || !newWeight || !newHeight) {
        alert("Alanlar boş bırakılamaz!");
        return;
    }

    localStorage.setItem("userName", newName);
    localStorage.setItem("userWeight", newWeight);
    localStorage.setItem("userHeight", newHeight);
    
    alert("Profilin başarıyla güncellendi! AI Coach artık yeni verilerine göre tavsiye verecek.");
    loadDashboard();
    switchTab('home');
}

function logout() {
    location.reload();
}
