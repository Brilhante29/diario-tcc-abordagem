const THEME_KEY = "tcc.theme";

export function systemTheme(){
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
export function savedTheme(){
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}
export function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
  updateThemeButton(theme);
}
export function initTheme(){
  const initial = savedTheme() || systemTheme();
  applyTheme(initial);

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e=>{
    if (!savedTheme()) applyTheme(e.matches ? "dark" : "light");
  });

  const btn = document.getElementById("btnTheme");
  if (btn){
    btn.addEventListener("click", toggleTheme);
    updateThemeButton(initial);
  }
}
export function toggleTheme(){
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  const next = cur === "light" ? "dark" : "light";
  applyTheme(next);
}
function updateThemeButton(theme){
  const btn = document.getElementById("btnTheme");
  if (!btn) return;
  btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  btn.innerHTML = theme === "dark"
    ? `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4V2M12 22v-2M4.93 4.93L3.51 3.51M20.49 20.49l-1.42-1.42M22 12h-2M4 12H2M19.07 4.93l1.42-1.42M3.51 20.49l1.42-1.42M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" fill="currentColor"/></svg>`;
}
