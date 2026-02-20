const KEY = "hyperGymData";

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function load() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { history: [] };
}
