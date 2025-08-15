import { bindDrawer, bindNav } from "./ui.js";
import { registerRoute, startRouter } from "./router.js";
import { HomeView } from "./views/home.js";
import { HistoricoView } from "./views/historico.js";
import { AnalisesView } from "./views/analises.js";
import { initTheme } from "./theme.js";

function init() {
  bindDrawer();
  bindNav((route) => (location.hash = route));
  initTheme();

  const main = document.getElementById("main");
  registerRoute("#/home",      () => HomeView(main));
  registerRoute("#/historico", () => HistoricoView(main));
  registerRoute("#/analises",  () => AnalisesView(main));

  startRouter("#/home");
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
