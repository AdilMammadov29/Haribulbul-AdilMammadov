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
        toggleLink.innerText = "Hesabın yok mu? Yeni Hesap Oluştur";
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
        localStorage.setItem("userGoalWeight", weight - 5); // Hedefi otomatik ayarla
        localStorage.setItem("userActivity", "1.55"); // Varsayılan orta aktivite
        localStorage.setItem("consumedCalories", 0);
        localStorage.removeItem("foodListHTML");
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
    const goalWeight = localStorage.getItem("userGoalWeight") || (weight - 5);
    const activityLevel = parseFloat(localStorage.getItem("userActivity")) || 1.55;
    
    // Verileri ekrana bas
    document.getElementById("home-name").innerText = name.split(" ")[0]; // Sadece ilk isim
    document.getElementById("p-name").value = name;
    document.getElementById("p-weight").value = weight;
    document.getElementById("p-height").value = height;
    document.getElementById("p-goal").value = goalWeight;
    document.getElementById("p-activity").value = activityLevel;

    // GERÇEK MATEMATİK: Mifflin-St Jeor Formülü + Aktivite Çarpanı
    const bmr = (10 * weight) + (6.25 * height) - (5 * 25) + 5;
    const dailyGoal = Math.round(bmr * activityLevel); 
    localStorage.setItem("dailyGoal", dailyGoal);

    // VKİ Hesapla
    const bmi = (weight / ((height/100)**2)).toFixed(1);
    document.getElementById("home-bmi").innerText = bmi;

    // Yemek listesini yükle
    const savedList = localStorage.getItem("foodListHTML");
    const listContainer = document.getElementById("food-list");
    if(savedList) {
        listContainer.innerHTML = savedList;
    } else {
        listContainer.innerHTML = `<p id="empty-food" class="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mt-6">Bugün Kalori Alınmadı.</p>`;
    }

    updateCalorieUI();
}

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

    if(consumed > goal) {
        progressEl.classList.replace("from-green-400", "from-red-400");
        progressEl.classList.replace("to-green-500", "to-red-500");
        consumedEl.classList.replace("text-green-500", "text-red-500");
        remainingEl.innerText = `LİMİT AŞILDI: ${Math.abs(remaining)} kcal`;
        remainingEl.className = "text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg border border-red-600";
    } else {
        progressEl.classList.replace("from-red-400", "from-green-400");
        progressEl.classList.replace("to-red-500", "to-green-500");
        consumedEl.classList.replace("text-red-500", "text-green-500");
        remainingEl.innerText = `Kalan: ${remaining} kcal`;
        remainingEl.className = "text-xs font-bold text-gray-500 bg-gray-50 border px-3 py-1.5 rounded-lg";
    }

    const homeSummary = document.getElementById("home-cal-summary");
    if(homeSummary) homeSummary.innerText = `${consumed} / ${goal} kcal`;
}

function addFood(customName = null, customCal = null) {
    const name = customName || document.getElementById("food-name").value;
    const cal = customCal || document.getElementById("food-cal").value;
    
    if(!name || !cal) return alert("Yemek adı ve kalori girilmelidir!");

    let consumed = parseInt(localStorage.getItem("consumedCalories")) || 0;
    consumed += parseInt(cal);
    localStorage.setItem("consumedCalories", consumed);

    const emptyMsg = document.getElementById("empty-food");
    if(emptyMsg) emptyMsg.remove();

    const itemHTML = `<div class="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm transform transition hover:-translate-y-1 hover:shadow-md">
                    <span class="text-gray-800 font-bold flex items-center"><i class="fa-solid fa-utensils text-green-400 mr-3 text-lg"></i> ${name}</span>
                    <span class="font-black text-gray-800 text-lg">+${cal} <span class="text-xs text-gray-400 font-bold">kcal</span></span>
                  </div>`;
    
    document.getElementById("food-list").insertAdjacentHTML('afterbegin', itemHTML);
    localStorage.setItem("foodListHTML", document.getElementById("food-list").innerHTML);
    
    if(!customName) {
        document.getElementById("food-name").value = "";
        document.getElementById("food-cal").value = "";
    }
    updateCalorieUI();
}

// BARKOD OKUMA SİMÜLASYONU (VİDEO İÇİN ŞOV KISMI)
function scanBarcode() {
    const btn = document.getElementById("barcode-btn");
    const originalText = btn.innerHTML;
    
    // Taranıyor efekti
    btn.innerHTML = "<i class='fa-solid fa-camera scanner-line'></i> Taranıyor...";
    btn.classList.add("bg-green-600");
    btn.classList.remove("bg-gray-800");

    setTimeout(() => {
        // Gerçekçi Ürün Veritabanı (Mock)
        const products = [
            { name: "Züber Fıstık Ezmeli Bar", cal: 175 },
            { name: "Eti Lifalif Yulaf Ezmesi", cal: 350 },
            { name: "Pınar Protein Süt Kakaolu", cal: 250 },
            { name: "Torku Tam Yulaflı Bisküvi", cal: 420 },
            { name: "Fellas Yüksek Protein Bar", cal: 145 }
        ];
        
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        // Onay al ve ekle
        if(confirm(`📷 Barkod Başarıyla Okundu!\n\nÜrün: ${randomProduct.name}\nKalori: ${randomProduct.cal} kcal\n\nGünlük listene eklensin mi?`)) {
            addFood(randomProduct.name, randomProduct.cal);
        }

        // Butonu eski haline getir
        btn.innerHTML = originalText;
        btn.classList.remove("bg-green-600");
        btn.classList.add("bg-gray-800");
    }, 1500); // 1.5 saniyelik gerçekçi tarama süresi
}

function resetDay() {
    if(confirm("Bugünün tüm kalori kayıtlarını sıfırlamak istiyor musun?")) {
        localStorage.setItem("consumedCalories", 0);
        localStorage.removeItem("foodListHTML");
        document.getElementById("food-list").innerHTML = `<p id="empty-food" class="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mt-6">Bugün Kalori Alınmadı.</p>`;
        updateCalorieUI();
    }
}

function updateProfile() {
    const newName = document.getElementById("p-name").value;
    const newWeight = document.getElementById("p-weight").value;
    const newHeight = document.getElementById("p-height").value;
    const newGoal = document.getElementById("p-goal").value;
    const newActivity = document.getElementById("p-activity").value;

    if(!newName || !newWeight || !newHeight || !newGoal) return alert("Alanlar boş bırakılamaz!");

    localStorage.setItem("userName", newName);
    localStorage.setItem("userWeight", newWeight);
    localStorage.setItem("userHeight", newHeight);
    localStorage.setItem("userGoalWeight", newGoal);
    localStorage.setItem("userActivity", newActivity);
    
    alert("Profil ve hedefler başarıyla güncellendi! Günlük kalori ihtiyacın aktivite seviyene göre yeniden hesaplandı.");
    loadDashboard();
    switchTab('diet'); // Değişikliği görmesi için diyet sekmesine at
}

function generateAIAdvice() {
    const res = document.getElementById("ai-chat-result");
    res.classList.remove("hidden");
    res.innerHTML = "<span class='text-gray-500 italic font-bold'><i class='fa-solid fa-spinner fa-spin mr-2'></i> Verilerin işleniyor...</span>";
    
    const goal = parseInt(localStorage.getItem("dailyGoal")) || 2000;
    const consumed = parseInt(localStorage.getItem("consumedCalories")) || 0;
    const remaining = goal - consumed;
    const weight = localStorage.getItem("userWeight");
    const targetWeight = localStorage.getItem("userGoalWeight");

    let dynamicAdvice = "";
    if (consumed === 0) {
        dynamicAdvice = `Güne henüz başlamamışsın. ${targetWeight} kg hedefine ulaşman için bugün kalori bütçen tam ${goal} kcal. Sağlıklı bir kahvaltıyla start verelim! 🍳`;
    } else if (remaining > 500) {
        dynamicAdvice = `Şu ana kadar ${consumed} kcal aldın. Geriye ${remaining} kcal hakkın var. Akşam yemeğinde ızgara tavuk ve mevsim salata mükemmel bir tercih olur. 🥗`;
    } else if (remaining > 0) {
        dynamicAdvice = `Dikkatli ol, günlük sınırına çok yaklaştın! Sadece ${remaining} kcal hakkın kaldı. Eğer çok acıkırsan şekersiz yeşil çay ve 5-6 adet çiğ badem tüketebilirsin. 🍵`;
    } else {
        dynamicAdvice = `Günlük ${goal} kcal hedefini ${Math.abs(remaining)} kcal aştın. Moral bozmak yok! ${targetWeight} kg hedefini korumak için yarın antrenman süreni 15-20 dakika uzatarak bunu kolayca dengeleyebiliriz. 🏃‍♂️💪`;
    }

    setTimeout(() => {
        res.innerHTML = "<strong><i class='fa-solid fa-bolt text-yellow-500 mr-2 text-xl'></i> AI Coach Analizi:</strong><br><br><span class='text-sm text-gray-700 leading-relaxed font-medium'>" + dynamicAdvice + "</span>";
    }, 1500);
}

function logout() {
    location.reload();
}
