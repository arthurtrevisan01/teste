// --- DADOS CIENTÍFICOS & PRESETS ---
const WORKOUT_PLANS = {
    'ppl': {
        name: 'PPL (Push/Pull/Legs)',
        desc: 'Alta frequência, foco em sinergistas.',
        days: [
            { id: 'push', name: 'Empurrar (Peito/Ombro/Tríceps)', exercises: ['Supino Reto (Barra/Halter)', 'Desenvolvimento Militar', 'Supino Inclinado', 'Elevação Lateral', 'Tríceps Polia'] },
            { id: 'pull', name: 'Puxar (Costas/Bíceps/Trapézio)', exercises: ['Levantamento Terra', 'Puxada Alta ou Barra Fixa', 'Remada Curvada', 'Face Pull', 'Rosca Direta', 'Rosca Martelo'] },
            { id: 'legs', name: 'Pernas (Completo)', exercises: ['Agachamento Livre', 'Leg Press', 'Stiff ou RDL', 'Cadeira Extensora', 'Mesa Flexora', 'Panturrilha em Pé'] }
        ]
    },
    'upper_lower': {
        name: 'Upper / Lower',
        desc: 'Equilíbrio perfeito para descanso.',
        days: [
            { id: 'upper1', name: 'Superiores A (Foco Força)', exercises: ['Supino Reto', 'Remada Curvada', 'Desenvolvimento', 'Barra Fixa', 'Tríceps Testa', 'Rosca Direta'] },
            { id: 'lower1', name: 'Inferiores A (Foco Agachamento)', exercises: ['Agachamento Livre', 'Afundo', 'Cadeira Extensora', 'Mesa Flexora', 'Panturrilha'] },
            { id: 'upper2', name: 'Superiores B (Foco Hipertrofia)', exercises: ['Supino Inclinado Halter', 'Puxada Alta', 'Elevação Lateral', 'Peck Deck', 'Tríceps Corda', 'Rosca Scott'] },
            { id: 'lower2', name: 'Inferiores B (Foco Posterior)', exercises: ['Levantamento Terra ou RDL', 'Leg Press', 'Mesa Flexora', 'Cadeira Adutora', 'Panturrilha Sentado'] }
        ]
    },
    'arnold': {
        name: 'Arnold Split',
        desc: 'Peito/Costas, Ombro/Braço, Perna.',
        days: [
            { id: 'chest_back', name: 'Peito e Costas', exercises: ['Supino Reto', 'Barra Fixa', 'Supino Inclinado', 'Remada Curvada', 'Crucifixo', 'Pullover'] },
            { id: 'delt_arm', name: 'Ombros e Braços', exercises: ['Desenvolvimento', 'Elevação Lateral', 'Rosca Direta', 'Tríceps Testa', 'Rosca Concentrada', 'Tríceps Francês'] },
            { id: 'legs_abs', name: 'Pernas e Abdomem', exercises: ['Agachamento', 'Leg Press', 'Stiff', 'Extensora', 'Panturrilha', 'Abdominal Infra'] }
        ]
    }
};

// --- ESTADO DO APP ---
let appState = {
    currentPlan: null,
    history: JSON.parse(localStorage.getItem('hyperHistory')) || [],
    activeWorkout: null,
    startTime: null
};

// --- ROTEAMENTO SIMPLES ---
function router(view, params = null) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    if (view === 'home') renderHome(app);
    else if (view === 'workout_select') renderWorkoutSelect(app, params);
    else if (view === 'active_session') renderActiveSession(app, params);
    else if (view === 'history') renderHistory(app);
    else if (view === 'result') renderResult(app, params);
    else if (view === 'settings') renderSettings(app);
}

// --- VIEWS ---

function renderHome(container) {
    let html = `<div class="fade-in space-y-4">
        <h2 class="text-2xl font-bold mb-4">Escolha sua Estratégia</h2>`;
    
    for (const [key, plan] of Object.entries(WORKOUT_PLANS)) {
        html += `
        <div onclick="router('workout_select', '${key}')" class="card active:scale-95 transition transform cursor-pointer border border-gray-700 hover:border-blue-500">
            <h3 class="text-xl font-bold text-blue-400">${plan.name}</h3>
            <p class="text-gray-400 text-sm mt-1">${plan.desc}</p>
        </div>`;
    }
    
    // Botão de Treino Rápido (Histórico recente)
    if(appState.history.length > 0) {
        html += `<div class="mt-8 pt-4 border-t border-gray-700">
            <h3 class="text-lg font-bold mb-2">Último Treino Realizado</h3>
            <div onclick="alert('Funcionalidade: Repetir último treino (em breve)')" class="card bg-gray-800 opacity-75">
                <p class="text-sm">Repetir: ${new Date(appState.history[0].date).toLocaleDateString()}</p>
            </div>
        </div>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

function renderWorkoutSelect(container, planKey) {
    const plan = WORKOUT_PLANS[planKey];
    let html = `<div class="fade-in pb-20">
        <button onclick="router('home')" class="mb-4 text-blue-400 text-sm">← Voltar</button>
        <h2 class="text-2xl font-bold mb-4">${plan.name}</h2>
        <p class="mb-4 text-gray-400">Qual dia você vai treinar hoje?</p>`;

    plan.days.forEach((day, index) => {
        // Truque para passar objeto como string no onclick (não ideal, mas funciona para copy/paste simples)
        // Vamos apenas passar o índice e recriar o objeto
        html += `
        <div onclick="startWorkout('${planKey}', ${index})" class="card active:scale-95 transition cursor-pointer flex justify-between items-center">
            <div>
                <h3 class="font-bold text-lg">${day.name}</h3>
                <p class="text-xs text-gray-500">${day.exercises.length} Exercícios</p>
            </div>
            <div class="bg-blue-600 rounded-full p-2">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function startWorkout(planKey, dayIndex) {
    const plan = WORKOUT_PLANS[planKey];
    const day = plan.days[dayIndex];
    
    appState.activeWorkout = {
        planName: plan.name,
        dayName: day.name,
        exercises: day.exercises.map(ex => ({
            name: ex,
            sets: [{weight: '', reps: '', rpe: ''}] // Começa com 1 set vazio
        })),
        startTime: Date.now()
    };
    router('active_session');
}

function renderActiveSession(container) {
    const workout = appState.activeWorkout;
    let html = `<div class="fade-in pb-24">
        <div class="flex justify-between items-end mb-4">
            <div>
                <h2 class="text-xl font-bold text-white">${workout.dayName}</h2>
                <p class="text-xs text-blue-400" id="timer">00:00</p>
            </div>
            <button onclick="finishWorkout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">FINALIZAR</button>
        </div>`;

    workout.exercises.forEach((ex, exIndex) => {
        html += `<div class="card border border-gray-700">
            <h3 class="font-bold text-lg mb-2 text-blue-300">${ex.name}</h3>
            
            <div class="grid grid-cols-4 gap-2 text-xs text-gray-500 mb-1 text-center">
                <span>KG</span>
                <span>REPS</span>
                <span>RPE (1-10)</span>
                <span></span>
            </div>

            <div id="sets-container-${exIndex}">`;
            
        ex.sets.forEach((set, setIndex) => {
            html += renderSetRow(exIndex, setIndex, set);
        });

        html += `</div>
            <button onclick="addSet(${exIndex})" class="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-blue-300 font-bold">+ Adicionar Série</button>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
    
    // Iniciar Timer
    if(!window.workoutTimer) {
        window.workoutTimer = setInterval(() => {
            const diff = Math.floor((Date.now() - appState.activeWorkout.startTime) / 1000);
            const m = Math.floor(diff / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            const el = document.getElementById('timer');
            if(el) el.innerText = `${m}:${s}`;
        }, 1000);
    }
}

function renderSetRow(exIndex, setIndex, setVal) {
    return `
    <div class="grid grid-cols-4 gap-2 mb-2 items-center">
        <input type="number" placeholder="kg" value="${setVal.weight}" onchange="updateSet(${exIndex}, ${setIndex}, 'weight', this.value)">
        <input type="number" placeholder="reps" value="${setVal.reps}" onchange="updateSet(${exIndex}, ${setIndex}, 'reps', this.value)">
        <input type="number" placeholder="7-10" value="${setVal.rpe}" max="10" class="${setVal.rpe >= 9 ? 'text-red-400 border-red-900' : ''}" onchange="updateSet(${exIndex}, ${setIndex}, 'rpe', this.value)">
        <button onclick="removeSet(${exIndex}, ${setIndex})" class="text-red-500 font-bold text-xl">&times;</button>
    </div>`;
}

// --- LÓGICA DE INPUT E DADOS ---

window.updateSet = (exIndex, setIndex, field, value) => {
    appState.activeWorkout.exercises[exIndex].sets[setIndex][field] = value;
};

window.addSet = (exIndex) => {
    const prevSet = appState.activeWorkout.exercises[exIndex].sets[appState.activeWorkout.exercises[exIndex].sets.length - 1];
    // Copia os dados do set anterior para facilitar
    appState.activeWorkout.exercises[exIndex].sets.push({...prevSet}); 
    router('active_session'); // Re-renderiza (bruto, mas funciona para vanilla)
};

window.removeSet = (exIndex, setIndex) => {
    if(appState.activeWorkout.exercises[exIndex].sets.length > 1) {
        appState.activeWorkout.exercises[exIndex].sets.splice(setIndex, 1);
        router('active_session');
    }
};

window.finishWorkout = () => {
    if(!confirm("Finalizar treino e gerar relatório?")) return;
    clearInterval(window.workoutTimer);
    window.workoutTimer = null;
    
    const workout = appState.activeWorkout;
    workout.endTime = Date.now();
    workout.duration = Math.floor((workout.endTime - workout.startTime) / 1000 / 60); // min
    
    // ANÁLISE CRÍTICA (O ALGORITMO)
    const analysis = analyzeWorkout(workout);
    
    // Salvar
    workout.analysis = analysis;
    appState.history.unshift(workout);
    localStorage.setItem('hyperHistory', JSON.stringify(appState.history));
    
    appState.activeWorkout = null;
    router('result', workout);
};

// --- O JUIZ SINCERO (ALGORITMO) ---
function analyzeWorkout(workout) {
    let totalSets = 0;
    let hardSets = 0; // RPE >= 7
    let failureSets = 0; // RPE >= 9
    let totalVolume = 0;
    let missedData = 0;

    workout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
            if(!set.weight || !set.reps) {
                missedData++;
                return;
            }
            const w = parseFloat(set.weight);
            const r = parseFloat(set.reps);
            const rpe = parseFloat(set.rpe) || 0;

            totalSets++;
            totalVolume += w * r;

            if(rpe >= 7) hardSets++;
            if(rpe >= 9) failureSets++;
        });
    });

    // Calcular Nota
    let score = 0;
    let feedback = [];
    let grade = "C";

    // 1. Consistência
    if(missedData > 0) feedback.push("❌ Você esqueceu de anotar cargas em alguns exercícios.");
    
    // 2. Intensidade (RPE) - O mais importante cientificamente
    const intensityRatio = totalSets > 0 ? hardSets / totalSets : 0;
    
    if (intensityRatio >= 0.8) {
        score += 40;
        feedback.push("🔥 Intensidade Excelente! A maioria das séries foi efetiva.");
    } else if (intensityRatio >= 0.5) {
        score += 20;
        feedback.push("⚠️ Intensidade Média. Muitas séries longe da falha (Junk Volume).");
    } else {
        feedback.push("💩 Intensidade Baixa. Você foi treinar ou passear? Aumente a carga.");
    }

    // 3. Volume
    if(totalSets >= 10 && totalSets <= 25) {
        score += 30;
        feedback.push("✅ Volume de treino dentro do ideal por sessão.");
    } else if (totalSets < 10) {
        feedback.push("📉 Volume baixo. Poderia ter feito mais exercícios.");
    } else {
        feedback.push("🛑 Volume excessivo. Cuidado com o overtraining.");
    }

    // 4. Falha
    if (failureSets > 0) {
        score += 30;
        feedback.push("💪 Você atingiu a falha técnica em algumas séries. Ótimo estímulo.");
    }

    // Gerar Conceito
    if (score >= 90) grade = "S (GOD)";
    else if (score >= 70) grade = "A (Bom)";
    else if (score >= 50) grade = "B (Médio)";
    else if (score >= 30) grade = "C (Fraco)";
    else grade = "D (Vergonhoso)";

    return { grade, feedback, totalVolume, totalSets };
}

function renderResult(container, workout) {
    const colorClass = workout.analysis.grade.includes('S') || workout.analysis.grade.includes('A') ? 'text-green-400' : (workout.analysis.grade.includes('D') ? 'text-red-500' : 'text-yellow-400');

    let html = `<div class="fade-in pb-20 pt-4 text-center">
        <h2 class="text-3xl font-bold mb-2">Relatório Brutal</h2>
        <p class="text-gray-400 mb-6">Duração: ${workout.duration} min</p>

        <div class="card bg-gray-800 border-2 border-gray-600 mb-6">
            <p class="text-sm text-gray-400 uppercase tracking-widest mb-2">Sua Nota</p>
            <h1 class="text-6xl font-black ${colorClass}">${workout.analysis.grade}</h1>
        </div>

        <div class="text-left space-y-3 mb-8">
            ${workout.analysis.feedback.map(f => `<p class="p-3 bg-gray-800 rounded border-l-4 border-blue-500 text-sm">${f}</p>`).join('')}
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="card bg-gray-800">
                <p class="text-xs text-gray-500">Volume Total</p>
                <p class="text-xl font-bold text-white">${(workout.analysis.totalVolume / 1000).toFixed(1)} <span class="text-sm text-gray-500">ton</span></p>
            </div>
            <div class="card bg-gray-800">
                <p class="text-xs text-gray-500">Séries Totais</p>
                <p class="text-xl font-bold text-white">${workout.analysis.totalSets}</p>
            </div>
        </div>

        <button onclick="router('home')" class="w-full bg-blue-600 py-4 rounded-xl font-bold text-white shadow-lg text-lg">VOLTAR AO INÍCIO</button>
    </div>`;

    container.innerHTML = html;
}

function renderHistory(container) {
    if(appState.history.length === 0) {
        container.innerHTML = `<div class="fade-in text-center mt-20 text-gray-500"><p>Nenhum treino realizado ainda.</p><p>Vá puxar ferro!</p></div>`;
        return;
    }

    let html = `<div class="fade-in space-y-4 pb-20">
        <h2 class="text-2xl font-bold mb-4">Seu Histórico</h2>`;
        
    appState.history.forEach(w => {
        html += `
        <div class="card">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-white">${w.dayName}</h3>
                    <p class="text-xs text-gray-400">${new Date(w.startTime).toLocaleDateString()} • ${w.duration} min</p>
                </div>
                <div class="text-right">
                    <span class="text-xl font-bold ${w.analysis.grade.includes('A') || w.analysis.grade.includes('S') ? 'text-green-400' : 'text-yellow-400'}">${w.analysis.grade}</span>
                </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">Volume: ${(w.analysis.totalVolume/1000).toFixed(1)} ton</p>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function renderSettings(container) {
    const totalWorkouts = appState.history.length;
    const totalTons = appState.history.reduce((acc, curr) => acc + curr.analysis.totalVolume, 0) / 1000;
    
    container.innerHTML = `<div class="fade-in pb-20">
        <h2 class="text-2xl font-bold mb-6">Estatísticas Gerais</h2>
        
        <div class="card text-center py-8">
            <p class="text-4xl font-bold text-blue-500">${totalWorkouts}</p>
            <p class="text-gray-400 uppercase text-xs tracking-widest">Treinos Concluídos</p>
        </div>

        <div class="card text-center py-8">
            <p class="text-4xl font-bold text-purple-500">${totalTons.toFixed(1)}</p>
            <p class="text-gray-400 uppercase text-xs tracking-widest">Toneladas Levantadas (Total)</p>
        </div>

        <div class="mt-8">
            <button onclick="if(confirm('Apagar tudo?')){localStorage.clear(); location.reload();}" class="w-full border border-red-600 text-red-500 py-3 rounded-lg font-bold">RESETAR DADOS</button>
            <p class="text-xs text-gray-600 text-center mt-2">Cuidado: Isso apaga seu histórico local.</p>
        </div>
    </div>`;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    router('home');
});
