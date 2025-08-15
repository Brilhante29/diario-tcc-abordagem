import { $, autoResizeTextarea } from "../dom.js";
import { createEntry } from "../api.js";

export function HomeView(root){
  root.innerHTML = `
    <section aria-labelledby="home-title">
      <h1 id="home-title" class="section-title">📔 Externalização</h1>
      <div class="card">
        <label for="situacao">Situação vivida</label>
        <textarea id="situacao" placeholder="Descreva a situação..."></textarea>

        <label for="sentimentos">Como você se sentiu?</label>
        <textarea id="sentimentos" placeholder="Emoções, sensações físicas..."></textarea>

        <label for="pensamentos">Quais foram os pensamentos?</label>
        <textarea id="pensamentos" placeholder="Pensamentos automáticos..."></textarea>

        <label for="fatos">Em quais fatos esses pensamentos se baseiam?</label>
        <textarea id="fatos" placeholder="Evidências observáveis..."></textarea>

        <label for="resolucao">Você pode resolver a situação? Se sim, como?</label>
        <textarea id="resolucao" placeholder="Plano prático..."></textarea>

        <label for="observacoes">O que tem observado nos seus pensamentos? (padrões, gatilhos)</label>
        <textarea id="observacoes" placeholder="Padrões, gatilhos, contextos..."></textarea>

        <button id="btnSalvar" class="btn">Salvar entrada</button>
        <div id="feedback" class="small" style="margin-top:10px;display:none;color:#1b6a60;">Entrada salva com carinho. 💚</div>
      </div>
    </section>
  `;

  ["situacao","sentimentos","pensamentos","fatos","resolucao","observacoes"]
    .forEach(id => autoResizeTextarea(document.getElementById(id)));

  const btn = $("#btnSalvar");
  const fb  = $("#feedback");

  btn?.addEventListener("click", async ()=>{
    const payload = {
      situacao: $("#situacao")?.value.trim() || "",
      sentimentos: $("#sentimentos")?.value.trim() || "",
      pensamentos: $("#pensamentos")?.value.trim() || "",
      fatos: $("#fatos")?.value.trim() || "",
      resolucao: $("#resolucao")?.value.trim() || "",
      observacoes: $("#observacoes")?.value.trim() || ""
    };

    if (!payload.situacao || !payload.sentimentos || !payload.pensamentos || !payload.fatos){
      alert("Preencha ao menos: Situação, Sentimentos, Pensamentos e Fatos.");
      return;
    }

    btn.disabled = true;
    try{
      await createEntry(payload);
      if (fb){ fb.style.display = "block"; setTimeout(()=> fb.style.display = "none", 2200); }
      document.querySelectorAll("textarea").forEach(t => { t.value=""; t.style.height=""; });
      location.hash = "#/historico";
    } catch(e){
      alert("Não foi possível salvar. Tente novamente.");
    } finally {
      btn.disabled = false;
    }
  });
}
