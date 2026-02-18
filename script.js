/* ==========================================
   HYPERSCIENCE — SCRIPT.JS v4.0
   + Remover exercício durante treino
   + Relatório completo (PRs, eficiência, densidade)
   + Progressão automática de carga
   + Timer de descanso entre séries
   ========================================== */

'use strict';

// ==========================================
// BASE DE DADOS
// ==========================================

const EXERCISE_DB = {
    horizontal_push: { name: 'Empurrar Horizontal', exercises: ['Supino Reto (Barra)', 'Supino Reto (Halteres)', 'Supino Máquina', 'Flexão de Braço', 'Supino Smith'] },
    incline_push:    { name: 'Empurrar Inclinado',  exercises: ['Supino Inclinado (Halteres)', 'Supino Inclinado (Barra)', 'Supino Inclinado Máquina', 'Smith Inclinado'] },
    vertical_push:   { name: 'Empurrar Vertical',   exercises: ['Desenvolvimento (Halteres)', 'Desenvolvimento Militar (Barra)', 'Desenvolvimento Máquina', 'Elevação Frontal'] },
    isolation_chest: { name: 'Isolamento Peito',     exercises: ['Crucifixo (Peck Deck)', 'Crucifixo (Halteres)', 'Crossover Polia Alta', 'Crossover Polia Baixa'] },
    isolation_delt:  { name: 'Isolamento Ombro',     exercises: ['Elevação Lateral (Halteres)', 'Elevação Lateral (Polia)', 'Elevação Lateral (Máquina)', 'Face Pull'] },
    triceps:         { name: 'Tríceps',              exercises: ['Tríceps Polia (Corda)', 'Tríceps Testa', 'Tríceps Francês', 'Paralelas', 'Tríceps Coice'] },
    vertical_pull:   { name: 'Puxada Vertical',      exercises: ['Puxada Alta (Frente)', 'Barra Fixa', 'Puxada Triângulo', 'Graviton'] },
    horizontal_pull: { name: 'Remada',               exercises: ['Remada Curvada (Barra)', 'Remada Unilateral (Serrote)', 'Remada Baixa (Triângulo)', 'Remada Máquina'] },
    biceps:          { name: 'Bíceps',               exercises: ['Rosca Direta (Barra)', 'Rosca Alternada (Halteres)', 'Rosca Scott', 'Rosca Martelo', 'Rosca Polia'] },
    squat_pattern:   { name: 'Agachamento',          exercises: ['Agachamento Livre', 'Leg Press 45', 'Hack Machine', 'Agachamento Búlgaro', 'Passada'] },
    hinge_pattern:   { name: 'Extensão de Quadril',  exercises: ['Levantamento Terra', 'Stiff', 'RDL (Romanian Deadlift)', 'Elevação Pélvica'] },
    isolation_leg:   { name: 'Isolamento Perna',     exercises: ['Cadeira Extensora', 'Mesa Flexora', 'Cadeira Flexora', 'Cadeira Adutora'] },
    calves:          { name: 'Panturrilhas',         exercises: ['Panturrilha em Pé', 'Panturrilha Sentado', 'Panturrilha Leg Press'] },
    abs:             { name: 'Abdômen',              exercises: ['Abdominal Infra', 'Abdominal Supra (Máquina)', 'Prancha', 'Lenhador (Polia)'] }
};

const WORKOUT_PLANS = {
    ppl: {
        name: 'PPL — Push / Pull / Legs',
        desc: 'Alta frequência, divisão clássica. Ideal para intermediários.',
        days: [
            { id: 'push', name: 'Empurrar — Peito · Ombro · Tríceps', exercises: [
                { cat: 'horizontal_push', ex: 'Supino Reto (Barra)' },
                { cat: 'incline_push',    ex: 'Supino Inclinado (Halteres)' },
                { cat: 'vertical_push',   ex: 'Desenvolvimento (Halteres)' },
                { cat: 'isolation_delt',  ex: 'Elevação Lateral (Halteres)' },
                { cat: 'isolation_chest', ex: 'Crucifixo (Peck Deck)' },
                { cat: 'triceps',         ex: 'Tríceps Polia (Corda)' }
            ]},
            { id: 'pull', name: 'Puxar — Costas · Bíceps', exercises: [
                { cat: 'vertical_pull',   ex: 'Puxada Alta (Frente)' },
                { cat: 'horizontal_pull', ex: 'Remada Curvada (Barra)' },
                { cat: 'horizontal_pull', ex: 'Remada Baixa (Triângulo)' },
                { cat: 'isolation_delt',  ex: 'Face Pull' },
                { cat: 'biceps',          ex: 'Rosca Direta (Barra)' },
                { cat: 'biceps',          ex: 'Rosca Martelo' }
            ]},
            { id: 'legs', name: 'Pernas — Completo', exercises: [
                { cat: 'squat_pattern', ex: 'Agachamento Livre' },
                { cat: 'squat_pattern', ex: 'Leg Press 45' },
                { cat: 'hinge_pattern', ex: 'Stiff' },
                { cat: 'isolation_leg', ex: 'Cadeira Extensora' },
                { cat: 'isolation_leg', ex: 'Mesa Flexora' },
                { cat: 'calves',        ex: 'Panturrilha em Pé' }
            ]}
        ]
    },
    upper_lower: {
        name: 'Upper / Lower',
        desc: 'Equilíbrio entre força e hipertrofia. Excelente recuperação.',
        days: [
            { id: 'upper_a', name: 'Superiores A — Foco Força', exercises: [
                { cat: 'horizontal_push', ex: 'Supino Reto (Barra)' },
                { cat: 'horizontal_pull', ex: 'Remada Curvada (Barra)' },
                { cat: 'vertical_push',   ex: 'Desenvolvimento Militar (Barra)' },
                { cat: 'vertical_pull',   ex: 'Barra Fixa' },
                { cat: 'triceps',         ex: 'Tríceps Testa' },
                { cat: 'biceps',          ex: 'Rosca Direta (Barra)' }
            ]},
            { id: 'lower_a', name: 'Inferiores A — Foco Agachamento', exercises: [
                { cat: 'squat_pattern', ex: 'Agachamento Livre' },
                { cat: 'hinge_pattern', ex: 'Levantamento Terra' },
                { cat: 'squat_pattern', ex: 'Passada' },
                { cat: 'isolation_leg', ex: 'Cadeira Extensora' },
                { cat: 'calves',        ex: 'Panturrilha Sentado' },
                { cat: 'abs',           ex: 'Abdominal Infra' }
            ]},
            { id: 'upper_b', name: 'Superiores B — Foco Hipertrofia', exercises: [
                { cat: 'incline_push',    ex: 'Supino Inclinado (Halteres)' },
                { cat: 'vertical_pull',   ex: 'Puxada Alta (Frente)' },
                { cat: 'isolation_delt',  ex: 'Elevação Lateral (Halteres)' },
                { cat: 'isolation_chest', ex: 'Crucifixo (Peck Deck)' },
                { cat: 'triceps',         ex: 'Tríceps Polia (Corda)' },
                { cat: 'biceps',          ex: 'Rosca Scott' }
            ]},
            { id: 'lower_b', name: 'Inferiores B — Foco Posterior', exercises: [
                { cat: 'hinge_pattern', ex: 'RDL (Romanian Deadlift)' },
                { cat: 'squat_pattern', ex: 'Leg Press 45' },
                { cat: 'isolation_leg', ex: 'Mesa Flexora' },
                { cat: 'isolation_leg', ex: 'Cadeira Adutora' },
                { cat: 'calves',        ex: 'Panturrilha em Pé' }
            ]}
        ]
    },
    arnold: {
        name: 'Arnold Split',
        desc: 'Peito+Costas, Ombro+Braços, Pernas. Volume alto.',
        days: [
            { id: 'chest_back', name: 'Peito e Costas', exercises: [
                { cat: 'horizontal_push', ex: 'Supino Reto (Barra)' },
                { cat: 'vertical_pull',   ex: 'Barra Fixa' },
                { cat: 'incline_push',    ex: 'Supino Inclinado (Halteres)' },
                { cat: 'horizontal_pull', ex: 'Remada Unilateral (Serrote)' },
                { cat: 'isolation_chest', ex: 'Crucifixo (Halteres)' },
                { cat: 'horizontal_pull', ex: 'Remada Baixa (Triângulo)' }
            ]},
            { id: 'delt_arm', name: 'Ombros e Braços', exercises: [
                { cat: 'vertical_push',  ex: 'Desenvolvimento (Halteres)' },
                { cat: 'isolation_delt', ex: 'Elevação Lateral (Polia)' },
                { cat: 'biceps',         ex: 'Rosca Direta (Barra)' },
                { cat: 'triceps',        ex: 'Tríceps Francês' },
                { cat: 'biceps',         ex: 'Rosca Scott' },
                { cat: 'triceps',        ex: 'Tríceps Polia (Corda)' }
            ]},
            { id: 'legs', name: 'Pernas', exercises: [
                { cat: 'squat_pattern', ex: 'Agachamento Livre' },
                { cat: 'hinge_pattern', ex: 'RDL (Romanian Deadlift)' },
                { cat: 'squat_pattern', ex: 'Leg Press 45' },
                { cat: 'isolation_leg', ex: 'Cadeira Extensora' },
                { cat: 'isolation_leg', ex: 'Mesa Flexora' },
                { cat: 'calves',        ex: 'Panturrilha em Pé' }
            ]}
        ]
    }
};

// ==========================================
// STORAGE HELPER
// ==========================================

const Storage = {
    get(key, fallback = null) {
        try { const r = localStorage.getItem(key); return r !== null ? JSON.parse(r) : fallback; }
        catch { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch { return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch {} }
};

// ==========================================
// ESTADO GLOBAL
// ==========================================

const State = {
    history:       Storage.get('hs_history', []),
    activeWorkout: Storage.get('hs_active',  null),
    setupDraft:    null,
    swapIndex:     null,
    timerInterval: null,
    restTimer:     { interval: null, remaining: 0, total: 0 }
};

function saveHistory() { Storage.set('hs_history', State.history); }
function saveActive()  { Storage.set('hs_active',  State.activeWorkout); }
function clearActive() { Storage.remove('hs_active'); State.activeWorkout = null; }

// ==========================================
// HELPERS DE HISTÓRICO
// ==========================================

function getExerciseHistory(name) {
    for (const w of State.history) {
        const found = w.exercises?.find(e => e.name === name);
        if (found) {
            const valid = found.sets?.filter(s => parseFloat(s.weight) > 0 && parseFloat(s.reps) > 0) || [];
            if (valid.length > 0) {
                return { maxWeight: Math.max(...valid.map(s => parseFloat(s.weight))), lastSets: valid };
            }
        }
    }
    return null;
}

function getExercisePR(name) {
    let pr = 0;
    for (const w of State.history) {
        w.exercises?.find(e => e.name === name)?.sets?.forEach(s => {
            const v = parseFloat(s.weight) || 0;
            if (v > pr) pr = v;
        });
    }
    return pr;
}

// ==========================================
// ROTEAMENTO
// ==========================================

function router(view, params = null) {
    clearTimer();
    clearRestTimer();
    const app = document.getElementById('app');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    const titles = { home:'TREINAR', history:'HISTÓRICO', stats:'DADOS', plan_days:'PLANO', workout_setup:'SETUP', active_session:'SESSÃO', result:'RESULTADO' };
    document.getElementById('page-title').textContent = titles[view] || 'BETA';
    const views = { home, plan_days, workout_setup, active_session, result, history, stats };
    if (views[view]) { app.innerHTML = ''; views[view](app, params); }
}

// ==========================================
// VIEW: HOME
// ==========================================

function home(container) {
    const el = document.createElement('div');
    el.className = 'fade-in';
    let html = `<div class="home-header"><h2>Escolha sua<br>Estratégia</h2><p>Planos baseados em ciência do esporte.</p></div>`;

    if (State.activeWorkout) {
        const dur = Math.floor((Date.now() - State.activeWorkout.startTime) / 60000);
        html += `<div class="repeat-card" onclick="router('active_session')" style="border-color:var(--yellow);margin-bottom:12px;">
            <div class="repeat-label" style="color:var(--yellow)">⚡ SESSÃO EM ANDAMENTO</div>
            <div class="repeat-name">${State.activeWorkout.dayName}</div>
            <div class="repeat-meta">${dur} min · Toque para continuar</div>
        </div>`;
    }

    if (State.history.length > 0 && !State.activeWorkout) {
        const last = State.history[0];
        const d = new Date(last.startTime).toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'2-digit' });
        html += `<div class="repeat-card" onclick="repeatLastWorkout()">
            <div class="repeat-label">↺ REPETIR ÚLTIMO TREINO</div>
            <div class="repeat-name">${last.dayName}</div>
            <div class="repeat-meta">${d} · ${last.exercises.length} exercícios</div>
        </div>`;
    }

    for (const [key, plan] of Object.entries(WORKOUT_PLANS)) {
        html += `<div class="plan-card" onclick="router('plan_days', '${key}')">
            <div><div class="plan-name">${plan.name}</div><div class="plan-desc">${plan.desc}</div></div>
            <svg class="plan-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>`;
    }
    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// VIEW: DIAS DO PLANO
// ==========================================

function plan_days(container, planKey) {
    const plan = WORKOUT_PLANS[planKey];
    const el = document.createElement('div');
    el.className = 'fade-in';
    let html = `<button class="back-btn" onclick="router('home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> Voltar</button>
        <div class="view-title">${plan.name}</div>`;
    plan.days.forEach((day, idx) => {
        html += `<div class="day-card" onclick="initSetup('${planKey}', ${idx})">
            <div><div class="day-name">${day.name}</div><div class="day-meta">${day.exercises.length} exercícios padrão</div></div>
            <div class="day-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
        </div>`;
    });
    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// VIEW: SETUP
// ==========================================

function initSetup(planKey, dayIndex) {
    const day = WORKOUT_PLANS[planKey].days[dayIndex];
    State.setupDraft = {
        planName: WORKOUT_PLANS[planKey].name,
        dayName:  day.name,
        exercises: day.exercises.map(item => ({ name: item.ex, category: item.cat, sets: [{ weight:'', reps:'', rpe:'' }] }))
    };
    router('workout_setup');
}

function workout_setup(container) {
    const setup = State.setupDraft;
    const el = document.createElement('div');
    el.className = 'fade-in';
    let html = `<button class="back-btn" onclick="router('home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> Voltar</button>
        <div class="view-title" style="margin-bottom:6px;">Personalizar</div>
        <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:20px;">Toque para trocar por variação equivalente.</p>`;
    setup.exercises.forEach((ex, idx) => {
        const catName = EXERCISE_DB[ex.category]?.name || ex.category;
        const hist = getExerciseHistory(ex.name);
        html += `<div class="setup-ex-card" onclick="openSwapModal(${idx})">
            <div>
                <div class="setup-ex-cat">${catName}</div>
                <div class="setup-ex-name">${ex.name}</div>
                ${hist ? `<span class="pr-tag">Último: ${hist.maxWeight}kg</span>` : ''}
            </div>
            <svg class="swap-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
        </div>`;
    });
    html += `<div style="margin-top:12px;"><button class="btn btn-success" onclick="startActiveSession()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        INICIAR TREINO
    </button></div>`;
    el.innerHTML = html;
    container.appendChild(el);
}

// ==========================================
// MODAL DE TROCA
// ==========================================

function openSwapModal(index) {
    State.swapIndex = index;
    const ex  = State.setupDraft.exercises[index];
    const cat = EXERCISE_DB[ex.category];
    if (!cat) return;
    document.getElementById('swap-list').innerHTML = cat.exercises.map(name => {
        const hist = getExerciseHistory(name);
        return `<div class="swap-item ${name === ex.name ? 'current' : ''}" onclick="confirmSwap('${name.replace(/'/g,"\\'")}')">
            <div>
                <span>${name}</span>
                ${hist ? `<div style="font-size:.65rem;color:var(--text-muted);margin-top:2px;font-family:var(--font-mono)">Último: ${hist.maxWeight}kg</div>` : ''}
            </div>
            ${name === ex.name ? '<span class="swap-item-badge">ATUAL</span>' : ''}
        </div>`;
    }).join('');
    const modal = document.getElementById('swap-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function handleModalBackdrop(e) { if (e.target === document.getElementById('swap-modal')) closeModal(); }
function closeModal() {
    const m = document.getElementById('swap-modal');
    m.classList.add('hidden'); m.classList.remove('flex');
    State.swapIndex = null;
}
function confirmSwap(name) {
    if (State.swapIndex !== null) { State.setupDraft.exercises[State.swapIndex].name = name; closeModal(); router('workout_setup'); }
}

// ==========================================
// SESSÃO ATIVA
// ==========================================

function startActiveSession() {
    const exercises = State.setupDraft.exercises.map(ex => {
        const hist = getExerciseHistory(ex.name);
        const sets = hist ? hist.lastSets.map(s => ({ weight: s.weight, reps: s.reps, rpe: '' })) : [{ weight:'', reps:'', rpe:'' }];
        return { ...ex, sets };
    });
    State.activeWorkout = { planName: State.setupDraft.planName, dayName: State.setupDraft.dayName, exercises, startTime: Date.now() };
    saveActive();
    router('active_session');
}

function repeatLastWorkout() {
    if (!State.history.length) return;
    const last = State.history[0];
    State.activeWorkout = {
        planName: last.planName, dayName: last.dayName,
        exercises: last.exercises.map(ex => {
            const hist = getExerciseHistory(ex.name);
            const sets = hist ? hist.lastSets.map(s => ({ weight: s.weight, reps: s.reps, rpe: '' })) : [{ weight:'', reps:'', rpe:'' }];
            return { name: ex.name, category: ex.category || 'unknown', sets };
        }),
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
        <div id="rest-timer-bar" class="rest-timer-bar hidden">
            <div class="rest-timer-inner">
                <span class="rest-timer-label">DESCANSO</span>
                <span id="rest-timer-display" class="rest-timer-display">--</span>
                <button class="rest-timer-skip" onclick="skipRestTimer()">PULAR ▶</button>
            </div>
            <div id="rest-timer-progress" class="rest-timer-progress-wrap">
                <div id="rest-timer-fill" class="rest-timer-progress-fill"></div>
            </div>
        </div>

        <div class="session-sticky">
            <div>
                <div class="session-title">${workout.dayName}</div>
                <div class="session-timer" id="timer">00:00</div>
            </div>
            <button class="btn btn-danger" style="width:auto;padding:10px 18px;font-size:.8rem;" onclick="confirmFinish()">FINALIZAR</button>
        </div>`;

    workout.exercises.forEach((ex, exIdx) => {
        html += renderExCard(ex, exIdx);
    });

    el.innerHTML = html;
    container.appendChild(el);
    startTimer();
}

function renderExCard(ex, exIdx) {
    const pr = getExercisePR(ex.name);
    return `
    <div class="ex-card" id="ex-card-${exIdx}">
        <div class="ex-header">
            <div class="ex-name-block">
                <div class="ex-name">${ex.name}</div>
                ${pr > 0 ? `<div class="ex-pr">PR: ${pr}kg</div>` : ''}
            </div>
            <button class="btn-remove-ex" onclick="removeExercise(${exIdx})" title="Remover este exercício do treino">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
            </button>
        </div>
        <div class="sets-header">
            <span></span><span>KG</span><span>REPS</span><span>RPE</span><span></span>
        </div>
        <div id="sets-${exIdx}">
            ${ex.sets.map((s, sIdx) => renderSetRow(exIdx, sIdx, s)).join('')}
        </div>
        <button class="btn-add-set" onclick="addSet(${exIdx})">+ Série</button>
    </div>`;
}

// ==========================================
// REMOVER EXERCÍCIO DURANTE O TREINO
// ==========================================

window.removeExercise = (exIdx) => {
    if (!State.activeWorkout) return;
    const name = State.activeWorkout.exercises[exIdx].name;
    if (!confirm(`Remover "${name}" do treino?\n\nIsso não prejudica sua nota — o app analisa apenas o que você fez.`)) return;
    State.activeWorkout.exercises.splice(exIdx, 1);
    saveActive();
    rebuildExCards();
};

function rebuildExCards() {
    const session = document.getElementById('session-view');
    if (!session) { router('active_session'); return; }
    session.querySelectorAll('.ex-card').forEach(c => c.remove());
    State.activeWorkout.exercises.forEach((ex, i) => {
        session.insertAdjacentHTML('beforeend', renderExCard(ex, i));
    });
}

// ==========================================
// SÉRIES
// ==========================================

function renderSetRow(exIdx, sIdx, set) {
    return `<div class="set-row" id="set-${exIdx}-${sIdx}">
        <span class="set-num">${sIdx + 1}</span>
        <input class="input-num" type="number" inputmode="decimal" placeholder="—" value="${set.weight}"
            onchange="updateSet(${exIdx},${sIdx},'weight',this.value)" onfocus="this.select()">
        <input class="input-num" type="number" inputmode="numeric" placeholder="—" value="${set.reps}"
            onchange="updateSet(${exIdx},${sIdx},'reps',this.value)" onfocus="this.select()">
        <input class="input-num ${parseFloat(set.rpe)>=9?'rpe-high':''}" type="number" inputmode="numeric"
            placeholder="—" value="${set.rpe}" min="1" max="10"
            onchange="updateSet(${exIdx},${sIdx},'rpe',this.value)" onfocus="this.select()">
        <button class="btn-remove-set" onclick="removeSet(${exIdx},${sIdx})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
    </div>`;
}

window.updateSet = (exIdx, sIdx, field, val) => {
    if (!State.activeWorkout) return;
    State.activeWorkout.exercises[exIdx].sets[sIdx][field] = val;
    saveActive();
    if (field === 'rpe') {
        const row = document.getElementById(`set-${exIdx}-${sIdx}`);
        if (row) row.querySelector('.input-num:nth-child(4)')?.classList.toggle('rpe-high', parseFloat(val) >= 9);
        if (parseFloat(val) > 0) startRestTimer(90);
    }
};

window.addSet = (exIdx) => {
    if (!State.activeWorkout) return;
    const sets = State.activeWorkout.exercises[exIdx].sets;
    const prev = sets[sets.length - 1];
    sets.push({ weight: prev.weight, reps: prev.reps, rpe: '' });
    saveActive();
    document.getElementById(`sets-${exIdx}`)?.insertAdjacentHTML('beforeend', renderSetRow(exIdx, sets.length - 1, sets[sets.length - 1]));
};

window.removeSet = (exIdx, sIdx) => {
    if (!State.activeWorkout) return;
    const sets = State.activeWorkout.exercises[exIdx].sets;
    if (sets.length <= 1) return;
    sets.splice(sIdx, 1);
    saveActive();
    const c = document.getElementById(`sets-${exIdx}`);
    if (c) c.innerHTML = sets.map((s, i) => renderSetRow(exIdx, i, s)).join('');
};

// ==========================================
// TIMERS
// ==========================================

function startTimer() {
    clearTimer();
    const start = State.activeWorkout?.startTime || Date.now();
    State.timerInterval = setInterval(() => {
        const el = document.getElementById('timer');
        if (!el) { clearTimer(); return; }
        const d = Math.floor((Date.now() - start) / 1000);
        el.textContent = `${String(Math.floor(d/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`;
    }, 1000);
}
function clearTimer() {
    if (State.timerInterval) { clearInterval(State.timerInterval); State.timerInterval = null; }
}

function startRestTimer(seconds) {
    clearRestTimer();
    const bar = document.getElementById('rest-timer-bar');
    if (!bar) return;
    bar.classList.remove('hidden', 'rest-done');
    State.restTimer.remaining = seconds;
    State.restTimer.total = seconds;

    State.restTimer.interval = setInterval(() => {
        State.restTimer.remaining--;
        const display = document.getElementById('rest-timer-display');
        const fill    = document.getElementById('rest-timer-fill');
        if (display) display.textContent = State.restTimer.remaining + 's';
        if (fill)    fill.style.width = ((State.restTimer.remaining / State.restTimer.total) * 100) + '%';

        if (State.restTimer.remaining <= 0) {
            clearRestTimer();
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            const b = document.getElementById('rest-timer-bar');
            if (b) {
                b.classList.add('rest-done');
                setTimeout(() => { b?.classList.remove('rest-done'); b?.classList.add('hidden'); }, 1800);
            }
        }
    }, 1000);
}
function clearRestTimer() {
    if (State.restTimer.interval) { clearInterval(State.restTimer.interval); State.restTimer.interval = null; }
}
window.skipRestTimer = () => {
    clearRestTimer();
    const b = document.getElementById('rest-timer-bar');
    if (b) b.classList.add('hidden');
};

// ==========================================
// FINALIZAÇÃO
// ==========================================

function confirmFinish() { if (confirm('Finalizar e gerar relatório?')) finishWorkout(); }

function finishWorkout() {
    clearTimer(); clearRestTimer();
    const w = State.activeWorkout;
    w.endTime  = Date.now();
    w.duration = Math.max(1, Math.floor((w.endTime - w.startTime) / 60000));
    w.analysis = analyzeWorkout(w);
    State.history.unshift(w);
    saveHistory(); clearActive();
    router('result', w);
}

// ==========================================
// ALGORITMO DE ANÁLISE v4.0
// ==========================================

function analyzeWorkout(workout) {
    let totalSets = 0, hardSets = 0, failureSets = 0, volume = 0, missedData = 0, rpeSum = 0, rpeCount = 0;
    const newPRs = [];

    const exerciseBreakdown = workout.exercises.map(ex => {
        const validSets   = ex.sets.filter(s => parseFloat(s.weight) > 0 && parseFloat(s.reps) > 0);
        const skippedSets = ex.sets.length - validSets.length;
        let exVolume = 0, exMaxLoad = 0, exHard = 0, exRpeSum = 0;

        validSets.forEach(s => {
            const w = parseFloat(s.weight), r = parseFloat(s.reps), rpe = parseFloat(s.rpe) || 0;
            exVolume  += w * r; exMaxLoad = Math.max(exMaxLoad, w);
            totalSets++; volume += w * r;
            if (rpe > 0) { rpeSum += rpe; rpeCount++; exRpeSum += rpe; }
            if (rpe >= 8) { hardSets++; exHard++; }
            if (rpe >= 9)   failureSets++;
        });
        missedData += skippedSets;

        const prevPR = getExercisePR(ex.name);
        const isPR   = exMaxLoad > prevPR && exMaxLoad > 0;
        if (isPR) newPRs.push({ name: ex.name, weight: exMaxLoad, prev: prevPR });

        return {
            name: ex.name,
            setsCompleted: validSets.length,
            setsMissed: skippedSets,
            volume: exVolume,
            maxLoad: exMaxLoad,
            hardSets: exHard,
            isPR,
            avgRpe: validSets.length > 0 ? (exRpeSum / validSets.length).toFixed(1) : null
        };
    });

    const intensityRatio = totalSets > 0 ? hardSets / totalSets : 0;
    const avgRpe         = rpeCount > 0 ? rpeSum / rpeCount : 0;
    const density        = workout.duration > 0 ? Math.round(volume / workout.duration) : 0;

    let score = 0;
    const feedback = [], insights = [];

    // Intensidade — 40 pts
    if (intensityRatio >= 0.75) {
        score += 40;
        feedback.push({ icon:'🔥', text:'Intensidade brutal', detail:`${Math.round(intensityRatio*100)}% das séries próximas ou na falha. Estímulo máximo de hipertrofia atingido.`, type:'success' });
    } else if (intensityRatio >= 0.5) {
        score += 22;
        feedback.push({ icon:'✅', text:'Boa intensidade', detail:`${Math.round(intensityRatio*100)}% das séries foram efetivas (RPE ≥ 8). Ainda há margem para aumentar a carga nos próximos treinos.`, type:'ok' });
    } else if (totalSets > 0) {
        score += 6;
        feedback.push({ icon:'⚠️', text:'Intensidade abaixo do ideal', detail:`Apenas ${Math.round(intensityRatio*100)}% das séries foram perto da falha. Pesquisa mostra que séries a ≥ RPE 8 geram o melhor estímulo de hipertrofia.`, type:'warn' });
    }

    // Falha — 20 pts
    if (failureSets > 0) {
        score += 20;
        feedback.push({ icon:'💪', text:'Falha técnica atingida', detail:`${failureSets} série(s) levadas até a falha. Isso maximiza o recrutamento de unidades motoras e o sinal de hipertrofia.`, type:'success' });
    } else if (totalSets > 0) {
        insights.push('Dica: Leve ao menos 1 série por exercício até a falha técnica para maximizar o estímulo muscular.');
    }

    // Volume — 25 pts
    if (totalSets >= 10 && totalSets <= 25) {
        score += 25;
        feedback.push({ icon:'📊', text:'Volume na zona ideal', detail:`${totalSets} séries válidas está dentro da faixa ótima de hipertrofia por sessão (10–25 séries). Excelente controle.`, type:'success' });
    } else if (totalSets < 10 && totalSets > 0) {
        score += 8;
        feedback.push({ icon:'📉', text:'Volume abaixo do ideal', detail:`${totalSets} séries é insuficiente para maximizar hipertrofia. O ideal são 10–25 séries efetivas por sessão.`, type:'warn' });
    } else if (totalSets > 25) {
        score += 8;
        feedback.push({ icon:'🛑', text:'Volume excessivo', detail:`${totalSets} séries por sessão pode comprometer a recuperação e causar overtraining. Considere dividir o volume em mais dias.`, type:'warn' });
    }

    // Dados — 15 pts
    if (missedData === 0 && totalSets > 0) {
        score += 15;
        feedback.push({ icon:'📋', text:'Registro completo', detail:'Todas as séries foram registradas com carga e repetições. Isso permite rastrear evolução com precisão.', type:'success' });
    } else if (missedData > 0) {
        feedback.push({ icon:'❌', text:'Registro incompleto', detail:`${missedData} série(s) sem carga ou reps registradas. Preencha todos os campos para análise e rastreamento corretos.`, type:'danger' });
    }

    // PRs — bônus
    if (newPRs.length > 0) {
        score = Math.min(100, score + 5 * newPRs.length);
        newPRs.forEach(pr => feedback.push({
            icon:'🏆',
            text:`NOVO RECORDE — ${pr.name}`,
            detail:`${pr.weight}kg supera ${pr.prev > 0 ? 'seu PR anterior de ' + pr.prev + 'kg' : 'qualquer registro anterior'}. Progressão de carga real!`,
            type:'pr'
        }));
    }

    // Insights
    if (density > 400) insights.push(`Boa densidade de treino: ${density} kg·reps/min. Seu ritmo entre séries foi eficiente.`);
    else if (totalSets > 0) insights.push(`Densidade: ${density} kg·reps/min. Tente reduzir as pausas em exercícios de isolamento para aumentar o estímulo.`);
    if (avgRpe >= 8) insights.push(`RPE médio de ${avgRpe.toFixed(1)} — Alta intensidade. Priorize sono e alimentação na recuperação.`);
    else if (avgRpe > 0) insights.push(`RPE médio de ${avgRpe.toFixed(1)} — Você ainda tem capacidade de aumentar a carga nos próximos treinos.`);

    let grade;
    if      (score >= 90) grade = 'S';
    else if (score >= 70) grade = 'A';
    else if (score >= 50) grade = 'B';
    else if (score >= 30) grade = 'C';
    else                  grade = 'D';

    return { grade, score, feedback, insights, volume, totalSets, hardSets, failureSets, avgRpe: avgRpe.toFixed(1), density, newPRs, exerciseBreakdown };
}

// ==========================================
// VIEW: RESULTADO — RELATÓRIO COMPLETO
// ==========================================

function result(container, workout) {
    if (!workout) { router('history'); return; }
    const a = workout.analysis, g = a.grade;
    const el = document.createElement('div');
    el.className = `fade-in grade-${g}`;

    const gradeLabels  = { S:'TREINO PERFEITO', A:'EXCELENTE', B:'BOM TRABALHO', C:'PODE MELHORAR', D:'ABAIXO DO POTENCIAL' };
    const feedbackCols = { success:'var(--green)', ok:'var(--accent)', warn:'var(--yellow)', danger:'var(--red)', pr:'var(--purple)' };

    let html = `
    <div class="result-header">
        <div class="result-label">RELATÓRIO DO TREINO</div>
        <div class="grade-ring"><span class="grade-letter">${g}</span></div>
        <div style="font-family:var(--font-display);font-size:1.1rem;letter-spacing:.12em;margin-bottom:4px;">${gradeLabels[g]}</div>
        <div class="result-duration">${workout.duration} min · ${new Date(workout.startTime).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'short'})}</div>
    </div>

    <div class="score-bar-wrap">
        <div class="score-bar-header">
            <span class="score-bar-label">PONTUAÇÃO GERAL</span>
            <span class="score-bar-value">${a.score}<span style="font-size:.7rem;color:var(--text-muted)">/100</span></span>
        </div>
        <div class="score-bar-track">
            <div class="score-bar-fill grade-${g}-fill" style="width:${a.score}%"></div>
        </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
        <div class="stat-box"><div class="stat-value">${(a.volume/1000).toFixed(1)}<span style="font-size:.9rem;color:var(--text-muted)">t</span></div><div class="stat-label">Volume</div></div>
        <div class="stat-box"><div class="stat-value">${a.totalSets}</div><div class="stat-label">Séries</div></div>
        <div class="stat-box"><div class="stat-value">${a.avgRpe}</div><div class="stat-label">RPE Médio</div></div>
    </div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-top:0;">
        <div class="stat-box"><div class="stat-value">${a.hardSets}</div><div class="stat-label">Efetivas</div></div>
        <div class="stat-box"><div class="stat-value">${a.failureSets}</div><div class="stat-label">Na Falha</div></div>
        <div class="stat-box"><div class="stat-value">${a.density}</div><div class="stat-label">kg·rep/min</div></div>
    </div>`;

    if (a.newPRs.length > 0) {
        html += `<div class="pr-banner"><div class="pr-banner-title">🏆 NOVOS RECORDES PESSOAIS</div>`;
        a.newPRs.forEach(pr => { html += `<div class="pr-banner-item">${pr.name} — <strong>${pr.weight}kg</strong></div>`; });
        html += `</div>`;
    }

    html += `<div class="report-section-title">ANÁLISE DETALHADA</div>`;
    a.feedback.forEach(f => {
        const col = feedbackCols[f.type] || 'var(--accent)';
        html += `<div class="feedback-card" style="border-left-color:${col}">
            <div class="feedback-card-header"><span class="feedback-icon">${f.icon}</span><span class="feedback-title">${f.text}</span></div>
            <p class="feedback-detail">${f.detail}</p>
        </div>`;
    });

    if (a.insights.length > 0) {
        html += `<div class="report-section-title" style="margin-top:20px;">INSIGHTS</div>`;
        a.insights.forEach(ins => { html += `<div class="insight-item">💡 ${ins}</div>`; });
    }

    html += `<div class="report-section-title" style="margin-top:20px;">POR EXERCÍCIO</div>`;
    a.exerciseBreakdown.filter(ex => ex.setsCompleted > 0).forEach(ex => {
        html += `<div class="ex-breakdown-card ${ex.isPR ? 'ex-pr-glow' : ''}">
            <div class="ex-breakdown-header">
                <span class="ex-breakdown-name">${ex.name}</span>
                ${ex.isPR ? '<span class="pr-tag">🏆 PR</span>' : ''}
            </div>
            <div class="ex-breakdown-stats">
                <span>${ex.setsCompleted} série(s)</span>
                <span>${(ex.volume/1000).toFixed(2)}t</span>
                <span>Máx: ${ex.maxLoad}kg</span>
                ${ex.avgRpe ? `<span>RPE: ${ex.avgRpe}</span>` : ''}
            </div>
            ${ex.hardSets > 0 ? `<div class="ex-breakdown-badge">🔥 ${ex.hardSets} série(s) efetiva(s)</div>` : ''}
        </div>`;
    });

    html += `<div style="margin-top:24px;display:flex;flex-direction:column;gap:8px;padding-bottom:8px;">
        <button class="btn btn-ghost" onclick="router('home')">VOLTAR AO INÍCIO</button>
    </div>`;

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
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">🏋️</div><div class="empty-text">Nenhum treino registrado ainda.<br>Vai puxar ferro!</div></div>`;
        container.appendChild(el); return;
    }
    const cols = { S:'var(--purple)', A:'var(--green)', B:'var(--accent)', C:'var(--yellow)', D:'var(--red)' };
    let html = `<div style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:.03em;margin-bottom:20px;">Histórico</div>`;
    State.history.forEach(w => {
        const date = new Date(w.startTime).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'});
        const vol  = ((w.analysis?.volume||0)/1000).toFixed(1);
        const g    = w.analysis?.grade||'?';
        const gCol = cols[g]||'var(--text-muted)';
        const prs  = w.analysis?.newPRs?.length||0;
        const tags = (w.exercises||[]).slice(0,3).map(e=>`<span class="history-tag">${e.name}</span>`).join('');
        const more = (w.exercises?.length||0) > 3 ? `<span class="history-tag">+${w.exercises.length-3}</span>` : '';
        html += `<div class="history-card">
            <span class="history-ghost-grade" style="color:${gCol}">${g}</span>
            <div class="history-row1"><div class="history-dayname">${w.dayName}</div><div class="history-grade" style="color:${gCol}">${g}</div></div>
            <div class="history-meta">${date} · ${w.duration||0} min · ${vol}t${prs>0?` · 🏆 ${prs} PR`:''}</div>
            <div class="history-tags">${tags}${more}</div>
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
    const n   = State.history.length;
    const ton = State.history.reduce((a,w)=>a+(w.analysis?.volume||0),0)/1000;
    const sets = State.history.reduce((a,w)=>a+(w.analysis?.totalSets||0),0);
    const prs  = State.history.reduce((a,w)=>a+(w.analysis?.newPRs?.length||0),0);
    const avgD = n ? Math.round(State.history.reduce((a,w)=>a+(w.duration||0),0)/n) : 0;
    const gc   = {S:0,A:0,B:0,C:0,D:0};
    State.history.forEach(w=>{ if(w.analysis?.grade) gc[w.analysis.grade]++; });
    const gcols = {S:'var(--purple)',A:'var(--green)',B:'var(--accent)',C:'var(--yellow)',D:'var(--red)'};
    const mx    = Math.max(...Object.values(gc),1);

    let html = `<div style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:.03em;margin-bottom:20px;">Estatísticas</div>
    <div class="stats-grid">
        <div class="stat-big"><div class="stat-big-value" style="color:var(--accent)">${n}</div><div class="stat-big-label">Treinos</div></div>
        <div class="stat-big"><div class="stat-big-value" style="color:var(--purple)">${ton.toFixed(1)}</div><div class="stat-big-label">Toneladas</div></div>
        <div class="stat-big"><div class="stat-big-value" style="color:var(--green)">${sets}</div><div class="stat-big-label">Séries</div></div>
        <div class="stat-big"><div class="stat-big-value" style="color:var(--yellow)">${avgD}</div><div class="stat-big-label">Média min</div></div>
    </div>
    <div class="stat-big" style="margin-bottom:10px;"><div class="stat-big-value" style="color:var(--purple)">🏆 ${prs}</div><div class="stat-big-label">Recordes Pessoais</div></div>`;

    if (n > 0) {
        html += `<div class="grade-distribution"><div class="grade-dist-title">Distribuição de Notas</div>`;
        for (const [grade, count] of Object.entries(gc)) {
            const pct = Math.round((count/mx)*100);
            html += `<div class="grade-bar-row">
                <span class="grade-bar-label" style="color:${gcols[grade]}">${grade}</span>
                <div class="grade-bar-track"><div class="grade-bar-fill" style="width:${pct}%;background:${gcols[grade]}"></div></div>
                <span class="grade-bar-count">${count}</span>
            </div>`;
        }
        html += `</div>`;
    }

    html += `<div class="danger-zone">
        <div class="danger-title">⚠️ Zona de Perigo</div>
        <div class="danger-desc">Apaga todo o histórico local permanentemente.</div>
        <button class="btn btn-danger" onclick="resetData()" style="font-size:.8rem;padding:12px;">RESETAR TUDO</button>
    </div>
    <p style="text-align:center;font-family:var(--font-mono);font-size:.6rem;color:var(--text-dim);margin-top:16px;">HYPERSCIENCE v4.0 · DADOS LOCAIS</p>`;

    el.innerHTML = html;
    container.appendChild(el);
}

function resetData() {
    if (confirm('Tem certeza absoluta? Isso apaga TODO seu histórico.')) {
        Storage.remove('hs_history'); Storage.remove('hs_active'); location.reload();
    }
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => document.getElementById('status-dot').classList.add('online'))
            .catch(() => document.getElementById('status-dot').classList.remove('online'));
    }
    if (State.activeWorkout) document.getElementById('page-title').textContent = 'EM ANDAMENTO';
    router('home');
});
