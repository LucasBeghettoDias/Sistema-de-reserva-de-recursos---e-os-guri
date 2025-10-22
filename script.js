/*
SCRIPT DO SPRINT 01
*/

/*
SCRIPT DO SPRINT 02
MANTÉM O QUE HAVIA NO SPRINT 1 E ADICIONA FLUXO FUNCIONAL
*/
// 1) TOAST ACESSÍVEL (feedback não bloqueante)
//Por quê? Substitui o alert() por UX moderna e acessível
const $toast = document.getElementById('toast');

let __toastTimer = null;

function mostrarToast(mensagem, tipo = 'ok') {
    //fallback se $toast não existir (ambiente antigo)
    if (!$toast) {
        alert(mensagem);
        return;
    }

    $toast.classList.remove('warn', 'err', 'visivel');
    if (tipo === 'warn') $toast.classList.add('warn');
    if (tipo === 'err') $toast.classList.add('err');
    $toast.textContent = mensagem;

    void $toast.offsetWidth;
    $toast.classList.add('visivel');

    clearTimeout(__toastTimer);
    __toastTimer = setTimeout(() => $toast.classList.remove('visivel'), 2800);

}


/* ==========================================
   1) FUNÇÕES ORIGINAIS - Sprint 1 (mantidas)
   ==========================================
 */

//abre o modal
function abrirLogin() {
    const modal = document.getElementById("modalLogin");
    if (modal && typeof modal.showModal === "function") {
        modal.showModal();
    } else {
        //ALTERAÇÃO SPRINT 2: usar toast no lugar de alert, quando possível
        mostrarToast("Modal não suportado neste navegador", "warn");
    }
}

//rola suavemente até formulário rápido
function rolarParaRapido() {
    const formRapido = document.querySelector(".formRapido");
    if (formRapido) {
        formRapido.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

//validação simples da reserva rápida
//fluxo do sprint 2 - Login - Pesquisa - Solicitar
(function inicializarValidacao() {
    const form = document.querySelector(".formRapido");
    if (!form) return;

    const seletorRecurso = form.querySelector("select");
    const campoData = form.querySelector('input[type="date"]');
    const campoInicio = form.querySelector('input[placeholder="Início"]');
    const campoFim = form.querySelector('input[placeholder="Fim"]');

    //remover a marcação de erro ao digitar/mudar
    [seletorRecurso, campoData, campoInicio, campoFim].forEach(el => {
        if (!el) return;
        el.addEventListener("input", () => el.style.borderColor = "");
        el.addEventListener("change", () => el.style.borderColor = "");
    });

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();

        let valido = true;

        //valida recurso selecionado
        if (seletorRecurso && seletorRecurso.selectIndex === 0) {
            seletorRecurso.style.borderColor = "red";
            valido = false;
        }

        //valida data 
        if (campoData && !campoData.value) {
            campoData.style.borderColor = "red";
            valido = false;
        }

        //valida horários
        const hInicio = campoInicio?.value || "";
        const hFim = campoFim?.value || "";

        if (!hInicio) {
            campoInicio.style.borderColor = "red";
            valido = false
        }

        if (!hFim) {
            campoFim.style.borderColor = "red";
            valido = false;
        }

        if (hInicio && hFim && hFim <= hInicio) {
            campoInicio.style.borderColor = "red";
            campoFim.style.borderColor = "red";
            //ALTERAÇÃO SPRIN 2 - Trocar alert pelo toast
            mostrarToast("O horário final precisa ser maior que o horário inicial", "warn");
            return;
        }

        if (!valido) {
            mostrarToast("Por favor, preencha todos os campos obrigatórios.", "warn")
            return;
        }

        //sucesso (simulado)
        mostrarToast("Reserva simulada com sucesso! (fluxo rápido/legado)");
        form.reset();
    });
})();

/*================================================
  2) AJUDANTES E ESTADO (Sprint 2)
  ------------------------------------------------
  Por quê? Preparar 'estado mínimo' e leitura por FormData
  =================================================*/

//ALTERAÇÃO DO SPRINT 2:helper para transformar FormData em objetos simples
function dadosDoForm(form) {
    return Object.fromEntries(new FormData(form).entries());
}

//ALTERAÇÃO SPRINT 2: estado mínimo de aplicação (simulado)
let usuarioAtual = null; //{login, professor:boolean}
let ultimoFiltroPesquisa = null; //{recurso, data, horário}
const reservas = []; //histórico em memória

/*================================================
  3) MENU ATIVO POR HASH (acessibilidade) (Sprint 2)
  ------------------------------------------------
  Por quê? Destacar a seção atual sem roteador.
  =================================================*/

//ALTERAÇÃO DO SPRINT 2:destacar link ativo do menu
const menuLinks = document.querySelectorAll('.menu a, header .acoesNav a');
function atualizarMenuAtivo() {
    const hash = location.hash || '#secLogin';
    menuLinks.forEach(a => {
        const ativo = a.getAttribute('href') === hash;
        a.setAttribute('aria-current', ativo ? 'true' : 'false');
    });
}
window.addEventListener('hashchange', atualizarMenuAtivo);
document.addEventListener('DOMContentLoaded', atualizarMenuAtivo);

/*================================================
  4) FLUXO LOGIN - PESQUISA - SOLICITAR - HISTÓRICO (Sprint 2)
  ------------------------------------------------
  Por quê? Implementar o fluxo da Sprint 2, com RN simulada:
  usuários cujo login coNTÉM "prof" com aprovação automática
  na solicitação
  =================================================*/

//ALTERAÇÃO DO SPRINT 2: seletores das seções
const formLogin = document.getElementById('formLogin');
const formPesquisa = document.getElementById('formPesquisa');
const formSolicitar = document.getElementById('formSolicitar');
const listaReservas = document.getElementById('listaReservas');

// sprint 3 - regras novas

// adiciona 1h ao horário ""HH:MM" para fim padrão
function adicionar1Hora(hhmm){
    const [h,m] = (hhmm || '00:00').split(':').map(Number);
    const d = new Date();
    d.setHours(h,m,0,0)
    d.setMinutes(d.getMinutes()+60);
    return d.toTimeString().slice(0,5)
}

// adiciona RN2 (detecção de conflitos)
// não há conflito, quando termina antes do outro começar
function hConflito({recursoId, data, horaInicio, horaFim}){
    const existentes = repo.get(DB_KEYS.reservas).filter(r.recursoId === recursoId && r.data === data && r.status !== 'cancelada');
    return rxistentes.some(r=>!(r.horaFim<=horaInicio || r.horaInicio>=horaFim))
}

//Render a partir do banco 

function renderItemReservaPersistida(r, recursosMap = null){
    if(listaReservas) return;
    const recursos = recursosMap || Object.fromEntries(repo.get(DB_KEYS.recursos).map(rr =>[rr.id,rr.nome]));
    const quando = `${r.data.split('-').reverse().join('/')} - ${r.horaInicio} - ${r.horaFim}`;
    const li = document.createElement('li');

    const simbolo = r.status === 'aprovada' ? 'ticado':r.status === 'cancelada' ? 'xis':'ampulheta';
    li.innerHTML = `
    <span><strong>${recursos[r.recurso.id] || r.recursoId}</strong> - ${quando} </span>
    <span>${simbolo} ${r.status.chatAt(0).toUpperCase() + r.status.slice(1)}</span>`;

    if(r.status === 'cancelada'){
        li.setAttribute('aria-disabled','true');
    }

    //cancelamento

    li.addEventListener('click', ()=>{
        if(r.status === 'cancelada') return;
        r.status === 'cancelada';

        repo.updateByid(DB_KEYS.reservas,r.id,()=>r);

        li.lastElementChild.textContent = 'xis cancelada';
        li.setAttribute('aria-disabled','true');
        mostrarToast('reserva cancelada','warn');
    })

    listaReservas.appendChild(li);
}

//4.1 - LOGIN
//Valida credenciais simples e define perfil simulado
formLogin?.addEventListener('submit',(e)=>{
    e.preventDefault();
    const {usuario,senha} = dadosDoForm(formLogin);

    if(!usuario || (senha ||'').length<3){
        mostrarToast('Usuário/senha inválidos (mín 3 caracteres)','warn');
        return;
    }

    const professor = /prof/i.test(usuario); //RN4
    usuarioAtual = {login:usuario,professor};

    mostrarToast(`Bem-vindo, ${usuarioAtual.login}!`);
    location.hash = "#secPesquisa";
    atualizarMenuAtivo();
});

//4.2 - PESQUISAR DISPONIBILIDADE
//guarda filtro pesquisa (simulação de disponibilidade)
formPesquisa?.addEventListener('submit',(e)=>{
    e.preventDefault();

    if(!usuarioAtual){
        mostrarToast("Faça login antes de pesquisar","warn");
        location.hash = "#secLogin";
        atualizarMenuAtivo();
        return;
    }

    const {recurso, data, hora}= dadosDoForm(formPesquisa);
    if(!recurso || !data || !hora){
        mostrarToast("Preencha recurso, data e horário","warn");
        return;
    }

    ultimoFiltroPesquisa = {recurso: Number(recurso), data, hora}; //sprint 3
    const quando = new Date(`${data}T${hora}`).toLocaleString('pt-br');
    mostrarToast(`Disponível: ${recurso} em ${quando}`);
    location.hash = '#secSolicitar';
    atualizarMenuAtivo();
});



//4.3 - SOLICITAR RESERVA
//aplica RN simulada e registra no histórico
formSolicitar?.addEventListener('submit',(e)=>{
    e.preventDefault();

    if(!usuarioAtual){
        mostrarToast('Faça login antes de solicitar','warn');
        location.hash="#secLogin";
        atualizarMenuAtivo();
        return;
    }

    if(!ultimoFiltroPesquisa){
        mostrarToast('Pesquise a disponibilidade antes de solicitar','warn');
        location.hash = '#secPesquisa';
        atualizarMenuAtivo();
        return;
    }

    const {justificativa} = dadosDoForm(formSolicitar);
    if(!justificativa){
        mostrarToast('Descreva a justificativa','warn');
        return;
    }

    //sprint 3
    const recursoId = Number(ultimoFiltroPesquisa.recurso);
    const data = ultimoFiltroPesquisa.data;
    const horaInicio = ultimoFiltroPesquisa.Hora;
    const horaFim = adicionar1Hora(horaInicio);

    if(hConflito({recursoId,data,horaInicio,horaFim})){
        mostrarToast("conflito; já existe reserva neste intervalo de horário",'err');
    }


    //RN4 - se login contém 'prof', aprova automaticamente
    const status = usuarioAtual.professor ?'aprovada':'pendente';

    const nova = {
        //...ultimoFiltroPesquisa,
        id: Date.now(),
        recursoId,
        usuarioId: usuarioAtual.login,
        justificativa,
        status,
        //autor:usuarioAtual.login
    };

    repo.push(DB_KEYS.reservas, nova);
    renderItemReservaPersistida(nova);
    

    reservas.push(nova);
    renderItemReserva(nova);

    mostrarToast(status==='aprovada' 
        ?'Reserva aprovada automaticamente'
        :'Reserva enviada para análise');
    
    formSolicitar.reset();
    location.hash ='#secHistorico';
    atualizarMenuAtivo();
});

//4.4 - RENDERIZAÇÃO DO HISTÓRICO
//lista simples (sem <template> para que não quebre o HTML)
function renderItemReserva({recurso,data,hora,justificativa,status}){
    if(!listaReservas) return;

    const li = document.createElement('li');
    const quando = new Date(`${data}T${hora}`).toLocaleString('pt-br');

    li.innerHTML=`
     <span><strong>${recurso}</strong> - ${quando}</span>
     <span>${status==='aprovada' 
        ? 'Aprovada': status ==='cancelada' 
        ? 'Cancelada': 'Pendente'}</span>
    `;

    //clique para cancelar
    li.addEventListener('click',()=>{
        //impedir recancelamento
        if(li.dataset.status ==='cancelada') return;
        li.dataset.status ='cancelada';
        li.lastElementChild.textContent = 'Cancelada';
        mostrarToast('Reserva cancelada','warn');
    });

    listaReservas.appendChild(li);
}

/*================================================
  5) AJUSTES FINAIS DE ARRANQUE
  ------------------------------------------------
  Por quê? Garantir que link ativo apareça já carga inicial
  =================================================*/
document.addEventListener('DOMContentLoaded',()=>{
    atualizarMenuAtivo();
});



