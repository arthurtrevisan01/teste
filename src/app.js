import { state } from "./state.js";
import { load } from "./storage.js";
import { render } from "./ui.js";

const app = document.getElementById("app");

const data = load();
state.history = data.history;

render(app);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
