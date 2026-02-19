// --- ESTADO DO APP ---
let appData = {
    user: '',
    exercises: [], // {id, name, group}
    workouts: [],  // {id, name, exerciseIds: []}
    history: []    // {date, workoutName, details: []}
};

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderAll();
    setupNavigation();
});

// --- SISTEMA DE DADOS (LOCAL STORAGE) ---
function loadData() {
    const saved = localStorage.getItem('hyperGymData');
    if (saved) {
        appData = JSON.parse(saved);
    } else {
        // Dados iniciais padrão para não ficar vazio
        appData.exercises = [
            { id: 1, name: 'Supino Reto', group: 'Peito' },
            { id: 2, name: 'Agachamento Livre', group: 'Pernas' },
            { id: 3, name: 'Puxada Alta', group: 'Costas' }
        ];
    }
    updateGreeting();
}

function saveData() {
    localStorage.setItem('hyperGymData', JSON.stringify(appData));
}

function updateGreeting() {
    const display = document.getElementById('user-greeting');
    if (appData.user) {
        display.textContent = `Olá, ${appData.user}`;
        document.getElementById('username-input').value = appData.user;
    }
}

function saveName() {
    const name = document.getElementById('username-input').value;
    if (name) {
        appData.user = name;
        saveData();
        updateGreeting();
        showToast('Nome salvo com sucesso!');
    }
}

// --- NAVEGAÇÃO ---
function setupNavigation() {
    // FAB Button logic
    document.getElementById('fab-add').addEventListener('click', () => {
        const active = document.querySelector('.active-screen').id;
        if (active === 'screen-workouts') openModal('modal-workout');
        if (active === 'screen-exercises') openModal('modal-exercise');
    });
}

function switchScreen(screenId) {
    // Esconde todas
    document.querySelectorAll('main section').forEach(s => s.classList.remove('active-screen'));
    // Mostra a certa
    document.getElementById(screenId).classList.add('active-screen');
    
    // Atualiza botões da nav
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelector(`button[onclick="switchScreen('${screenId}')"]`).classList.add('active');

    // Esconde/Mostra FAB dependendo da tela
    const fab = document.getElementById('fab-add');
    if (screenId === 'screen-history' || screenId === 'screen-settings') {
        fab.style.display = 'none';
    } else {
        fab.style.display = 'flex';
    }
}

// --- RENDERIZAÇÃO ---
function renderAll() {
    renderExercises();
    renderWorkouts();
    renderHistory();
}

function renderExercises() {
    const list = document.getElementById('exercises-list');
    list.innerHTML = '';
    
    appData.exercises.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <h3>${ex.name}</h3>
                <p>${ex.group}</p>
            </div>
            <div class="card-actions">
                <button class="delete-btn" onclick="deleteExercise(${ex.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderWorkouts() {
    const list = document.getElementById('workouts-list');
    const emptyState = document.getElementById('empty-workouts');
    list.innerHTML = '';

    if (appData.workouts.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        appData.workouts.forEach(w => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cursor = 'pointer';
            // Clicar no card abre o modo treino
            card.onclick = (e) => {
                if(!e.target.closest('button')) startLiveWorkout(w.id);
            };
            
            const exerciseCount = w.exerciseIds.length;
            card.innerHTML = `
                <div class="card-content">
                    <h3>${w.name}</h3>
                    <p>${exerciseCount} exercícios</p>
                </div>
                <div class="card-actions">
                    <button class="delete-btn" onclick="deleteWorkout(${w.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            list.appendChild(card);
        });
    }
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    // Mostrar os mais recentes primeiro
    const reversedHistory = [...appData.history].reverse();
    
    reversedHistory.forEach((h, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <h3>${h.workoutName}</h3>
                <p>${h.date}</p>
            </div>
        `;
        list.appendChild(card);
    });
}

// --- LOGICA: EXERCÍCIOS ---
function saveExercise() {
    const name = document.getElementById('new-exercise-name').value;
    const group = document.getElementById('new-exercise-group').value;

    if (!name) return showToast('Digite um nome para o exercício!');

    const newEx = {
        id: Date.now(),
        name: name,
        group: group
    };

    appData.exercises.push(newEx);
    saveData();
    renderExercises();
    closeModal('modal-exercise');
    document.getElementById('new-exercise-name').value = '';
    showToast('Exercício salvo com sucesso!');
}

function deleteExercise(id) {
    if (confirm('Tem certeza que deseja excluir este exercício?')) {
        appData.exercises = appData.exercises.filter(e => e.id !== id);
        saveData();
        renderExercises();
        showToast('Exercício excluído.');
    }
}

// --- LOGICA: TREINOS ---
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
    
    if (id === 'modal-workout') {
        // Popula checklist de exercicios
        const container = document.getElementById('workout-exercise-select');
        container.innerHTML = '';
        appData.exercises.forEach(ex => {
            const div = document.createElement('div');
            div.style.padding = '5px';
            div.innerHTML = `
                <input type="checkbox" value="${ex.id}" id="chk-${ex.id}">
                <label for="chk-${ex.id}">${ex.name}</label>
            `;
            container.appendChild(div);
        });
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function saveWorkout() {
    const name = document.getElementById('new-workout-name').value;
    if (!name) return showToast('Dê um nome ao treino!');

    const selectedCheckboxes = document.querySelectorAll('#workout-exercise-select input:checked');
    if (selectedCheckboxes.length === 0) return showToast('Selecione pelo menos um exercício!');

    const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));

    const newWorkout = {
        id: Date.now(),
        name: name,
        exerciseIds: selectedIds
    };

    appData.workouts.push(newWorkout);
    saveData();
    renderWorkouts();
    closeModal('modal-workout');
    document.getElementById('new-workout-name').value = '';
    showToast('Treino criado com sucesso!');
}

function deleteWorkout(id) {
    if (confirm('Apagar este treino?')) {
        appData.workouts = appData.workouts.filter(w => w.id !== id);
        saveData();
        renderWorkouts();
        showToast('Treino apagado.');
    }
}

// --- KILLER FEATURE: MODO TREINO AO VIVO ---
let currentTimer = null;
let timerValue = 0;

function startLiveWorkout(workoutId) {
    const workout = appData.workouts.find(w => w.id === workoutId);
    if (!workout) return;

    document.getElementById('live-workout-title').textContent = workout.name;
    const container = document.getElementById('live-workout-list');
    container.innerHTML = '';

    workout.exerciseIds.forEach(exId => {
        const ex = appData.exercises.find(e => e.id === exId);
        if (ex) {
            const exDiv = document.createElement('div');
            exDiv.className = 'live-exercise-card';
            
            // Criar 3 séries padrão (pode ajustar depois se quiser mais complexidade)
            let setsHtml = '';
            for(let i=1; i<=3; i++) {
                setsHtml += `
                    <div class="set-row">
                        <span style="color:#aaa; width:20px;">#${i}</span>
                        <input type="checkbox" class="set-check">
                        <input type="number" placeholder="kg" class="weight-input">
                        <input type="number" placeholder="RPE" class="rpe-input" oninput="updateRPEColor(this)">
                    </div>
                `;
            }

            exDiv.innerHTML = `
                <span class="live-exercise-title">${ex.name}</span>
                ${setsHtml}
            `;
            container.appendChild(exDiv);
        }
    });

    document.getElementById('modal-live-workout').style.display = 'flex';
}

function closeLiveWorkout() {
    if(confirm("Sair do treino? O progresso não salvo será perdido.")) {
        document.getElementById('modal-live-workout').style.display = 'none';
        resetTimer();
    }
}

function finishWorkout() {
    const workoutName = document.getElementById('live-workout-title').textContent;
    const today = new Date().toLocaleDateString('pt-BR');
    
    appData.history.push({
        date: today,
        workoutName: workoutName
    });
    
    saveData();
    renderHistory();
    
    document.getElementById('modal-live-workout').style.display = 'none';
    resetTimer();
    
    showToast('Treino Finalizado! Bom trabalho 💪');
    switchScreen('screen-history');
}

// --- TIMER E UTILITÁRIOS ---
function startRest(seconds) {
    clearInterval(currentTimer);
    timerValue = seconds;
    updateTimerDisplay();
    
    currentTimer = setInterval(() => {
        timerValue--;
        updateTimerDisplay();
        if (timerValue <= 0) {
            clearInterval(currentTimer);
            // Vibrar celular se suportado
            if(navigator.vibrate) navigator.vibrate(500);
            showToast('Descanso acabou!');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(currentTimer);
    timerValue = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const min = Math.floor(timerValue / 60);
    const sec = timerValue % 60;
    document.getElementById('timer-display').textContent = 
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Muda cor do RPE dinamicamente
function updateRPEColor(input) {
    const val = parseInt(input.value);
    input.setAttribute('data-val', val);
}

function showToast(message) {
    const x = document.getElementById("toast");
    x.textContent = message;
    x.className = "toast show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// --- BACKUP E IMPORTAÇÃO ---
function exportData() {
    const dataStr = JSON.stringify(appData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    
    // Cria link invisivel para download
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_gym_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Arquivo de backup baixado!');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.exercises && data.workouts) {
                    appData = data;
                    saveData();
                    renderAll();
                    updateGreeting();
                    showToast('Dados importados com sucesso!');
                } else {
                    showToast('Arquivo inválido!');
                }
            } catch (err) {
                showToast('Erro ao ler arquivo.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetApp() {
    if(confirm("ATENÇÃO: Isso vai apagar TUDO. Tem certeza?")) {
        localStorage.removeItem('hyperGymData');
        location.reload();
    }
}
