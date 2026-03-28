const API_URL = "https://flexifit-backend-thna.onrender.com";
let isLoginMode = true;
let myChart = null; 

// ==========================================
// 1. BAŞLANGIÇ AYARLARI VE PROFİL YÜKLEME
// ==========================================
window.onload = function() {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadHistory();
        loadProfileData(); // İnteraktif profil verilerini yükle
        setTimeout(renderWeeklyChart, 500); 
    }
};

// --- YENİ EKLENEN: PROFİL BİLGİLERİNİ HAFIZADA TUTMA ---
function loadProfileData() {
    const email = localStorage.getItem("userEmail") || "kullanici@mail.com";
    const username = localStorage.getItem("fs_username") || "Flexi_User";
    const target = localStorage.getItem("fs_target") || "75";
    const region = localStorage.getItem("fs_region") || "Türkiye";
    const lang = localStorage.getItem("fs_lang") || "Türkçe";
    
    // Ekrana bas
    if(document.getElementById("prof-email")) document.getElementById("prof-email").innerText = email;
    if(document.getElementById("prof-username")) document.getElementById("prof-username").innerText = username;
    if(document.getElementById("prof-target")) document.getElementById("prof-target").innerText = target + " kalori";
    if(document.getElementById("prof-region")) document.getElementById("prof-region").innerText = region;
    if(document.getElementById("prof-lang")) document.getElementById("prof-lang").innerText = lang;
    
    // Ana sayfadaki ismi de güncelle
    if(document.getElementById("home-name")) document.getElementById("home-name").innerText = username;
    if(document.getElementById("top-bar-name")) document.getElementById("top-bar-name").innerText = username;
}

// --- YENİ EKLENEN: AYARLARI DEĞİŞTİRME ---
window.editField = function(key, title) {
    const currentVal = localStorage.getItem("fs_" + key) || "";
    const newVal = prompt(`Yeni ${title} değerini girin:`, currentVal);
    
    if(newVal !== null && newVal.trim() !== "") {
        localStorage.setItem("fs_" + key, newVal.trim());
        loadProfileData(); // Değişikliği anında ekrana yansıt
        alert("Başarıyla güncellendi! ✅");
    }
}

// ==========================================
// 2. GİRİŞ VE KAYIT
// ==========================================
function toggleAuth() {
    isLoginMode = !isLoginMode;
    document.getElementById("form-title").innerText = isLoginMode ? "Sisteme Giriş Yap" : "Yeni Hesap Oluştur";
    document.getElementById("auth-btn").innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    const toggleLink = document.getElementById("toggle-link");
    if(toggleLink) toggleLink.innerText = isLoginMode ? "Hesabın yok mu? Yeni Hesap Oluştur" : "Zaten hesabın var mı? Giriş Yap";
    
    const registerFields = document.getElementById("register-fields");
    if(isLoginMode) registerFields.classList.add("hidden");
    else registerFields.classList.remove("hidden");
}

async function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullname = document.getElementById("fullname").value;
    
    if(!email || !password) {
        alert("Lütfen e-posta ve şifre girin!");
        return;
    }

    const btn = document.getElementById("auth-btn");
    btn.innerText = "İşleniyor...";

    const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
    const bodyData = isLoginMode ? { email, password } : { full_name: fullname, email, password, height: 180, weight: 80 };

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
                if(data.user?.full_name) localStorage.setItem("fs_username", data.user.full_name);
                
                document.getElementById("auth-section").classList.add("hidden");
                document.getElementById("dashboard-section").classList.remove("hidden");
                loadProfileData();
                loadHistory();
                setTimeout(renderWeeklyChart, 500);
            }
        } else alert("Hata: " + (data.error || "İşlem başarısız"));
    } catch (err) {
        alert("Sunucu hatası! Lütfen tekrar deneyin.");
    } finally {
        btn.innerText = isLoginMode ? "GİRİŞ YAP" : "KAYIT OL";
    }
}

function logout() {
    localStorage.removeItem("userEmail");
    location.reload(); 
}

// ==========================================
// 3. MENÜ (SEKME) GEÇİŞLERİ (Kesin Çözüm)
// ==========================================
function switchTab(tab) {
    const tabs = ['home', 'diet', 'reports', 'ai', 'profile'];
    
    // Önce hepsini KESİNLİKLE gizle
    tabs.forEach(t => {
        const section = document.getElementById(`tab-${t}`);
        const navBtn = document.getElementById(`nav-${t}`);
        if(section) section.classList.add('hidden');
        if(navBtn) {
            navBtn.classList.remove('tab-active', 'text-fsgreen');
            navBtn.classList.add('text-fsmuted');
        }
    });
    
    // Sadece tıklananı KESİNLİKLE göster
    const activeSection = document.getElementById(`tab-${tab}`);
    const activeBtn = document.getElementById(`nav-${tab}`);
    
    if(activeSection) activeSection.classList.remove('hidden');
    if(activeBtn) {
        activeBtn.classList.remove('text-fsmuted');
        activeBtn.classList.add('tab-active', 'text-fsgreen');
    }

    if(tab === 'home') setTimeout(renderWeeklyChart, 100);
}

// ==========================================
// 4. BESİN TAKİBİ, BARKOD VE SİLME
// ==========================================
const foodDatabase = {
    "elma": 95, "muz": 105, "tavuk": 165, "makarna": 220, 
    "pilav": 130, "yumurta": 78, "ekmek": 65, "pizza": 266, 
    "kebap": 350, "ayran": 40, "su": 0, "kahve": 2, "yulaf": 350
};

document.getElementById("food-name")?.addEventListener("input", function(e) {
    const input = e.target.value.toLowerCase().trim();
    const calInput = document.getElementById("food-cal");
    if (foodDatabase[input] !== undefined) {
        calInput.value = foodDatabase[input];
        calInput.classList.add("text-fsgreen"); 
    } else calInput.classList.remove("text-fsgreen");
});

async function scanBarcode() {
    const barcode = prompt("Lütfen ürün barkodunu girin\n(Örn: 8690504031200)");
    if (!barcode) return;
    try {
        const res = await fetch(`${API_URL}/api/barcode/${barcode}`);
        const data = await res.json();
        if (res.ok && !data.error) {
            document.getElementById("food-name").value = data.name;
            document.getElementById("food-cal").value = data.calories;
            alert(`✅ Ürün Bulundu: ${data.name}`);
        } else alert("❌ Ürün bulunamadı!");
    } catch (error) { alert("Bağlantı hatası."); }
}

async function addFood() {
    const name = document.getElementById("food-name").value;
    const cal = document.getElementById("food-cal").value;
    const email = localStorage.getItem("userEmail");

    if(!name || !cal) { alert("Lütfen yemek ve kalori girin!"); return; }

    try {
        const res = await fetch(`${API_URL}/api/consumption`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, name: name, calories: parseInt(cal), water_ml: 0 })
        });
        if(res.ok) {
            alert("Yemek eklendi! 🥗");
            document.getElementById("food-name").value = "";
            document.getElementById("food-cal").value = "";
            loadHistory(); 
        }
    } catch (error) { alert("Hata oluştu."); }
}

async function deleteFood(foodName) {
    const email = localStorage.getItem("userEmail");
    if(!confirm(`"${foodName}" kaydını silmek istediğinize emin misiniz?`)) return;

    try {
        const res = await fetch(`${API_URL}/api/delete-food`, {
            method: "DELETE", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, food_name: foodName })
        });
        if(res.ok) { loadHistory(); setTimeout(renderWeeklyChart, 200); } 
        else alert("Silinemedi.");
    } catch (error) { alert("Sunucuya ulaşılamadı."); }
}

// --- LİSTE VE SİMÜLASYON ---
async function loadHistory() {
    const email = localStorage.getItem("userEmail");
    const listEl = document.getElementById("food-list");
    if(!listEl || !email) return;

    try {
        const res = await fetch(`${API_URL}/api/history/${email}`);
        const data = await res.json();
        
        if(Array.isArray(data)) {
            listEl.innerHTML = ""; let totalCalories = 0;

            data.slice().reverse().forEach(item => {
                totalCalories += item.calories;
                listEl.innerHTML += `
                    <div class="bg-fscard p-4 rounded-2xl border border-gray-800 flex justify-between items-center mb-3 group">
                        <div class="flex items-center gap-3">
                            <div class="bg-[#1e293b] p-2 rounded-lg text-fsgreen"><i class="fa-solid fa-utensils"></i></div>
                            <div>
                                <p class="font-bold text-white">${item.name}</p>
                                <p class="text-[10px] text-fsmuted font-bold uppercase">${item.date ? item.date.split(' ')[1].substring(0,5) : 'Şimdi'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="font-black text-fsgreen">${item.calories} kcal</span>
                            <button onclick="deleteFood('${item.name}')" class="text-fsmuted hover:text-red-500 transition"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });

            const goal = parseInt(localStorage.getItem("fs_target") || "2000"); 
            const remaining = Math.max(goal - totalCalories, 0);

            if(document.getElementById("cal-consumed")) document.getElementById("cal-consumed").innerText = totalCalories;
            if(document.getElementById("cal-remaining")) document.getElementById("cal-remaining").innerText = remaining;
            if(document.getElementById("home-cal-summary")) document.getElementById("home-cal-summary").innerText = `${totalCalories} / ${goal} kcal`;

            const estimatedProteinG = Math.round((totalCalories * 0.20) / 4);
            const estimatedCarbG = Math.round((totalCalories * 0.50) / 4);
            const estimatedFatG = Math.round((totalCalories * 0.30) / 9);
            const totalMacros = estimatedProteinG + estimatedCarbG + estimatedFatG;
            
            if(totalCalories > 0) {
                document.getElementById("m-protein-p").innerText = Math.round((estimatedProteinG / totalMacros) * 100) + "%";
                document.getElementById("m-carb-p").innerText = Math.round((estimatedCarbG / totalMacros) * 100) + "%";
                document.getElementById("m-fat-p").innerText = Math.round((estimatedFatG / totalMacros) * 100) + "%";
            } else {
                document.getElementById("m-protein-p").innerText = "0%";
                document.getElementById("m-carb-p").innerText = "0%";
                document.getElementById("m-fat-p").innerText = "0%";
            }

            document.getElementById("r-carb-g").innerText = estimatedCarbG + "g";
            document.getElementById("r-protein-g").innerText = estimatedProteinG + "g";
            document.getElementById("r-fat-g").innerText = estimatedFatG + "g";

            document.getElementById("r-carb-bar").style.width = Math.min((estimatedCarbG / 250) * 100, 100) + "%";
            document.getElementById("r-protein-bar").style.width = Math.min((estimatedProteinG / 100) * 100, 100) + "%";
            document.getElementById("r-fat-bar").style.width = Math.min((estimatedFatG / 67) * 100, 100) + "%";
        }
    } catch (error) { console.log("Geçmiş hatası."); }
}

// ==========================================
// 5. AI ANTRENÖR
// ==========================================
async function generateAIAdvice() {
    const resEl = document.getElementById("ai-chat-result");
    resEl.classList.remove("hidden");
    resEl.innerHTML = "<div class='flex items-center gap-2 text-fsmuted'><i class='fa-solid fa-spinner fa-spin text-fsgreen'></i> <span>Yapay Zeka analiz yapıyor...</span></div>";
    
    try {
        const res = await fetch(`${API_URL}/api/recommendation/${new Date().getHours()}`);
        const data = await res.json();
        if(res.ok) resEl.innerHTML = `<strong><i class='fa-solid fa-robot text-fsgreen mr-2'></i> AI Antrenör (${data.meal}):</strong><br><br><span class="text-white">${data.suggestion}</span>`;
        else resEl.innerHTML = "Öneri alınamadı.";
    } catch (error) { resEl.innerHTML = "Sunucuya bağlanılamadı."; }
}

// ==========================================
// 6. ŞOV KISMI: GRAFİK VE PROFİL
// ==========================================
async function renderWeeklyChart() {
    const email = localStorage.getItem("userEmail");
    const ctx = document.getElementById('calorieChart');
    if(!ctx || !email) return;

    try {
        const res = await fetch(`${API_URL}/api/weekly-summary/${email}`);
        const data = await res.json(); 
        const dates = Object.keys(data).slice(-7); 
        const calories = Object.values(data).slice(-7);

        if (myChart) myChart.destroy(); 
        myChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: dates, datasets: [{ label: 'Günlük Alınan Kalori', data: calories, backgroundColor: '#24D164', borderRadius: 8 }] },
            options: { 
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#E2E8F0' } } },
                scales: { y: { ticks: { color: '#E2E8F0' }, grid: { color: '#1e293b' } }, x: { ticks: { color: '#E2E8F0' }, grid: { display: false } } }
            }
        });
    } catch (error) { console.log("Grafik hatası."); }
}

async function updateProfile() {
    const newWeight = document.getElementById("p-weight").value;
    if(!newWeight) { alert("Lütfen kilonuzu girin!"); return; }
    
    try {
        const res = await fetch(`${API_URL}/api/update-weight`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: localStorage.getItem("userEmail"), new_weight: parseFloat(newWeight) })
        });
        if(res.ok) alert("Kilonuz güncellendi! 💪");
        else alert("Güncelleme başarısız.");
    } catch (error) { alert("Sunucu hatası."); }
}
