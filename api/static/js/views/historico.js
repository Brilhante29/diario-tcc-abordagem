// views/historico.js
import { $, el, escapeHtml } from "../dom.js";
import { listEntries } from "../api.js";
import { skeletonList } from "../ui.js";

const tzDisplay = "America/Fortaleza";
const fmtDateTime = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: tzDisplay });

const MODE_KEY = "tcc.hist.mode";
const MODES = ["semana", "mes", "ano", "tudo"];

let cache = null; // mantém entradas carregadas durante a sessão

// ---------- helpers de período ----------
function startOfWeekMon(d){
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7;       // 0 = segunda
  x.setDate(x.getDate() - dow);
  x.setHours(0,0,0,0);
  return x;
}
function startOfMonth(d){
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0,0,0,0);
  return x;
}
function startOfYear(d){
  const x = new Date(d.getFullYear(), 0, 1);
  x.setHours(0,0,0,0);
  return x;
}
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function addMonths(d, n){ const x = new Date(d); x.setMonth(x.getMonth()+n); return x; }
function addYears(d, n){ const x = new Date(d); x.setFullYear(x.getFullYear()+n); return x; }

function rangeFor(mode, ref){
  if (mode === "semana"){
    const start = startOfWeekMon(ref);
    const end   = addDays(start, 7);
    return { start, end };
  }
  if (mode === "mes"){
    const start = startOfMonth(ref);
    const end   = addMonths(start, 1);
    return { start, end };
  }
  if (mode === "ano"){
    const start = startOfYear(ref);
    const end   = addYears(start, 1);
    return { start, end };
  }
  // tudo
  return { start: new Date(0), end: new Date(8640000000000000) };
}
function inRangeISO(iso, start, end){
  const t = new Date(iso);
  return t >= start && t < end;
}

function labelFor(mode, ref){
  if (mode === "tudo") return "Tudo";
  if (mode === "ano")  return ref.toLocaleDateString("pt-BR", { year: "numeric" });
  if (mode === "mes")  return ref.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  // semana
  const { start, end } = rangeFor("semana", ref);
  const endInc = new Date(end.getTime() - 1);
  const a = start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const b = endInc.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return `Semana ${a} – ${b}`;
}

function nextRef(mode, ref, delta){
  if (mode === "semana") return addDays(ref, 7 * delta);
  if (mode === "mes")    return addMonths(ref, delta);
  if (mode === "ano")    return addYears(ref, delta);
  return ref;
}

// ---------- view ----------
export function HistoricoView(root){
  const savedMode = localStorage.getItem(MODE_KEY);
  const state = {
    mode: MODES.includes(savedMode) ? savedMode : "mes",
    ref: new Date(), // referência (hoje)
  };

  root.innerHTML = `
    <section aria-labelledby="hist-title">
      <h1 id="hist-title" class="section-title">🗂️ Histórico</h1>

      <div class="card toolbar">
        <div class="seg" role="tablist" aria-label="Filtro de período">
          <button class="seg__btn" data-mode="semana" role="tab">Semana</button>
          <button class="seg__btn" data-mode="mes" role="tab">Mês</button>
          <button class="seg__btn" data-mode="ano" role="tab">Ano</button>
          <button class="seg__btn" data-mode="tudo" role="tab">Tudo</button>
        </div>

        <div class="period-nav">
          <button id="prevPeriod" class="iconbtn" aria-label="Período anterior">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          </button>
          <div id="periodLabel" class="small"></div>
          <button id="nextPeriod" class="iconbtn" aria-label="Próximo período">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      <div id="lista"></div>
    </section>
  `;

  // ativa botão da segmentação
  function syncSeg(){
    document.querySelectorAll(".seg__btn").forEach(b=>{
      const on = b.dataset.mode === state.mode;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    $("#periodLabel").textContent = labelFor(state.mode, state.ref);
    const disableNav = state.mode === "tudo";
    $("#prevPeriod").disabled = disableNav;
    $("#nextPeriod").disabled = disableNav;
  }

  async function ensureData(){
    if (!cache) {
      const lista = $("#lista");
      lista.innerHTML = "";
      lista.appendChild(skeletonList(4));
      cache = await listEntries();
    }
  }

  function renderList(){
    const lista = $("#lista");
    if (!Array.isArray(cache)) return;

    const { start, end } = rangeFor(state.mode, state.ref);
    const filtered = (state.mode === "tudo" ? cache : cache.filter(e => inRangeISO(e.created_at, start, end)))
      .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));

    lista.innerHTML = "";
    if (!filtered.length){
      lista.appendChild(el("div", { className:"card" }, [
        "Nenhuma entrada neste período.",
        el("div", { className:"small", style:"margin-top:6px;" }, ["Altere o filtro ou navegue entre períodos."])
      ]));
      return;
    }

    for (const e of filtered){
      const card = el("div", { className: "entry" });
      card.innerHTML = `
        <div class="stamp">Incluída em: <strong>${fmtDateTime(e.created_at)}</strong></div>
        <div><strong>Situação:</strong> ${escapeHtml(e.situacao)}</div>
        <div class="small"><strong>Sentimentos:</strong> ${escapeHtml(e.sentimentos)}</div>
        <div class="small"><strong>Pensamentos:</strong> ${escapeHtml(e.pensamentos)}</div>
        <div class="small"><strong>Fatos base:</strong> ${escapeHtml(e.fatos)}</div>
        <div class="small"><strong>Plano/Resolução:</strong> ${escapeHtml(e.resolucao || "-")}</div>
        <div class="small"><strong>Observações (padrões/gatilhos):</strong> ${escapeHtml(e.observacoes || "-")}</div>
      `;
      lista.appendChild(card);
    }
  }

  // eventos
  root.querySelectorAll(".seg__btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.mode = btn.dataset.mode;
      localStorage.setItem(MODE_KEY, state.mode);
      syncSeg();
      renderList();
    });
  });
  $("#prevPeriod").addEventListener("click", ()=>{
    state.ref = nextRef(state.mode, state.ref, -1);
    syncSeg(); renderList();
  });
  $("#nextPeriod").addEventListener("click", ()=>{
    state.ref = nextRef(state.mode, state.ref, +1);
    syncSeg(); renderList();
  });

  // inicialização
  syncSeg();
  ensureData().then(renderList).catch(()=>{
    const lista = $("#lista");
    lista.innerHTML = "";
    lista.appendChild(el("div",{className:"card"},["Não foi possível carregar agora. Tente mais tarde."]));
  });
}
