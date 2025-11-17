//Sprint 4

//cetralizar toda a comunicação com o backend

//definir rota base da API
const API_BASE_URL = 'http://localhost:3001/api'

//criar um objeto que centraliza as chamadas da Api

const api = {
    //busca todos os recursos
    //usado para popular os select

    async getRecursos(){
        try{
            const response = await fetch (`${API_BASE_URL}/recursos`);
            if(!response.ok){
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return await response.json()
        } catch (error){
            console.error('falha ao buscar recursos:', error);
            //retornar um array vazio
            return [];
        }
    }, 

    //buscar todas as reservas
    //carrega histórico
    async getReservas(usuarioId = null){
        try{
            let url = `${API_BASE_URL}/reservas`
            //se um usuarioId for fornecido, filtra reservas
            if(usuarioId){
                url += `?usuarioId = ${encodeURIComponent(usuarioId)}`
            }
            const response = await fetch(url)
            if(!response.ok){
               throw new Error(`Erro HTTP: ${response.status}`)  
            }
            return await response.json();
            
        } catch(error){
            console.error('falha ao buscar reservas: ', error);
            return [];
        }
    }, 

    //envia recurso para a API
    //usada no forms de solicitar
    //@param {object} dadosReserva
    async createReserva (dadosReserva){
        const response = await fetch(`${API_BASE_URL}/reservas`, {
            method: 'POST',
            headers: {
               'Content-Type':'aplication/json'
            },
            body: JSON.stringify(dadosReserva)
        });

        //pega a resposta da API(seja sucesso 201 ou erro 409)
        const data = await response.json();

        //se a resposta não foi OK
        if(!response.ok){
            throw new Error(data.message || 'Erro desconhecido ao criar reserva');
        }

        //se foi OK retona a nova reserva
        return data;
    }


};