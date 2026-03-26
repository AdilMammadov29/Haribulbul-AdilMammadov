let isLoginMode = true;

function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("form-title").innerText = isLoginMode ? "Sisteme Giriş Yap" : "Yeni Hesap Oluştur";
    document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    const registerFields = document.getElementById("register-fields");
    isLoginMode ? registerFields.classList.add("hidden") : registerFields.classList.remove("hidden");
}

function handleAuth() {
    const email = document.getElementById("email").value;
    if(!email) return alert("E-posta girin!");
    
    if(!isLoginMode) {
        localStorage.setItem("userName", document.getElementById("fullname").value);
        localStorage.setItem("userHeight", document.getElementById("height").value);
        localStorage.setItem("userWeight", document.getElementById("weight").value);
        alert("Kayıt Başarılı!");
        toggleAuth();
    } else {
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadDashboard();
    }
}

function switchTab(tab) {
    ["home", "diet", "profile", "ai"].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add("hidden");
        document.getElementById(`nav-${t}`).classList.remove("tab-active", "text-gray-400");
        document.getElementById(`nav-${t}`).classList.add("text-gray-400");
    });
    document.getElementById(`tab-${tab}`).classList.remove("hidden");
    document.getElementById(`nav-${tab}`).classList.add("tab-active");
    document.getElementById(`nav-${tab}`).classList.remove("text-gray-400");
}

function loadDashboard() {
    const name = localStorage.getItem("userName") || "Kullanıcı";
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    
    document.getElementById("home-name").innerText = name;
    document.getElementById("p-name").value = name;
    document.getElementById("p-weight").value = weight;
    document.getElementById("p-height").value = height;

    const bmi = (weight / ((height/100)**2)).toFixed(1);
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
    if(!name || !cal) return;
    const item = `<div class="flex justify-between p-3 bg-white border rounded-lg text-sm shadow-sm">
                    <span>${name}</span><span class="font-bold text-green-600">${cal} kcal</span>
                  </div>`;
    document.getElementById("food-list").insertAdjacentHTML('afterbegin', item);
    document.getElementById("food-name").value = "";
    document.getElementById("food-cal").value = "";
}

function generateAIAdvice() {
    const res = document.getElementById("ai-chat-result");
    res.classList.remove("hidden");
    res.innerHTML = "Analiz ediliyor... 🤖";
    
    const weight = localStorage.getItem("userWeight");
    const bmi = (weight / ((localStorage.getItem("userHeight")/100)**2)).toFixed(1);

    const advices = [
        `VKİ değerin ${bmi}. Bugün protein ağırlıklı beslenip akşam yürüyüşünü 15 dakika uzatırsan metabolizman %5 hızlanır.`,
        `Kilon ${weight} kg. Kas kütleni korumak için bugün kg başına 1.5g protein almayı unutma.`,
        `Gözlemlerime göre su tüketimin düşük kalmış. ${weight} kg bir vücut için bugün 3 litreyi tamamlamalıyız!`,
        `Haftalık hedefine çok yaklaştın. Bugün karbonhidratı sadece antrenman öncesi tüketmelisin.`
    ];

    setTimeout(() => {
        res.innerHTML = "<strong>AI Tavsiyesi:</strong> " + advices[Math.floor(Math.random() * advices.length)];
    }, 1000);
}

function updateProfile() {
    localStorage.setItem("userName", document.getElementById("p-name").value);
    localStorage.setItem("userWeight", document.getElementById("p-weight").value);
    localStorage.setItem("userHeight", document.getElementById("p-height").value);
    alert("Profil Güncellendi!");
    loadDashboard();
    switchTab('home');
}

function logout() {
    location.reload();
}
