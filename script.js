// --- DADOS E INICIALIZAÇÃO ---
let db = {
    exercises: [],
    workouts: [],
    history: []
};

window.onload = function() {
    loadData();
    renderAll();
};

function loadData() {
    let saved = localStorage.getItem('hyperGymDB');
    if(saved) {
        db = JSON.parse(saved);
    } else {
        // Dados de exemplo se for a primeira vez
        db.exercises = [
            {id: 1, name: "Supino Reto", group: "Peito"},
            {id: 2, name: "Agachamento", group: "Pernas"}
        ];
    }
}

function saveData() {
    localStorage.setItem('hyperGymDB', JSON.stringify(db));
}

// --- NAVEGAÇÃO ---
function switchTab(tabId) {
    // Esconde todas as seções
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    // Mostra a selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Atualiza botões
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Lógica simples para ativar o ícone correto
    if(tabId.includes('workouts')) document.querySelectorAll('.nav-btn')[0].classList.add('active');
    if(tabId.includes('exercises')) document.querySelectorAll('.nav-btn')[1].classList.add('active');
    if(tabId.includes('history')) document.querySelectorAll('.nav-btn')[2].classList.add('active');

    // FAB Button logic: Só aparece em treinos e exercícios
    const fab = document.getElementById('fab');
    if(tabId === 'tab-workouts' || tabId === 'tab-exercises') {
        fab.style.display = 'flex';
    } else {
        fab.style.display = 'none';
    }
}

function handleFabClick() {
    const activeTab = document.querySelector('.tab-content.active').id;
    if(activeTab === 'tab-exercises') {
        document.getElementById('modal-exercise').style.display = 'flex';
    } else if (activeTab === 'tab-workouts') {
        renderChecklist();
        document.getElementById('modal-workout').style.display = 'flex';
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// --- TOAST (Feedback Visual) ---
function showToast(msg) {
    const x = document.getElementById("toast");
    x.textContent = msg;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// --- EXERCÍCIOS ---
function addExercise() {
    const name = document.getElementById('input-ex-name').value;
    const group = document.getElementById('input-ex-group').value;
    
    if(!name) return showToast("Digite um nome!");

    db.exercises.push({ id: Date.now(), name, group });
    saveData();
    renderAll();
    closeModal('modal-exercise');
    document.getElementById('input-ex-name').value = '';
    document.getElementById('input-ex-group').value = '';
    showToast("Exercício salvo!");
}

function deleteExercise(id) {
    if(confirm("Tem certeza que deseja apagar?")) { // Prevenção de erro
        db.exercises = db.exercises.filter(e => e.id !== id);
        saveData();
        renderAll();
        showToast("Exercício apagado.");
    }
}

// --- TREINOS ---
function renderChecklist() {
    const container = document.getElementById('workout-checklist');
    container.innerHTML = '';
    db.exercises.forEach(ex => {
        container.innerHTML += `
            <div style="margin-bottom:5px;">
                <input type="checkbox" value="${ex.id}" id="chk_${ex.id}" style="width:auto; margin-right:10px;">
                <label for="chk_${ex.id}">${ex.name}</label>
            </div>
        `;
    });
}

function addWorkout() {
    const name = document.getElementById('input-wk-name').value;
    if(!name) return showToast("Digite um nome para o treino!");
    
    const checkboxes = document.querySelectorAll('#workout-checklist input:checked');
    if(checkboxes.length === 0) return showToast("Selecione exercícios!");

    const selectedIds = Array.from(checkboxes).map(c => parseInt(c.value));
    
    db.workouts.push({ id: Date.now(), name, exIds: selectedIds });
    saveData();
    renderAll();
    closeModal('modal-workout');
    document.getElementById('input-wk-name').value = '';
    showToast("Treino Criado!");
}

function deleteWorkout(id) {
    if(confirm("Deseja excluir este treino?")) { // Prevenção de erro
        db.workouts = db.workouts.filter(w => w.id !== id);
        saveData();
        renderAll();
        showToast("Treino excluído.");
    }
}

// --- RENDERIZAR LISTAS ---
function renderAll() {
    // Render Exercicios
    const exList = document.getElementById('exercises-list');
    exList.innerHTML = '';
    db.exercises.forEach(ex => {
        exList.innerHTML += `
            <div class="card">
                <div>
                    <h3>${ex.name}</h3>
                    <p>${ex.group || 'Geral'}</p>
                </div>
                <div class="card-actions">
                    <button onclick="deleteExercise(${ex.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    // Render Treinos
    const wkList = document.getElementById('workouts-list');
    wkList.innerHTML = '';
    if(db.workouts.length === 0) document.getElementById('empty-workouts').style.display = 'block';
    else document.getElementById('empty-workouts').style.display = 'none';

    db.workouts.forEach(wk => {
        wkList.innerHTML += `
            <div class="card">
                <div>
                    <h3>${wk.name}</h3>
                    <p>${wk.exIds.length} exercícios</p>
                </div>
                <div class="card-actions" style="display:flex; gap:10px;">
                    <button onclick="startLiveMode(${wk.id})" style="color:var(--primary-color); font-weight:bold;">
                        INICIAR <i class="fas fa-play"></i>
                    </button>
                    <button onclick="deleteWorkout(${wk.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    // Render Historico
    const histList = document.getElementById('history-list');
    histList.innerHTML = '';
    const reversed = [...db.history].reverse();
    reversed.forEach(h => {
        histList.innerHTML += `
            <div class="card">
                <div>
                    <h3>${h.workoutName}</h3>
                    <p>${h.date}</p>
                </div>
            </div>
        `;
    });
}

// --- BACKUP / IMPORT / EXPORT (Mecanismo de Login Simples) ---
function exportData() {
    const dataStr = JSON.stringify(db);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "backup_gym.json";
    a.click();
    showToast("Backup baixado!");
}

function importData(input) {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            db = JSON.parse(e.target.result);
            saveData();
            renderAll();
            showToast("Dados restaurados com sucesso!");
        } catch(err) {
            showToast("Erro no arquivo.");
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    if(confirm("ISSO APAGARÁ TUDO! Tem certeza?")) {
        localStorage.removeItem('hyperGymDB');
        location.reload();
    }
}

// ==========================================================
// --- MODO TREINO AO VIVO (A KILLER FEATURE) ---
// ==========================================================
let currentTimerInterval = null;
let timerSeconds = 0;

function startLiveMode(workoutId) {
    const workout = db.workouts.find(w => w.id === workoutId);
    if(!workout) return;

    document.getElementById('live-title').innerText = workout.name;
    const list = document.getElementById('live-exercises-list');
    list.innerHTML = '';

    // Renderiza exercícios com checkboxes
    workout.exIds.forEach(exId => {
        const ex = db.exercises.find(e => e.id === exId);
        if(ex) {
            let setsHTML = '';
            for(let i=1; i<=3; i++) { // 3 séries padrão
                setsHTML += `
                    <div class="set-row">
                        <span style="color:#666; font-size:0.8rem;">S${i}</span>
                        <input type="checkbox" class="set-check">
                        <input type="number" placeholder="kg" class="input-mini">
                        <input type="number" placeholder="RPE" class="input-mini rpe-input" oninput="updateRPE(this)">
                    </div>
                `;
            }

            list.innerHTML += `
                <div class="live-card">
                    <h3 style="color:var(--primary-color)">${ex.name}</h3>
                    ${setsHTML}
                </div>
            `;
        }
    });

    document.getElementById('modal-live').style.display = 'flex';
}

function closeLiveMode() {
    if(confirm("Sair do treino? O progresso não salvo será perdido.")) {
        document.getElementById('modal-live').style.display = 'none';
        stopTimer();
    }
}

function finishLiveWorkout() {
    const name = document.getElementById('live-title').innerText;
    const today = new Date().toLocaleDateString('pt-BR');
    
    db.history.push({ workoutName: name, date: today });
    saveData();
    renderAll();
    
    document.getElementById('modal-live').style.display = 'none';
    stopTimer();
    showToast("Treino finalizado! Parabéns!");
    switchTab('tab-history');
}

// Timer Logic
function startTimer(sec) {
    stopTimer();
    timerSeconds = sec;
    updateTimerVis();
    currentTimerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerVis();
        if(timerSeconds <= 0) {
            stopTimer();
            if(navigator.vibrate) navigator.vibrate([500, 200, 500]); // Vibrar
            showToast("Tempo esgotado!");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(currentTimerInterval);
    timerSeconds = 0;
    updateTimerVis();
}

function updateTimerVis() {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2,'0');
    const s = (timerSeconds % 60).toString().padStart(2,'0');
    document.getElementById('timer-display').innerText = `${m}:${s}`;
}

// RPE Color Logic
function updateRPE(input) {
    input.setAttribute('data-val', input.value);
}
