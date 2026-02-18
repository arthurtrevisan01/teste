/* ==========================================
   HYPERSCIENCE — SCRIPT.JS
   Versão 3.0 — Otimizado, Limpo, Eficiente
   ========================================== */

'use strict';

// ==========================================
// BASE DE DADOS DE EXERCÍCIOS
// ==========================================

const EXERCISE_DB = {
    horizontal_push: {
        name: 'Empurrar Horizontal',
        exercises: ['Supino Reto (Barra)', 'Supino Reto (Halteres)', 'Supino Máquina', 'Flexão de Braço', 'Supino Smith']
    },
    incline_push: {
        name: 'Empurrar Inclinado',
        exercises: ['Supino Inclinado (Halteres)', 'Supino Inclinado (Barra)', 'Supino Inclinado Máquina', 'Smith Inclinado']
    },
    vertical_push: {
        name: 'Empurrar Vertical',
        exercises: ['Desenvolvimento (Halteres)', 'Desenvolvimento Militar (Barra)', 'Desenvolvimento Máquina', 'Elevação Frontal']
    },
    isolation_chest: {
        name: 'Isolamento Peito',
        exercises: ['Crucifixo (Peck Deck)', 'Crucifixo (Halteres)', 'Crossover Polia Alta', 'Crossover Polia Baixa']
    },
    isolation_delt: {
        name: 'Isolamento Ombro',
        exercises: ['Elevação Lateral (Halteres)', 'Elevação Lateral (Polia)', 'Elevação Lateral (Máquina)', 'Face Pull']
    },
    triceps: {
        name: 'Tríceps',
        exercises: ['Tríceps Polia (Corda)', 'Tríceps Testa', 'Tríceps Francês', 'Paralelas', 'Tríceps Coice']
    },
    vertical_pull: {
        name: 'Puxada Vertical',
        exercises: ['Puxada Alta (Frente)', 'Barra Fixa', 'Puxada Triângulo', 'Graviton']
    },
    horizontal_pull: {
        name: 'Remada',
        exercises: ['Remada Curvada (Barra)', 'Remada Unilateral (Serrote)', 'Remada Baixa (Triângulo)', 'Remada Máquina']
    },
    biceps: {
        name: 'Bíceps',
        exercises: ['Rosca Direta (Barra)', 'Rosca Alternada (Halteres)', 'Rosca Scott', 'Rosca Martelo', 'Rosca Polia']
    },
    squat_pattern: {
        name: 'Agachamento',
        exercises: ['Agachamento Livre', 'Leg Press 45', 'Hack Machine', 'Agachamento Búlgaro', 'Passada']
    },
    hinge_pattern: {
        name: 'Extensão de Quadril',
        exercises: ['Levantamento Terra', 'Stiff', 'RDL (Romanian Deadlift)', 'Elevação Pélvica']
    },
    isolation_leg: {
        name: 'Isolamento Perna',
        exercises: ['Cadeira Extensora', 'Mesa Flexora', 'Cadeira Flexora', 'Cadeira Adutora']
    },
    calves: {
        name: 'Panturrilhas',
        exercises: ['Panturrilha em Pé', 'Panturrilha Sentado', 'Panturrilha Leg Press']
    },
    abs: {
        name: 'Abdômen',
        exercises: ['Abdominal Infra', 'Abdominal Supra (Máquina)', 'Prancha', 'Lenhador (Polia)']
    }
};

const WORKOUT_PLANS = {
    ppl: {
        name: 'PPL — Push / Pull / Legs',
        desc: 'Alta frequência, divisão clássica. Ideal para intermediários.',
        days: [
            {
                id: 'push', name: 'Empurrar — Peito · Ombro · Tríceps',
                exercises: [
                    { cat: 'horizontal_push', ex: 'Supino Reto (Barra)' },
                    { cat: 'incline_push',    ex: 'Supino Inclinado (Halteres)' },
                    { cat: 'vertical_push',   ex: 'Desenvolvimento (Halteres)' },
                    { cat: 'isolation_delt',  ex: 'Elevação Lateral (Halteres)' },
                    { cat: 'isolation_chest', ex: 'Crucifixo (Peck Deck)' },
                    { cat: 'triceps',         ex: 'Tríceps Polia (Corda)' }
                ]
            },
            {
                id: 'pull', name: 'Puxar — Costas · Bíceps',
                exercises: [
                    { cat: 'vertical_pull',   ex: 'Puxada Alta (Frente)' },
                    { cat: 'horizontal_pull', ex: 'Remada Curvada (Barra)' },
                    { cat: 'horizontal_pull', ex: 'Remada Baixa (Triângulo)' },
                    { cat: 'isolation_delt',  ex: 'Face Pull' },
                    { cat: 'biceps',          ex: 'Rosca Direta (Barra)' },
                    { cat: 'biceps',          ex: 'Rosca Martelo' }
                ]
            },
            {
                id: 'legs', name: 'Pernas — Completo',
                exercises: [
                    { cat: 'squat_pattern',  ex: 'Agachamento Livre' },
                    { cat: 'squat_pattern',  ex: 'Leg Press 45' },
                    { cat: 'hinge_pattern',  ex: 'Stiff' },
                    { cat: 'isolation_leg',  ex: 'Cadeira Extensora' },
                    { cat: 'isolation_leg',  ex: 'Mesa Flexora' },
                    { cat: 'calves',         ex: 'Panturrilha em Pé' }
                ]
            }
        ]
    },
    upper_lower: {
        name: 'Upper / Lower',
        desc: 'Equilíbrio entre força e hipertrofia. Excelente recuperação.',
        days: [
            {
                id: 'upper_a', name: 'Superiores A — Foco Força',
                exercises: [
                    { cat: 'horizontal_push', ex: 'Supino Reto (Barra)' },
                    { cat: 'horizontal_pull', ex: 'Remada Curvada (Barra)' },
                    { cat: 'vertical_push',   ex: 'Desenvolvimento Militar (Barra)' },
                    { cat: 'vertical_pull',   ex: 'Barra Fixa' },
                    { cat: 'triceps',         ex: 'Tríceps Testa' },
                    { cat: 'biceps',          ex: 'Rosca Direta (Barra)' }
                ]
            },
            {
                id: 'lower_a', name: 'Inferiores A — Foco Agachamento',
                exercises: [
                    { cat: 'squat_pattern', ex: 'Agachamento Livre' },
                    { cat: 'hinge_pattern', ex: 'Levantamento Terra' },
                    { cat: 'squat_pattern', ex: 'Passada' },
                    { cat: 'isolation_leg', ex: 'Cadeira Extensora' },
                    { cat: 'calves',        ex: 'Panturrilha Sentado' },
                    { cat: 'abs',           ex: 'Abdominal Infra' }
                ]
            },
            {
                id: 'upper_b', name: 'Superiores B — Foco Hipertrofia',
                exercises: [
                    { cat: 'incline_push',    ex: 'Supino Inclinado (Halteres)' },
                    { cat: 'vertical_pull',   ex: 'Puxada Alta (Frente)' },
                    { cat: 'isolation_delt',  ex: 'Elevação Lateral (Halteres)' },
                    { cat: 'isolation_chest', ex: 'Crucifixo (Peck Deck)' },
                    { cat: 'triceps',         ex: 'Tríceps Polia (Corda)' },
                    { cat: 'biceps',          ex: 'Rosca Scott' }
                ]
            },
            {
                id: 'lower_b', name: 'Inferiores B — Foco Posterior',
                exercises: [
                    { cat: 'hinge_pattern', ex: 'RDL (Romanian Deadlift)' },
                    { cat: 'squat_pattern', ex: 'Leg Press 45' },
                    { cat: 'isolation_leg', ex: 'Mesa Flexora' },
                    { cat: 'isolation_leg', ex: 'Cadeira Adutora' },
                    { cat: 'calves',        ex: 'Panturrilha em Pé' }
                ]
            }
        ]
    },
    arnold: {
        name: 'Arnold Split',
        desc: 'Peito+Costas, Ombro+Braços, Pernas. Volume alto.',
        days: [
            {
                id: 'chest_back', name: 'Peito e Costas',
                exercises: [
                    { cat: 'horizontal_push', ex: 'Supino Reto (Barra)' },
                    { cat: 'vertical_pull',   ex: 'Barra Fixa' },
                    { cat: 'incline_push',    ex: 'Supino Inclinado (Halteres)' },
                    { cat: 'horizontal_pull', ex: 'Remada Unilateral (Serrote)' },
                    { cat: 'isolation_chest', ex: 'Crucifixo (Halteres)' },
                    { cat: 'horizontal_pull', ex: 'Remada Baixa (Triângulo)' }
                ]
            },
            {
                id: 'delt_arm', name: 'Ombros e Braços',
                exercises: [
                    { cat: 'vertical_push',  ex: 'Desenvolvimento (Halteres)' },
                    { cat: 'isolation_delt', ex: 'Elevação Lateral (Polia)' },
                    { cat: 'biceps',         ex: 'Rosca Direta (Barra)' },
                    { cat: 'triceps',        ex: 'Tríceps Francês' },
                    { cat: 'biceps',         ex: 'Rosca Scott' },
                    { cat: 'triceps',        ex: 'Tríceps Polia (Corda)' }
                ]
            },
            {
                id: 'legs', name: 'Pernas',
                exercises: [
                    { cat: 'squat_pattern', ex: 'Agachamento Livre' },
                    { cat: 'hinge_pattern', ex: 'RDL (Romanian Deadlift)' },
                    { cat: 'squat_pattern', ex: 'Leg Press 45' },
                    { cat: 'isolation_leg', ex: 'Cadeira Extensora' },
                    { cat: 'isolation_leg', ex: 'Mesa Flexora' },
                    { cat: 'calves',        ex: 'Panturrilha em Pé' }
                ]
            }
        ]
    }
};

// ==========================================
// STORAGE HELPER — Com fallback seguro
// ==========================================

const Storage = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            console.warn('[HyperScience] Falha ao salvar no localStorage.');
            return false;
        }
    },
    remove(key) {
        try { localStorage.removeItem(key); } catch {}
    }
};

// ==========================================
// ESTADO GLOBAL
// ==========================================

const State = {
    history:       Storage.get('hs_history', []),
    activeWorkout: Storage.get('hs_active', null),  // Persiste sessão ativa
    setupDraft:    null,
    swapIndex:     null,
    timerInterval: null,
};

function saveHistory()  { Storage.set('hs_history', State.history); }
function saveActive()   { Storage.set('hs_active',  State.activeWorkout); }
function clearActive()  { Storage.remove('hs_active'); State.activeWorkout = null; }

// ==========================================
// ROTEAMENTO
// ==========================================

function router(view, params = null) {
    clearTimer();
    const app = document.getElementById('app');

    // Atualiza nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Título do header
    const titles = { home: 'TREINAR', history: 'HISTÓRICO', stats: 'DADOS', plan_days: 'PLANO', workout_setup: 'SETUP', active_session: 'SESSÃO', result: 'RESULTADO' };
    document.getElementById('page-title').textContent = titles[view] || 'BETA';

    const views = { home, plan_days, workout_setup, active_session, result, history, stats };
    if (views[view]) {
        app.innerHTML = '';
        views[view](app, params);
    }

    // Se há sessão ativa salva e entramos no home, retomar
    if (view === 'home' && State.activeWorkout) {
        showResumeBar();
    }
}

// ==========================================
// VIEW: HOME
// ==========================================

function home(container) {
    const el = document.createElement('div');
    el.className = 'fade-in';

    let html = `
        <div class="home-header">
            <h2>Escolha sua<br>Estratégia</h2>
            <p>Planos baseados em ciência do esporte.</p>
        </div>`;

    // Card de retomar treino
    if (State.activeWorkout) {
        const dur = Math.floor((Date.now() - State.activeWorkout.startTime) / 1000 / 60);
        html += `
        <div class="repeat-card" onclick="router('active_session')" style="margin-bottom:12px;border-color:var(--yellow);">
            <div class="repeat-label" style="color:var(--yellow)">⚡ SESSÃO EM ANDAMENTO</div>
            <div class="repeat-name">${State.activeWorkout.dayName}</div>
            <div class="repeat-meta">${dur} min em andamento · Toque para continuar</div>
        </div>`;
    }

    // Card de repetir último treino
    if (State.history.length > 0 && !State.activeWorkout) {
        const last = State.history[0];
        const d = new Date(last.startTime).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        html += `
        <div class="repeat-card" onclick="repeatLastWorkout()">
            <div class="repeat-label">↺ REPETIR ÚLTIMO TREINO</div>
            <div class="repeat-name">${last.dayName}</div>
            <div class="repeat-meta">${d} · ${last.exercises.length} exercícios</div>
        </div>`;
    }

    // Planos
    for (const [key, plan] of Object.entries(WORKOUT_PLANS)) {
        html += `
        <div class="plan-card" onclick="router('plan_days', '${key}')">
            <div>
                <div class="plan-name">${plan.name}</div>
                <div class="plan-desc">${plan.desc}</div>
            </div>
            <svg class="plan-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>`;
    }

    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// VIEW: SELEÇÃO DE DIAS
// ==========================================

function plan_days(container, planKey) {
    const plan = WORKOUT_PLANS[planKey];
    const el = document.createElement('div');
    el.className = 'fade-in';

    let html = `
        <button class="back-btn" onclick="router('home')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            Voltar
        </button>
        <div class="view-title">${plan.name}</div>`;

    plan.days.forEach((day, idx) => {
        html += `
        <div class="day-card" onclick="initSetup('${planKey}', ${idx})">
            <div>
                <div class="day-name">${day.name}</div>
                <div class="day-meta">${day.exercises.length} exercícios padrão</div>
            </div>
            <div class="day-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
        </div>`;
    });

    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// VIEW: SETUP / PERSONALIZAÇÃO
// ==========================================

function initSetup(planKey, dayIndex) {
    const day = WORKOUT_PLANS[planKey].days[dayIndex];
    State.setupDraft = {
        planName: WORKOUT_PLANS[planKey].name,
        dayName: day.name,
        exercises: day.exercises.map(item => ({
            name: item.ex,
            category: item.cat,
            sets: [{ weight: '', reps: '', rpe: '' }]
        }))
    };
    router('workout_setup');
}

function workout_setup(container) {
    const setup = State.setupDraft;
    const el = document.createElement('div');
    el.className = 'fade-in';

    let html = `
        <button class="back-btn" onclick="router('home')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            Voltar
        </button>
        <div class="view-title" style="margin-bottom:6px;">Personalizar</div>
        <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:20px;">
            Toque em um exercício para trocar por variação equivalente.
        </p>`;

    setup.exercises.forEach((ex, idx) => {
        const catName = EXERCISE_DB[ex.category]?.name || ex.category;
        html += `
        <div class="setup-ex-card" onclick="openSwapModal(${idx})">
            <div>
                <div class="setup-ex-cat">${catName}</div>
                <div class="setup-ex-name">${ex.name}</div>
            </div>
            <svg class="swap-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
        </div>`;
    });

    html += `
        <div style="margin-top:12px;">
            <button class="btn btn-success" onclick="startActiveSession()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                INICIAR TREINO
            </button>
        </div>`;

    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// MODAL DE TROCA
// ==========================================

function openSwapModal(index) {
    State.swapIndex = index;
    const ex   = State.setupDraft.exercises[index];
    const cat  = EXERCISE_DB[ex.category];
    if (!cat) return;

    const list = document.getElementById('swap-list');
    list.innerHTML = cat.exercises.map(name => `
        <div class="swap-item ${name === ex.name ? 'current' : ''}" onclick="confirmSwap('${name.replace(/'/g, "\\'")}')">
            <span>${name}</span>
            ${name === ex.name ? '<span class="swap-item-badge">ATUAL</span>' : ''}
        </div>
    `).join('');

    const modal = document.getElementById('swap-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function handleModalBackdrop(e) {
    if (e.target === document.getElementById('swap-modal')) closeModal();
}

function closeModal() {
    const modal = document.getElementById('swap-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    State.swapIndex = null;
}

function confirmSwap(name) {
    if (State.swapIndex !== null) {
        State.setupDraft.exercises[State.swapIndex].name = name;
        closeModal();
        router('workout_setup');
    }
}

// ==========================================
// VIEW: SESSÃO ATIVA
// ==========================================

function startActiveSession() {
    State.activeWorkout = {
        ...JSON.parse(JSON.stringify(State.setupDraft)),
        startTime: Date.now()
    };
    saveActive();
    router('active_session');
}

function repeatLastWorkout() {
    if (!State.history.length) return;
    const last = State.history[0];
    State.activeWorkout = {
        planName: last.planName,
        dayName:  last.dayName,
        exercises: last.exercises.map(ex => ({
            name:     ex.name,
            category: ex.category || 'unknown',
            sets:     [{ weight: '', reps: '', rpe: '' }]
        })),
        startTime: Date.now()
    };
    saveActive();
    router('active_session');
}

function active_session(container) {
    const workout = State.activeWorkout;
    if (!workout) { router('home'); return; }

    const el = document.createElement('div');
    el.className = 'fade-in';
    el.id = 'session-view';

    let html = `
        <div class="session-sticky">
            <div>
                <div class="session-title">${workout.dayName}</div>
                <div class="session-timer" id="timer">00:00</div>
            </div>
            <button class="btn btn-danger" style="width:auto;padding:10px 18px;font-size:.8rem;" onclick="confirmFinish()">
                FINALIZAR
            </button>
        </div>`;

    workout.exercises.forEach((ex, exIdx) => {
        html += `
        <div class="ex-card" id="ex-card-${exIdx}">
            <div class="ex-name">${ex.name}</div>
            <div class="sets-header">
                <span></span>
                <span>KG</span>
                <span>REPS</span>
                <span>RPE</span>
                <span></span>
            </div>
            <div id="sets-${exIdx}">
                ${ex.sets.map((s, sIdx) => renderSetRow(exIdx, sIdx, s)).join('')}
            </div>
            <button class="btn-add-set" onclick="addSet(${exIdx})">+ Série</button>
        </div>`;
    });

    el.innerHTML = html;
    container.appendChild(el);
    startTimer();
}

function renderSetRow(exIdx, sIdx, set) {
    return `
    <div class="set-row" id="set-${exIdx}-${sIdx}">
        <span class="set-num">${sIdx + 1}</span>
        <input class="input-num" type="number" inputmode="decimal" placeholder="—" value="${set.weight}"
            onchange="updateSet(${exIdx},${sIdx},'weight',this.value)" onfocus="this.select()">
        <input class="input-num" type="number" inputmode="numeric" placeholder="—" value="${set.reps}"
            onchange="updateSet(${exIdx},${sIdx},'reps',this.value)" onfocus="this.select()">
        <input class="input-num ${parseFloat(set.rpe) >= 9 ? 'rpe-high' : ''}" type="number" inputmode="numeric"
            placeholder="—" value="${set.rpe}" min="1" max="10"
            onchange="updateSet(${exIdx},${sIdx},'rpe',this.value)" onfocus="this.select()">
        <button class="btn-remove-set" onclick="removeSet(${exIdx},${sIdx})" aria-label="Remover série">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    </div>`;
}

// ---- Manipulação de sets (sem re-render total) ----

window.updateSet = (exIdx, sIdx, field, val) => {
    if (!State.activeWorkout) return;
    State.activeWorkout.exercises[exIdx].sets[sIdx][field] = val;
    saveActive();

    // Atualiza classe RPE sem re-render
    if (field === 'rpe') {
        const input = document.querySelector(`#set-${exIdx}-${sIdx} .input-num:last-of-type`);
        if (input) input.classList.toggle('rpe-high', parseFloat(val) >= 9);
    }
};

window.addSet = (exIdx) => {
    if (!State.activeWorkout) return;
    const sets = State.activeWorkout.exercises[exIdx].sets;
    const prev = sets[sets.length - 1];
    const newSet = { weight: prev.weight, reps: prev.reps, rpe: '' };
    sets.push(newSet);
    saveActive();

    const container = document.getElementById(`sets-${exIdx}`);
    if (container) {
        container.insertAdjacentHTML('beforeend', renderSetRow(exIdx, sets.length - 1, newSet));
    }
};

window.removeSet = (exIdx, sIdx) => {
    if (!State.activeWorkout) return;
    const sets = State.activeWorkout.exercises[exIdx].sets;
    if (sets.length <= 1) return;

    sets.splice(sIdx, 1);
    saveActive();

    // Recria apenas o container daquele exercício
    const container = document.getElementById(`sets-${exIdx}`);
    if (container) {
        container.innerHTML = sets.map((s, i) => renderSetRow(exIdx, i, s)).join('');
    }
};

// ==========================================
// TIMER
// ==========================================

function startTimer() {
    clearTimer();
    const start = State.activeWorkout?.startTime || Date.now();
    State.timerInterval = setInterval(() => {
        const el = document.getElementById('timer');
        if (!el) { clearTimer(); return; }
        const diff = Math.floor((Date.now() - start) / 1000);
        const m = String(Math.floor(diff / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        el.textContent = `${m}:${s}`;
    }, 1000);
}

function clearTimer() {
    if (State.timerInterval) {
        clearInterval(State.timerInterval);
        State.timerInterval = null;
    }
}

// ==========================================
// FINALIZAÇÃO
// ==========================================

function confirmFinish() {
    const confirmed = confirm('Finalizar e gerar relatório?');
    if (confirmed) finishWorkout();
}

function finishWorkout() {
    clearTimer();
    const workout = State.activeWorkout;
    workout.endTime  = Date.now();
    workout.duration = Math.max(1, Math.floor((workout.endTime - workout.startTime) / 1000 / 60));
    workout.analysis = analyzeWorkout(workout);

    State.history.unshift(workout);
    saveHistory();
    clearActive();

    router('result', workout);
}

// ==========================================
// ALGORITMO DE ANÁLISE
// ==========================================

function analyzeWorkout(workout) {
    let totalSets   = 0;
    let hardSets    = 0;   // RPE ≥ 8
    let failureSets = 0;   // RPE ≥ 9
    let volume      = 0;
    let missedData  = 0;

    workout.exercises.forEach(ex => {
        ex.sets.forEach(s => {
            const w   = parseFloat(s.weight) || 0;
            const r   = parseFloat(s.reps)   || 0;
            const rpe = parseFloat(s.rpe)    || 0;

            if (!s.weight || !s.reps) { missedData++; return; }
            if (w > 0 && r > 0) {
                totalSets++;
                volume += w * r;
                if (rpe >= 8) hardSets++;
                if (rpe >= 9) failureSets++;
            }
        });
    });

    const intensityRatio = totalSets > 0 ? hardSets / totalSets : 0;
    let score    = 0;
    const feedback = [];

    // Dados faltando
    if (missedData > 0) feedback.push(`❌ ${missedData} série(s) sem dados de carga/reps.`);

    // Intensidade (peso maior no algoritmo)
    if (intensityRatio >= 0.75) {
        score += 45;
        feedback.push('🔥 Intensidade brutal. A maioria das séries foi próxima ou na falha.');
    } else if (intensityRatio >= 0.5) {
        score += 25;
        feedback.push('✅ Boa intensidade. Ainda há margem para aumentar a carga.');
    } else if (totalSets > 0) {
        score += 5;
        feedback.push('⚠️ Intensidade baixa. Aumente a carga ou vá mais perto da falha (RPE alto).');
    }

    // Falha técnica
    if (failureSets > 0) {
        score += 25;
        feedback.push(`💪 Atingiu a falha técnica em ${failureSets} série(s). Estímulo máximo.`);
    }

    // Volume
    if (totalSets >= 10 && totalSets <= 25) {
        score += 30;
        feedback.push(`✅ Volume ideal por sessão (${totalSets} séries válidas).`);
    } else if (totalSets < 10 && totalSets > 0) {
        score += 10;
        feedback.push(`📉 Volume baixo (${totalSets} séries). Adicione mais exercícios.`);
    } else if (totalSets > 25) {
        score += 10;
        feedback.push(`🛑 Volume alto (${totalSets} séries). Cuidado com overtraining.`);
    }

    // Grau
    let grade;
    if      (score >= 90) grade = 'S';
    else if (score >= 70) grade = 'A';
    else if (score >= 50) grade = 'B';
    else if (score >= 30) grade = 'C';
    else                  grade = 'D';

    return { grade, feedback, volume, totalSets, hardSets, failureSets, score };
}

// ==========================================
// VIEW: RESULTADO
// ==========================================

function result(container, workout) {
    if (!workout) { router('history'); return; }

    const g  = workout.analysis.grade;
    const el = document.createElement('div');
    el.className = `fade-in grade-${g}`;

    const gradeLabels = { S: 'DEUS DO GYM', A: 'EXCELENTE', B: 'BOM', C: 'MÉDIO', D: 'PODE MAIS' };

    let html = `
        <div class="result-header">
            <div class="result-label">Relatório do Treino</div>
            <div class="grade-ring">
                <span class="grade-letter">${g}</span>
            </div>
            <div style="font-family:var(--font-display);font-size:1.1rem;letter-spacing:.1em;margin-bottom:4px;">${gradeLabels[g]}</div>
            <div class="result-duration">${workout.duration} minutos</div>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-value">${(workout.analysis.volume / 1000).toFixed(1)}<span style="font-size:1rem;color:var(--text-muted)">t</span></div>
                <div class="stat-label">Volume Total</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${workout.analysis.totalSets}</div>
                <div class="stat-label">Séries Válidas</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${workout.analysis.hardSets}</div>
                <div class="stat-label">Séries Efetivas</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${workout.analysis.score}</div>
                <div class="stat-label">Pontuação</div>
            </div>
        </div>

        <div style="margin-bottom:20px;">
            ${workout.analysis.feedback.map(f => `<div class="feedback-item">${f}</div>`).join('')}
        </div>

        <button class="btn btn-ghost" onclick="router('home')" style="margin-bottom:8px;">VOLTAR AO INÍCIO</button>`;

    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// VIEW: HISTÓRICO
// ==========================================

function history(container) {
    const el = document.createElement('div');
    el.className = 'fade-in';

    if (!State.history.length) {
        el.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏋️</div>
                <div class="empty-text">Nenhum treino registrado ainda.<br>Vai puxar ferro!</div>
            </div>`;
        container.appendChild(el);
        return;
    }

    const gradeCols = { S: 'var(--purple)', A: 'var(--green)', B: 'var(--accent)', C: 'var(--yellow)', D: 'var(--red)' };

    let html = `<div style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:.03em;margin-bottom:20px;">Histórico</div>`;

    State.history.forEach(w => {
        const date  = new Date(w.startTime).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        const vol   = ((w.analysis?.volume || w.analysis?.totalVolume || 0) / 1000).toFixed(1);
        const g     = w.analysis?.grade || '?';
        const gCol  = gradeCols[g] || 'var(--text-muted)';
        const tags  = (w.exercises || []).slice(0, 3).map(e => `<span class="history-tag">${e.name}</span>`).join('');
        const extra = w.exercises?.length > 3 ? `<span class="history-tag">+${w.exercises.length - 3}</span>` : '';

        html += `
        <div class="history-card">
            <span class="history-ghost-grade" style="color:${gCol}">${g}</span>
            <div class="history-row1">
                <div class="history-dayname">${w.dayName}</div>
                <div class="history-grade" style="color:${gCol}">${g}</div>
            </div>
            <div class="history-meta">${date} · ${w.duration || 0} min · ${vol}t</div>
            <div class="history-tags">${tags}${extra}</div>
        </div>`;
    });

    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// VIEW: ESTATÍSTICAS
// ==========================================

function stats(container) {
    const el = document.createElement('div');
    el.className = 'fade-in';

    const totalWorkouts = State.history.length;
    const totalTon      = State.history.reduce((a, w) => a + ((w.analysis?.volume || w.analysis?.totalVolume || 0)), 0) / 1000;
    const totalSets     = State.history.reduce((a, w) => a + (w.analysis?.totalSets || 0), 0);
    const avgDuration   = totalWorkouts
        ? Math.round(State.history.reduce((a, w) => a + (w.duration || 0), 0) / totalWorkouts)
        : 0;

    // Distribuição de graus
    const gradeCounts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    State.history.forEach(w => { if (w.analysis?.grade) gradeCounts[w.analysis.grade]++; });
    const gradeCols = { S: 'var(--purple)', A: 'var(--green)', B: 'var(--accent)', C: 'var(--yellow)', D: 'var(--red)' };
    const maxGrade  = Math.max(...Object.values(gradeCounts), 1);

    let html = `
        <div style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:.03em;margin-bottom:20px;">Estatísticas</div>

        <div class="stats-grid">
            <div class="stat-big" style="grid-column:1">
                <div class="stat-big-value" style="color:var(--accent)">${totalWorkouts}</div>
                <div class="stat-big-label">Treinos</div>
            </div>
            <div class="stat-big">
                <div class="stat-big-value" style="color:var(--purple)">${totalTon.toFixed(1)}</div>
                <div class="stat-big-label">Toneladas</div>
            </div>
            <div class="stat-big">
                <div class="stat-big-value" style="color:var(--green)">${totalSets}</div>
                <div class="stat-big-label">Séries totais</div>
            </div>
            <div class="stat-big">
                <div class="stat-big-value" style="color:var(--yellow)">${avgDuration}</div>
                <div class="stat-big-label">Média min</div>
            </div>
        </div>`;

    if (totalWorkouts > 0) {
        html += `
        <div class="grade-distribution">
            <div class="grade-dist-title">Distribuição de Notas</div>`;
        for (const [grade, count] of Object.entries(gradeCounts)) {
            const pct = Math.round((count / maxGrade) * 100);
            html += `
            <div class="grade-bar-row">
                <span class="grade-bar-label" style="color:${gradeCols[grade]}">${grade}</span>
                <div class="grade-bar-track">
                    <div class="grade-bar-fill" style="width:${pct}%;background:${gradeCols[grade]}"></div>
                </div>
                <span class="grade-bar-count">${count}</span>
            </div>`;
        }
        html += `</div>`;
    }

    html += `
        <div class="danger-zone">
            <div class="danger-title">⚠️ Zona de Perigo</div>
            <div class="danger-desc">Apaga todo o histórico local permanentemente. Sem recuperação.</div>
            <button class="btn btn-danger" onclick="resetData()" style="font-size:.8rem;padding:12px;">RESETAR TUDO</button>
        </div>
        <p style="text-align:center;font-family:var(--font-mono);font-size:.6rem;color:var(--text-dim);margin-top:16px;">
            HYPERSCIENCE v3.0 · DADOS LOCAIS
        </p>`;

    el.innerHTML = html;
    container.appendChild(el);
}

function resetData() {
    if (confirm('Tem certeza absoluta? Isso apaga TODO seu histórico.')) {
        Storage.remove('hs_history');
        Storage.remove('hs_active');
        location.reload();
    }
}

// ==========================================
// BARRA DE RETOMAR SESSÃO
// ==========================================

function showResumeBar() {
    // Já exibido via home view — sem necessidade de overlay extra
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Registra service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => {
                document.getElementById('status-dot').classList.add('online');
            })
            .catch(() => {
                document.getElementById('status-dot').classList.remove('online');
            });
    }

    // Se havia sessão ativa, informa no header
    if (State.activeWorkout) {
        document.getElementById('page-title').textContent = 'EM ANDAMENTO';
    }

    router('home');
});
