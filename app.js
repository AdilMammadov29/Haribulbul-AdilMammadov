let isLoginMode = true;
const API_URL = "https://flexifit-backend-thna.onrender.com";
let currentUserEmail = localStorage.getItem("userEmail") || "";

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

// KAYIT OL VE GİRİŞ YAP (POST)
async function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(!email || !password) return alert("Lütfen e-posta ve şifrenizi girin!");

    const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
    let bodyData = { email: email, password: password };

    if(!isLoginMode) {
        const name = document.getElementById("fullname").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;
        if(!name || !height || !weight) return alert("Ad, boy ve kilo zorunludur!");
        
        bodyData = { full_name: name, email: email, password: password, height: parseInt(height), weight: parseInt(weight) };
    }

    const btn = document.getElementById("auth-btn");
    const originalText = btn.innerText;
    btn.innerText = "Bağlanıyor... ⏳";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (response.ok) {
            currentUserEmail = email;
            localStorage.setItem("userEmail", email);
            document.getElementById("auth-section").classList.add("hidden");
            document.getElementById("dashboard-section").classList.remove("hidden");
            loadDashboard();
        } else {
            alert("Hata: " + (data.error || data.message || "İşlem başarısız."));
        }
    } catch (error) {
        alert("Sunucuya bağlanılamadı.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// ÖZELLİKLERİ VE GEÇMİŞİ GÖRÜNTÜLE (GET)
async function loadDashboard() {
    if(!currentUserEmail) return logout();

    try {
        const profileRes = await fetch(`${API_URL}/api/profile/${currentUserEmail}`);
        if (profileRes.ok) {
            const profileData = await profileRes.json();
            document.getElementById("home-name").innerText = profileData.full_name ? profileData.full_name.split(" ")[0] : "Sporcu";
            if(document.getElementById("p-name")) document.getElementById("p-name").value = profileData.full_name || "";
            if(document.getElementById("p-weight")) document.getElementById("p-weight").value = profileData.current_weight || profileData.weight || 80;
            if(document.getElementById("p-height")) document.getElementById("p-height").value = profileData.height || 180;
        }

        const historyRes = await fetch(`${API_URL}/api/history/${currentUserEmail}`);
        if (historyRes.ok) {
            const historyData = await historyRes.json();
            renderFoodList(historyData);
        }
    } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
    }
}

// GEÇMİŞİ LİSTELE VE SİLME BUTONU EKLE (GET & DELETE HAZIRLIĞI)
function renderFoodList(historyArray) {
    const listContainer = document.getElementById("food-list");
    if(!historyArray || historyArray.length === 0) {
        listContainer.innerHTML = `<p class="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mt-6">Henüz kayıt yok.</p>`;
        document.getElementById("cal-consumed").innerText = "0";
        updateCalorieUI(0);
        return;
    }
    
    listContainer.innerHTML = "";
    let totalCals = 0;
    
    historyArray.reverse().forEach(item => {
        totalCals += parseInt(item.calories);
        const div = document.createElement("div");
        div.className = "flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mb-2";
        div.innerHTML = `
            <span class="text-gray-800 font-bold flex items-center"><i class="fa-solid fa-utensils text-green-400 mr-3 text-lg"></i> ${item.name}</span>
            <div class="flex items-center gap-4">
                <span class="font-black text-gray-800 text-lg">+${item.calories} <span class="text-xs text-gray-400 font-bold">kcal</span></span>
                <button onclick="deleteFood('${item.name}')" class="text-red-500 hover:text-red-700 font-bold text-xl" title="Kaydı Sil">×</button>
            </div>
        `;
        listContainer.appendChild(div);
    });
    
    document.getElementById("cal-consumed").innerText = totalCals;
    updateCalorieUI(totalCals);
}

function updateCalorieUI(consumed) {
    const goal = 2500; // Varsayılan hedef
    const remaining = goal - consumed;
    const percent = Math.min((consumed / goal) * 100, 100);
    
    if(document.getElementById("cal-goal")) document.getElementById("cal-goal").innerText = goal;
    if(document.getElementById("cal-progress")) document.getElementById("cal-progress").style.width = percent + "%";
    
    const remainingEl = document.getElementById("cal-remaining");
    if(remainingEl) {
        if(consumed > goal) {
            remainingEl.innerText = `LİMİT AŞILDI: ${Math.abs(remaining)} kcal`;
            remainingEl.className = "text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg border border-red-600";
        } else {
            remainingEl.innerText = `Kalan: ${remaining} kcal`;
            remainingEl.className = "text-xs font-bold text-gray-500 bg-gray-50 border px-3 py-1.5 rounded-lg";
        }
    }
}

// TÜKETİM EKLE (POST)
async function addFood(customName = null, customCal = null) {
    const name = customName || document.getElementById("food-name").value;
    const cal = customCal || document.getElementById("food-cal").value;
    if(!name || !cal) return alert("Yemek adı ve kalori girilmelidir!");

    try {
        await fetch(`${API_URL}/api/consumption`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUserEmail, name: name, calories: parseInt(cal) })
        });
        if(!customName) {
            document.getElementById("food-name").value = "";
            document.getElementById("food-cal").value = "";
        }
        loadDashboard(); // Listeyi buluttan yenile
    } catch (error) {
        console.error(error);
    }
}

// KAYDI SİL (DELETE)
async function deleteFood(foodName) {
    if(confirm(`"${foodName}" kaydını silmek istediğine emin misin?`)) {
        try {
            await fetch(`${API_URL}/api/delete-food`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: currentUserEmail, food_name: foodName })
            });
            loadDashboard(); // Listeyi buluttan yenile
        } catch (error) { console.error(error); }
    }
}

// HESABI SİL (DELETE) - Profil sekmesine buton eklersen çalışır
async function deleteAccount() {
    if(confirm("Tüm verilerini ve hesabını kalıcı olarak silmek istiyor musun?")) {
        try {
            await fetch(`${API_URL}/api/delete-account`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: currentUserEmail })
            });
            logout();
        } catch (error) { console.error(error); }
    }
}

// KİLO VE AKTİVİTE GÜNCELLE (UPDATE / PUT)
async function updateProfile() {
    const newWeight = document.getElementById("p-weight").value;
    const newActivity = document.getElementById("p-activity") ? document.getElementById("p-activity").value : 1.55;

    try {
        await fetch(`${API_URL}/api/update-weight`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUserEmail, new_weight: parseFloat(newWeight) })
        });
        await fetch(`${API_URL}/api/update-activity`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUserEmail, new_activity: parseFloat(newActivity) })
        });
        alert("Profil bilgileri başarıyla güncellendi!");
        loadDashboard();
        switchTab('diet');
    } catch (error) { console.error(error); }
}

// BARKOD TARA (GET)
async function scanBarcode() {
    const btn = document.getElementById("barcode-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = "<i class='fa-solid fa-camera scanner-line'></i> Taranıyor...";
    
    // Rastgele bir barkod seçip API'ye soralım
    const mockBarcodes = ["8690504031200", "8690624200115", "HATA"];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];

    setTimeout(async () => {
        try {
            const res = await fetch(`${API_URL}/api/barcode/${randomBarcode}`);
            const data = await res.json();
            
            if(data.error) {
                alert("Barkod sistemde bulunamadı!");
            } else {
                if(confirm(`📷 Ürün: ${data.name}\nKalori: ${data.calories} kcal\n\nGünlük listene eklensin mi?`)) {
                    addFood(data.name, data.calories);
                }
            }
        } catch(e) { console.error(e); }
        btn.innerHTML = originalText;
    }, 1500);
}

// ÖĞÜN ÖNERİSİ AL (GET) - Saate göre yapay zeka
async function generateAIAdvice() {
    const resEl = document.getElementById("ai-chat-result");
    resEl.classList.remove("hidden");
    resEl.innerHTML = "<span class='text-gray-500 italic font-bold'><i class='fa-solid fa-spinner fa-spin mr-2'></i> API'den öneri alınıyor...</span>";
    
    const currentHour = new Date().getHours();
    
    try {
        const res = await fetch(`${API_URL}/api/recommendation/${currentHour}`);
        const data = await res.json();
        
        setTimeout(() => {
            resEl.innerHTML = `<strong><i class='fa-solid fa-robot text-purple-500 mr-2 text-xl'></i> AI Önerisi (${data.meal}):</strong><br><br><span class='text-sm text-gray-700'>${data.suggestion}</span>`;
        }, 1000);
    } catch (error) {
        resEl.innerHTML = "Öneri alınamadı.";
    }
}

function switchTab(tab) {
    ["home", "diet", "profile", "ai"].forEach(t => {
        if(document.getElementById(`tab-${t}`)) document.getElementById(`tab-${t}`).classList.add("hidden");
        const navBtn = document.getElementById(`nav-${t}`);
        if(navBtn) {
            navBtn.classList.remove("tab-active", "text-green-600");
            navBtn.classList.add("text-gray-400");
        }
    });
    if(document.getElementById(`tab-${tab}`)) document.getElementById(`tab-${tab}`).classList.remove("hidden");
    const activeNav = document.getElementById(`nav-${tab}`);
    if(activeNav) {
        activeNav.classList.add("tab-active", "text-green-600");
        activeNav.classList.remove("text-gray-400");
    }
}

function logout() {
    localStorage.removeItem("userEmail");
    location.reload();
}
