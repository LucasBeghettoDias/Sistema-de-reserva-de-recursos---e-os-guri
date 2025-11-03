/* =========================
   storage.js – Sprint 3
   Repositório local + seed
   -------------------------
   Por quê? Separar a responsabilidade de persistência
   para antecipar a arquitetura MVC nas próximas sprints.
   ========================= */

/** Chaves usadas no localStorage (um pequeno “schema” do front) */
const DB_KEYS = {
  recursos: 'sr_recursos',
  reservas: 'sr_reservas',
  usuarios: 'sr_usuarios'
};

/** Repositório minimalista para manipular arrays no localStorage */
const repo = {
  get(key){
    // Lê a coleção; se não existir, retorna array vazio
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  set(key, arr){
    localStorage.setItem(key, JSON.stringify(arr));
  },
  push(key, item){
    const arr = repo.get(key);
    arr.push(item);
    repo.set(key, arr);
    return item;
  },
  updateById(key, id, updater){
    const arr = repo.get(key);
    const ix = arr.findIndex(x => x.id === id);
    if (ix >= 0) {
      arr[ix] = updater(arr[ix]);
      repo.set(key, arr);
      return arr[ix];
    }
    return null;
  }
};

/** SPRINT 3: dados iniciais (seed) — executa uma única vez por navegador */
function seedSeNecessario(){
  if(!localStorage.getItem(DB_KEYS.recursos)){
    repo.set(DB_KEYS.recursos, [
      { id: 1, nome: 'Laboratório 01', tipo: 'sala',  status: 'ativo' },
      { id: 2, nome: 'Laboratório 02', tipo: 'sala',  status: 'ativo' },
      { id: 3, nome: 'Projetor 4K',    tipo: 'equip', status: 'ativo' },
      { id: 4, nome: 'Espaço Reuniões',tipo: 'sala',  status: 'ativo' }
    ]);
  }
  if(!localStorage.getItem(DB_KEYS.reservas)) repo.set(DB_KEYS.reservas, []);
  if(!localStorage.getItem(DB_KEYS.usuarios)) repo.set(DB_KEYS.usuarios, []);
}
//CONSERTO DE CARREGAMENTO DE CONFLITO NO HISTÓRICO
function normalizarReservasAntigas() {
  const arr = repo.get(DB_KEYS.reservas);
  if (!Array.isArray(arr)) return;

  let mudou = false;

  const pad = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return hhmm;
    const [h = '0', m = '0'] = hhmm.split(':');
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  };

  arr.forEach(r => {
    // migra 'recurso' -> 'recursoId'
    if (r.recurso && !r.recursoId) { r.recursoId = Number(r.recurso); delete r.recurso; mudou = true; }

    // garante tipo numérico em recursoId
    if (typeof r.recursoId === 'string') { r.recursoId = Number(r.recursoId); mudou = true; }

    // padroniza horas
    const hi = pad(r.horaInicio);
    const hf = pad(r.horaFim);
    if (hi !== r.horaInicio) { r.horaInicio = hi; mudou = true; }
    if (hf !== r.horaFim)    { r.horaFim    = hf; mudou = true; }

    // status padrão
    if (!r.status) { r.status = 'pendente'; mudou = true; }
  });

  if (mudou) repo.set(DB_KEYS.reservas, arr);
}










/** Mapa id->nome de recursos (evita ficar procurando a cada render) */
function mapRecursos(){
  return Object.fromEntries(repo.get(DB_KEYS.recursos).map(r => [r.id, r.nome]));
}

/** Preenche o <select id="campoRecurso"> dinamicamente com os recursos do “banco” */
function popularRecursos(){
  const sel = document.getElementById('campoRecurso');
  if(!sel) return;
  const recursos = repo.get(DB_KEYS.recursos);
  sel.innerHTML = '<option value="">Selecione...</option>' + recursos
    .map(r => `<option value="${r.id}">${r.nome}</option>`)
    .join('');
}

/** Carrega o histórico de reservas da “base” para a UI */
function carregarHistorico(){
  const ul = document.getElementById('listaReservas');
  if(!ul) return;
  ul.innerHTML = '';
  const recursosMap = mapRecursos();
  repo.get(DB_KEYS.reservas).forEach(r => {
    renderItemReservaPersistida(r, recursosMap);
  });
}

/* Sobe o seed e popula UI assim que o DOM estiver pronto */
document.addEventListener('DOMContentLoaded', () => {
  seedSeNecessario();
  popularRecursos();
  carregarHistorico();
});
