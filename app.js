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
    if(!email || !password) return alert("Lütfen e-posta ve şifrenizi girin!");

    if(!isLoginMode) {
        const name = document.getElementById("fullname").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;
        if(!name || !height || !weight) return alert("Ad, boy ve kilo zorunludur!");

        localStorage.setItem("userName", name);
        localStorage.setItem("userHeight", height);
        localStorage.setItem("userWeight", weight);
        // Yeni kayıtta kaloriyi sıfırla
        localStorage.setItem("consumedCalories", 0);
        localStorage.removeItem("foodListHTML");
        
        alert("Kayıt Başarılı! Sisteme giriliyor...");
    }
    
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    loadDashboard();
}

function switchTab(tab) {
    ["home", "diet", "profile", "ai"].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add("hidden");
        const navBtn = document.getElementById(`nav-${t}`);
        navBtn.classList.remove("tab-active", "text-green-600");
        navBtn.classList.add("text-gray-400");
    });
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
    const activeNav = document.getElementById(`nav-${tab}`);
    activeNav.classList.add("tab-active", "text-green-600");
    activeNav.classList.remove("text-gray-400");
}

function loadDashboard() {
    const name = localStorage.getItem("userName") || "Sporcu";
    const weight = parseFloat(localStorage.getItem("userWeight")) || 80;
    const height = parseFloat(localStorage.getItem("userHeight")) || 180;
    
    document.getElementById("home-name").innerText = name;
    document.getElementById("p-name").value = name;
    document.getElementById("p-weight").value = weight;
    document.getElementById("p-height").value = height;

    // GERÇEK MATEMATİK: Mifflin-St Jeor Formülü (Erkek/Varsayılan bazlı BMR)
    const bmr = (10 * weight) + (6.25 * height) - (5 * 25) + 5;
    const dailyGoal = Math.round(bmr * 1.3); // Hafif aktif çarpanı
    localStorage.setItem("dailyGoal", dailyGoal);

    // VKİ Hesapla
    const bmi = (weight / ((height/100)**2)).toFixed(1);
    document.getElementById("home-bmi").innerText = bmi;

    // Yemek listesini hafızadan çek
    const savedList = localStorage.getItem("foodListHTML");
    const listContainer = document.getElementById("food-list");
    if(savedList) {
        listContainer.innerHTML = savedList;
    } else {
        listContainer.innerHTML = `<p id="empty-food" class="text-sm text-gray-400 italic text-center mt-4">Henüz bir kalori girişi yapmadın.</p>`;
    }

    updateCalorieUI();
}

// KALORİ ARAYÜZÜNÜ CANLI GÜNCELLEME
function updateCalorieUI() {
    const goal = parseInt(localStorage.getItem("dailyGoal")) || 2000;
    const consumed = parseInt(localStorage.getItem("consumedCalories")) || 0;
    const remaining = goal - consumed;
    const percent = Math.min((consumed / goal) * 100, 100);

    document.getElementById("cal-goal").innerText = goal;
    document.getElementById("cal-consumed").innerText = consumed;
    document.getElementById("cal-progress").style.width = percent + "%";
    
    const progressEl = document.getElementById("cal-progress");
    const consumedEl = document.getElementById("cal-consumed");
    const remainingEl = document.getElementById("cal-remaining");

    // Hedef aşılırsa kırmızı uyarı sistemi
    if(consumed > goal) {
        progressEl.classList.replace("bg-green-500", "bg-red-500");
        consumedEl.classList.replace("text-green-500", "text-red-500");
        remainingEl.innerText = `AŞILAN: ${Math.abs(remaining)} kcal`;
        remainingEl.className = "text-xs font-bold text-white bg-red-500 px-2 py-1 rounded";
    } else {
        progressEl.classList.replace("bg-red-500", "bg-green-500");
        consumedEl.classList.replace("text-red-500", "text-green-500");
        remainingEl.innerText = `Kalan: ${remaining} kcal`;
        remainingEl.className = "text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded";
    }

    // Ana sayfa barını da güncelle
    const homeSummary = document.getElementById("home-cal-summary");
    if(homeSummary) homeSummary.innerText = `${consumed} / ${goal} kcal`;
}

// YEMEK EKLEME VE HAFIZAYA YAZMA
function addFood() {
    const name = document.getElementById("food-name").value;
    const cal = document.getElementById("food-cal").value;
    if(!name || !cal) return alert("Yemek adı ve kalori girilmelidir!");

    // Kaloriyi artır
    let consumed = parseInt(localStorage.getItem("consumedCalories")) || 0;
    consumed += parseInt(cal);
    localStorage.setItem("consumedCalories", consumed);

    // Listeye ekle
    const emptyMsg = document.getElementById("empty-food");
    if(emptyMsg) emptyMsg.remove();

    const itemHTML = `<div class="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm transform transition hover:-translate-y-1 hover:shadow-md">
                    <span class="text-gray-800 font-bold"><i class="fa-solid fa-utensils text-green-400 mr-2"></i> ${name}</span>
                    <span class="font-black text-gray-800 text-lg">+${cal} <span class="text-xs text-gray-400 font-normal">kcal</span></span>
                  </div>`;
    
    document.getElementById("food-list").insertAdjacentHTML('afterbegin', itemHTML);
    
    // Listeyi hafızaya kaydet
    localStorage.setItem("foodListHTML", document.getElementById("food-list").innerHTML);
    
    document.getElementById("food-name").value = "";
    document.getElementById("food-cal").value = "";
    
    updateCalorieUI();
}

function resetDay() {
    if(confirm("Bugünün tüm kalori kayıtlarını sıfırlamak istiyor musun?")) {
        localStorage.setItem("consumedCalories", 0);
        localStorage.removeItem("foodListHTML");
        document.getElementById("food-list").innerHTML = `<p id="empty-food" class="text-sm text-gray-400 italic text-center mt-4">Henüz bir kalori girişi yapmadın.</p>`;
        updateCalorieUI();
    }
}

function updateProfile() {
    const newName = document.getElementById("p-name").value;
    const newWeight = document.getElementById("p-weight").value;
    const newHeight = document.getElementById("p-height").value;
    if(!newName || !newWeight || !newHeight) return alert("Alanlar boş bırakılamaz!");

    localStorage.setItem("userName", newName);
    localStorage.setItem("userWeight", newWeight);
    localStorage.setItem("userHeight", newHeight);
    
    alert("Profil güncellendi! Günlük kalori hedefin yeni kilona göre yeniden hesaplandı.");
    loadDashboard();
    switchTab('diet');
}

function generateAIAdvice() {
    const res = document.getElementById("ai-chat-result");
    res.classList.remove("hidden");
    res.innerHTML = "<span class='text-gray-500 italic'><i class='fa-solid fa-spinner fa-spin mr-2'></i> Anlık verilerin işleniyor...</span>";
    
    const goal = parseInt(localStorage.getItem("dailyGoal")) || 2000;
    const consumed = parseInt(localStorage.getItem("consumedCalories")) || 0;
    const remaining = goal - consumed;

    let dynamicAdvice = "";
    if (consumed === 0) {
        dynamicAdvice = `Güne henüz başlamamışsın. Bugün hedefin ${goal} kalori. Güne protein ağırlıklı bir kahvaltıyla başlamalısın! 🍳`;
    } else if (remaining > 500) {
        dynamicAdvice = `Şu ana kadar ${consumed} kalori aldın. Geriye ${remaining} kalori hakkın var. Akşam yemeğinde ızgara tavuk ve salata mükemmel bir tercih olur. 🥗`;
    } else if (remaining > 0) {
        dynamicAdvice = `Dikkatli ol, günlük hedefine çok yaklaştın! Sadece ${remaining} kalori hakkın kaldı. Eğer acıkırsan şekersiz yeşil çay ve çiğ badem tüketebilirsin. 🍵`;
    } else {
        dynamicAdvice = `Günlük ${goal} kalorilik hedefini ${Math.abs(remaining)} kalori aştın. Moral bozmak yok, yarın antrenman süreni 15 dakika uzatarak bunu dengeleyebiliriz! 🏃‍♂️`;
    }

    setTimeout(() => {
        res.innerHTML = "<strong><i class='fa-solid fa-bolt text-yellow-500 mr-1'></i> AI Coach Analizi:</strong><br><br><span class='text-sm text-gray-700 leading-relaxed'>" + dynamicAdvice + "</span>";
    }, 1500);
}

function logout() {
    location.reload();
}
