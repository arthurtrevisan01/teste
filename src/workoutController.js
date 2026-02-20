import { state } from "./state.js";

export function createWorkout(name) {
  state.activeWorkout = {
    id: Date.now(),
    name,
    startTime: Date.now(),
    endTime: null,
    exercises: []
  };
}

export function addExercise(name) {
  state.activeWorkout.exercises.push({
    name,
    sets: []
  });
}

export function removeExercise(index) {
  state.activeWorkout.exercises.splice(index, 1);
}

export function addSet(exIndex, weight, reps, rpe) {
  state.activeWorkout.exercises[exIndex].sets.push({
    weight: Number(weight),
    reps: Number(reps),
    rpe: Number(rpe)
  });
}

export function finishWorkout() {
  state.activeWorkout.endTime = Date.now();
}
