import { state } from "./state.js";
import { createWorkout, addExercise, removeExercise, addSet, finishWorkout } from "./workoutController.js";
import { analyzeWorkout } from "./analysis.js";
import { save } from "./storage.js";

export function render(app) {
  if (!state.activeWorkout) {
    renderStart(app);
  } else {
    renderWorkout(app);
  }
}

function renderStart(app) {
  app.innerHTML = `
    <div class="container">
      <h1>HyperScience Gym</h1>
      <input id="workoutName" placeholder="Nome do treino"/>
      <button id="startBtn">Iniciar Treino</button>
    </div>
  `;

  document.getElementById("startBtn").onclick = () => {
    const name = document.getElementById("workoutName").value;
    if (!name) return;
    createWorkout(name);
    render(app);
  };
}

function renderWorkout(app) {
  app.innerHTML = `
    <div class="container">
      <h2>${state.activeWorkout.name}</h2>
      <div id="exerciseList"></div>
      <input id="exerciseName" placeholder="Novo exercício"/>
      <button id="addExerciseBtn">Adicionar Exercício</button>
      <button id="finishBtn">Finalizar Treino</button>
    </div>
  `;

  const list = document.getElementById("exerciseList");

  state.activeWorkout.exercises.forEach((ex, i) => {
    const div = document.createElement("div");
    div.className = "exercise-card";
    div.innerHTML = `
      <h3>${ex.name}</h3>
      <button class="removeBtn">Remover Exercício</button>
      <input placeholder="Peso"/>
      <input placeholder="Reps"/>
      <input placeholder="RPE"/>
      <button class="addSetBtn">Adicionar Série</button>
      <ul>
        ${ex.sets.map(s => `<li>${s.weight}kg x ${s.reps} (RPE ${s.rpe})</li>`).join("")}
      </ul>
    `;

    div.querySelector(".removeBtn").onclick = () => {
      removeExercise(i);
      render(app);
    };

    div.querySelector(".addSetBtn").onclick = () => {
      const inputs = div.querySelectorAll("input");
      addSet(i, inputs[0].value, inputs[1].value, inputs[2].value);
      render(app);
    };

    list.appendChild(div);
  });

  document.getElementById("addExerciseBtn").onclick = () => {
    const name = document.getElementById("exerciseName").value;
    if (!name) return;
    addExercise(name);
    render(app);
  };

  document.getElementById("finishBtn").onclick = () => {
    finishWorkout();
    const report = analyzeWorkout(state.activeWorkout);
    state.history.push(state.activeWorkout);
    save(state);
    state.activeWorkout = null;

    app.innerHTML = `
      <div class="container">
        <h2>Relatório</h2>
        <p>Duração: ${report.durationMin} min</p>
        <p>Volume Total: ${report.totalVolume} kg</p>
        <p>Média RPE: ${report.avgRPE}</p>
        <p>Densidade: ${report.density} kg/min</p>
        <p>Hard Sets: ${report.hardRatio}%</p>
        <button onclick="location.reload()">Novo Treino</button>
      </div>
    `;
  };
}
