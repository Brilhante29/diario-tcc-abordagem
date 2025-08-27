const JSON_HEADERS = { "Content-Type": "application/json" };

export async function listEntries() {
  const r = await fetch("/api/entries");
  if (!r.ok) throw new Error("Falha ao carregar histórico");
  return r.json();
}

export async function createEntry(payload) {
  const r = await fetch("/api/entries", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Falha ao salvar");
  return r.json();
}
