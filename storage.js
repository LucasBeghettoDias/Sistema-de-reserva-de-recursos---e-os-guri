//Sprint 3

const DB_KEYS = {
    recursos: 'sr_recursos',
    reservas: 'sr_reservas',
    usuarios:'sr_usuarios'
};

//repositório

const repo = {
    get(key){
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
    upadateById(key, id, updater){
        const arr = repo.get(key);
        const ix = arr.findIndex(x=>x.id === id);
        if(ix >= 0){
           arr[ix]= updater(arr[ix]);
           repo.set(key, arr);
           return arr[ix];
        }
        return null;
    }
};

function seedSeNecessario(){
    if(!localStorage.getItem(DB_KEYS.recursos)){
        repo.set(DB_KEYS.recursos,[
            {id: 1, nome: 'laboratório 1', tipo: 'sala', status: 'ativo'},
            {id: 2, nome: 'laboratório 2', tipo: 'sala', status: 'ativo'},
            {id: 3, nome: 'projetor 4k', tipo: 'equip', status: 'ativo'},
            {id: 4, nome: 'espaço de reuniões', tipo: 'sala', status: 'ativo'}
        ]);
    }
    if(!localStorage.getItem(DB_KEYS.reservas)) repo.set(DB_KEYS.reservas, []);
    if(!localStorage.getItem(DB_KEYS.usuarios)) repo.set(DB_KEYS.usuarios, []);
}

//nome do recurso

function mapRecursos(){
    return Object.fromEntries(repo.get(DB_KEYS.recursos).map(r=>[r.id, r.nome]))
}

//select

function popularRecursos(){
    const sel = document.getElementById('campoRecurso');
    if(!sel) return;
    const recursos = repo.get(DB_KEYS.recursos);
    sel.innerHTML = '<option value = "">selecione...</option>' + recursos.map(r =>`<option value="${r.id}"</option>`).join('');
}

//carrega histórico

function carregaHistórico(){
   const ul = document.getElementById('listaReservas');
   if(!ul) return;
   ul.innerHTML = '';
   const recursosMap = mapRecursos();
   repo.get(DB_KEYS.reservas).forEach(r => {
       renderItemReservaPersistida(r, recursosMap);
   });
}

//sobe o seed

document.addEventListener('DOMContentLoaded',()=>{
    seedSeNecessario();
    popularRecursos();
    carregaHistórico();
})