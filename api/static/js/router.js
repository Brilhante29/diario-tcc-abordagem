import { setActiveNav } from "./ui.js";

const routes = new Map(); // "#/home" -> render

export function registerRoute(hash, renderFn) {
  routes.set(hash, renderFn);
}

export function startRouter(defaultRoute="#/home") {
  const go = () => {
    const h = location.hash || defaultRoute;
    setActiveNav(h);
    const render = routes.get(h) || routes.get(defaultRoute);
    render?.();
  };
  window.addEventListener("hashchange", go);
  go();
}
