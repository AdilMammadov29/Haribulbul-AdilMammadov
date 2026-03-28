const API_URL = "https://flexifit-backend-thna.onrender.com";
let isLoginMode = true;
let myChart = null; 

// ==========================================
// 1. BAŞLANGIÇ AYARLARI 
// ==========================================
window.onload = function() {
    // Tema artık sabit koyu olduğu için dark mode kontrolünü sildik, direkt yüklemeye geçiyoruz.
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        loadHistory();
        setTimeout(renderWeeklyChart, 500); 
    }
};

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
                loadHistory();
                setTimeout(renderWeeklyChart, 500);
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

function logout() {
    localStorage.removeItem("userEmail");
    location.reload(); 
}

// ==========================================
// 3. MENÜ (SEKME) GEÇİŞLERİ
// ==========================================
function switchTab(tab) {
    const tabs = ['home', 'diet', 'ai', 'profile'];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).classList.remove('tab-active');
        
        // Fatsecret alt barı için ikonların rengini yönetelim
        const btn = document.getElementById(`nav-${t}`);
        if(btn) btn.classList.remove('text-fsgreen');
    });
    
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`nav-${tab}`);
    if(activeBtn) {
        activeBtn.classList.add('tab-active');
        activeBtn.classList.add('text-fsgreen');
    }

    if(tab === 'home') setTimeout(renderWeeklyChart, 100);
}

// ==========================================
// 4. BESİN TAKİBİ, BARKOD VE SİLME İŞLEMİ
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
    } else {
        calInput.classList.remove("text-fsgreen");
    }
});

async function scanBarcode() {
    const barcode = prompt("Lütfen ürün barkodunu girin\n(Örn: 8690504031200 - Yulaf Ezmesi için)");
    if (!barcode) return;

    try {
        const res = await fetch(`${API_URL}/api/barcode/${barcode}`);
        const data = await res.json();
        
        if (res.ok && !data.error) {
            document.getElementById("food-name").value = data.name;
            document.getElementById("food-cal").value = data.calories;
            alert(`✅ Ürün Bulundu: ${data.name}\n${data.calories} kcal eklendi.`);
        } else {
            alert("❌ Ürün veritabanında bulunamadı! Lütfen manuel girin.");
        }
    } catch (error) {
        alert("Bağlantı hatası: Barkod servisine ulaşılamadı.");
    }
}

async function addFood() {
    const name = document.getElementById("food-name").value;
    const cal = document.getElementById("food-cal").value;
    const email = localStorage.getItem("userEmail");

    if(!name || !cal) {
        alert("Lütfen yemek adını ve kalorisini girin!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/consumption`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, name: name, calories: parseInt(cal), water_ml: 0 })
        });

        if(res.ok) {
            alert("Yemek başarıyla eklendi! 🥗");
            document.getElementById("food-name").value = "";
            document.getElementById("food-cal").value = "";
            loadHistory(); 
        }
    } catch (error) {
        alert("Yemek eklenirken bir hata oluştu.");
    }
}

// --- YENİ EKLENEN SİLME FONKSİYONU ---
async function deleteFood(foodName) {
    const email = localStorage.getItem("userEmail");
    if(!email) return;

    if(!confirm(`"${foodName}" kaydını silmek istediğinize emin misiniz?`)) return;

    try {
        const res = await fetch(`${API_URL}/api/delete-food`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, food_name: foodName })
        });

        if(res.ok) {
            loadHistory(); 
            setTimeout(renderWeeklyChart, 200);
        } else {
            alert("Silme işlemi başarısız oldu.");
        }
    } catch (error) {
        alert("Bağlantı hatası: Sunucuya ulaşılamadı.");
    }
}

// --- LİSTE, ÇÖP KUTUSU VE BAR GÜNCELLEME (FATSECRET TEMASI) ---
async function loadHistory() {
    const email = localStorage.getItem("userEmail");
    const listEl = document.getElementById("food-list");
    if(!listEl || !email) return;

    try {
        const res = await fetch(`${API_URL}/api/history/${email}`);
        const data = await res.json();
        
        if(Array.isArray(data)) {
            listEl.innerHTML = ""; 
            let totalCalories = 0;

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
                            <button onclick="deleteFood('${item.name}')" class="text-fsmuted hover:text-red-500 transition" title="Bu öğünü sil">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            const goal = 2000; 
            const percent = Math.min((totalCalories / goal) * 100, 100);
            const remaining = Math.max(goal - totalCalories, 0);

            // Dashboard Değerlerini Güncelle
            if(document.getElementById("cal-consumed")) document.getElementById("cal-consumed").innerText = totalCalories;
            if(document.getElementById("cal-remaining")) document.getElementById("cal-remaining").innerText = remaining;
            if(document.getElementById("cal-progress")) document.getElementById("cal-progress").style.width = percent + "%";
            if(document.getElementById("home-cal-summary")) document.getElementById("home-cal-summary").innerText = `${totalCalories} / ${goal} kcal`;
        }
    } catch (error) {
        console.log("Geçmiş yüklenirken hata oluştu.");
    }
}

// ==========================================
// 5. AI ANTRENÖR
// ==========================================
async function generateAIAdvice() {
    const resEl = document.getElementById("ai-chat-result");
    resEl.classList.remove("hidden");
    resEl.innerHTML = "<div class='flex items-center gap-2 text-fsmuted'><i class='fa-solid fa-spinner fa-spin text-fsgreen'></i> <span>Yapay Zeka analiz yapıyor...</span></div>";
    
    const hour = new Date().getHours();
    
    try {
        const res = await fetch(`${API_URL}/api/recommendation/${hour}`);
        const data = await res.json();
        
        if(res.ok) {
            resEl.innerHTML = `<strong><i class='fa-solid fa-robot text-fsgreen mr-2'></i> AI Antrenör (${data.meal}):</strong><br><br><span class="text-white">${data.suggestion}</span>`;
        } else {
            resEl.innerHTML = "Öneri alınamadı.";
        }
    } catch (error) {
        resEl.innerHTML = "Sunucuya bağlanılamadı. Lütfen backend linkine tıklayıp uyandırın!";
    }
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

        // FatSecret Teması Renkleri
        const textColor = '#E2E8F0'; // Açık Gri
        const gridColor = '#1e293b'; // Koyu Çizgiler

        if (myChart) myChart.destroy(); 

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Günlük Alınan Kalori',
                    data: calories,
                    backgroundColor: '#24D164', // FatSecret Yeşili
                    borderRadius: 8
                }]
            },
            options: { 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    y: { ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { display: false } }
                }
            }
        });
    } catch (error) {
        console.log("Grafik verisi çekilemedi.");
    }
}

async function updateProfile() {
    const email = localStorage.getItem("userEmail");
    const newWeight = document.getElementById("p-weight").value;
    
    if(!newWeight) {
        alert("Lütfen kilonuzu girin!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/update-weight`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, new_weight: parseFloat(newWeight) })
        });

        if(res.ok) {
            alert("Harika! Profil bilgilerin (Kilo) başarıyla güncellendi. 💪");
        } else {
            alert("Güncelleme başarısız oldu.");
        }
    } catch (error) {
        alert("Sunucuya bağlanılamadı.");
    }
}
