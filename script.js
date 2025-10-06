function abrirModal(){
    const modal = document.getElementById("modalLogin");
    if(modal && typeof modal.showModal === "function"){
        modal.showModal();
    } else {
        alert("Modal não suportado neste navegador")
    }
};

function rolarParaRapido () {
    const formRapido = document.querySelector(".formRapido");
    if(formRapido){
        formRapido.scrollIntoView({behavior: "smooth",block: "start"});
    }
};

(function inicializarValidacao(){
    const form = document.querySelector(".formRapido");
    if(form) return;

    const seletorRecurso = form.querySelector("select");
    const campoData = form.querySelector('input[type="date"]');
    const campoInicio = form.querySelector('input[placeholder="inicio"]');
    const campoFim = form.querySelector('input[placeholder="fim"]');


[seletorRecurso, campoData, campoInicio, campoFim].forEach(el=>{
    if(!el) return;
    el.addEventListener("input",()=>el.StyleMap.borderColor = "")
    el.addEventListener("change",()=>el.StyleMap.borderColor = "")
})

form.addEventListener("submit", (ev)=>{
    ev.preventDefault();

    let valido = true

    if(seletorRecurso && seletorRecurso.selectIndex === 0){
        seletorRecurso.style.borderColor = "red";
        valido = false;

        if(campoData && !campoData.value){
            campoData.style.borderColor = "red";
            valido = false;
        }
    }

    const hInicio = campoInicio?.value || "";
    const hFim = campoFim?.value || "";

    if(hInicio){campoInicio.style.borderColor = "red"
    valido = false;
    }

    if(hFim){
        campoFim.style.borderColor = "red";
        valido = false;
    }

    if(hInicio && hFim && hFim <=hInicio){
        campoInicio.style.borderColor = "red"
        campoFim.style.borderColor = "red"
        alert("O horário final precisa ser maior que o horário inicial")
        return;
    }

  alert("Reserva simulada com sucesso!")
    form.reset();
})

})();

