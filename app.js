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
        
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadDashboard();
    } else {
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
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    
    document.getElementById("home-name").innerText = name;
    document.getElementById("p-name").value = name;
    document.getElementById("p-weight").value = weight;
    document.getElementById("p-height").value = height;

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let cat = "";
    if(bmi < 18.5) cat = "Zayıf";
    else if(bmi < 25) cat = "Normal";
    else if(bmi < 30) cat = "Fazla Kilolu";
    else cat = "Obez";

    document.getElementById("home-bmi").innerText = `VKİ: ${bmi} (${cat})`;
}

function addFood() {
    const name = document.getElementById("food-name").value;
    const cal = document.getElementById("food-cal").value;
    
    if(!name || !cal) {
        alert("Yemek adı ve kalori girilmelidir!");
        return;
    }

    const emptyMsg = document.getElementById("empty-food");
    if(emptyMsg) emptyMsg.style.display = "none";

    const item = `<div class="flex justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm mb-2 transform transition hover:scale-[1.02]">
                    <span class="text-gray-700 font-medium"><i class="fa-solid fa-utensils text-gray-400 mr-2"></i> ${name}</span>
                    <span class="font-bold text-green-500">+${cal} kcal</span>
                  </div>`;
    
    document.getElementById("food-list").insertAdjacentHTML('afterbegin', item);
    document.getElementById("food-name").value = "";
    document.getElementById("food-cal").value = "";
}

function generateAIAdvice() {
    const res = document.getElementById("ai-chat-result");
    res.classList.remove("hidden");
    res.innerHTML = "<span class='text-gray-500 italic'><i class='fa-solid fa-spinner fa-spin mr-2'></i> Profilin analiz ediliyor...</span>";
    
    const weight = localStorage.getItem("userWeight") || 80;
    const height = localStorage.getItem("userHeight") || 180;
    const bmi = (weight / ((height/100)**2)).toFixed(1);

    const advices = [
        `Şu anki VKİ değerin <strong>${bmi}</strong>. Formunu korumak için bugün protein miktarını artırıp akşam 20 dakikalık tempolu bir yürüyüş yapmanı öneririm.`,
        `Vücut ağırlığın <strong>${weight} kg</strong>. Kas yıkımını önlemek için bugün kilogram başına en az 1.5 gram protein almalısın! 💪`,
        `Metabolizma hızını artırmak için su tüketimi şart. <strong>${weight} kg</strong> ağırlığındaki bir birey olarak bugün hedefin 3 litre su olmalı. 💧`,
        `Boyun <strong>${height} cm</strong> olduğu için omurga sağlığı (postür) egzersizleri senin için çok değerli. Bugün 10 dakikalık esneme hareketleri yapmalısın.`,
        `Harika bir ivme yakaladın! Bugün karbonhidratı sadece antrenman öncesi tüketerek vücudunun yağ yakım moduna geçmesini sağlayabilirsin.`
    ];

    setTimeout(() => {
        const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
        res.innerHTML = "<strong><i class='fa-solid fa-bolt text-yellow-500 mr-1'></i> AI Coach:</strong><br><br><span class='text-sm'>" + randomAdvice + "</span>";
    }, 1000);
}

function updateProfile() {
    const newName = document.getElementById("p-name").value;
    const newWeight = document.getElementById("p-weight").value;
    const newHeight = document.getElementById("p-height").value;

    if(!newName || !newWeight || !newHeight) {
        alert("Profil alanları boş bırakılamaz!");
        return;
    }

    localStorage.setItem("userName", newName);
    localStorage.setItem("userWeight", newWeight);
    localStorage.setItem("userHeight", newHeight);
    
    alert("Profil başarıyla güncellendi!");
    loadDashboard();
    switchTab('home');
}

function logout() {
    location.reload();
}
