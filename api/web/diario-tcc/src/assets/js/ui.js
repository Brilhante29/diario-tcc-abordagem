import { $, $$ } from "./dom.js";

function refs() {
  return {
    drawer: document.getElementById("drawer"),
    scrim: document.getElementById("scrim"),
    btnMenu: document.getElementById("btnMenu"),
    btnClose: document.getElementById("btnClose"),
    toast: document.getElementById("toast"),
  };
}

export function openDrawer() {
  const { drawer, scrim, btnMenu } = refs();
  if (!drawer || !scrim) return;
  drawer.classList.add("open");
  scrim.classList.add("show");
  btnMenu?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

export function closeDrawer() {
  const { drawer, scrim, btnMenu } = refs();
  if (!drawer || !scrim) return;
  drawer.classList.remove("open");
  scrim.classList.remove("show");
  btnMenu?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

export function bindDrawer() {
  const { drawer, scrim, btnMenu, btnClose } = refs();

  btnMenu?.addEventListener("click", openDrawer);
  btnMenu?.addEventListener("touchstart", (e) => { e.preventDefault(); openDrawer(); }, { passive: false });

  btnClose?.addEventListener("click", closeDrawer);
  btnClose?.addEventListener("touchstart", (e) => { e.preventDefault(); closeDrawer(); }, { passive: false });

  scrim?.addEventListener("click", closeDrawer);
  scrim?.addEventListener("touchstart", (e) => { e.preventDefault(); closeDrawer(); }, { passive: false });

  drawer?.addEventListener("click", (e) => {
    const item = e.target.closest(".nav__item");
    if (item) closeDrawer();
  });

  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
}

export function setActiveNav(route) {
  $$(".nav__item").forEach((i) => i.classList.toggle("active", i.dataset.route === route));
}

export function bindNav(onNavigate) {
  $$(".nav__item").forEach((i) =>
    i.addEventListener("click", () => {
      const route = i.dataset.route;
      if (route === "#/analises") showToast("Em breve ✨");
      onNavigate(route);
    })
  );
}

export function showToast(msg) {
  const { toast } = refs();
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

export function skeletonList(count = 3) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "skeleton";
    s.style.margin = "10px 0";
    frag.appendChild(s);
  }
  return frag;
}
