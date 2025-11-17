//Importa os Models e Operadores do Sequelize
const {Reserva, Recurso} = require('../models');
const {Op} = require('sequelize');
//const { listarTodos } = require('./recursoController');

//controller para manipular operações relacionadas a
//Reservas

const reservaController={
    async listarTodas(req,res){
        //1.prepara a consulta ao banco
        try{
            const queryOptions = {
                include:[{
                    model: Recurso,
                    as: 'recurso',
                    attributes: ['nome']
                }],
                order: [['startAt','DESC']]
            };
            
            if(req.query.usuarioId){
                queryOptions.where = {
                    usuarioId: req.query.usuarioId
                };
            }

            //3.executa a busca no banco
            const reservas = await Reserva.findAll(queryOptions);

            //4.retorna as reservas
            res.status(200).json(reservas);

        } catch(error){
            console.error(error);
            res.status(500).json({
                message: 'Erro ao buscar reservas',
                error: error.message
            });
        }
    },

    async criar(req,res){
        try{
            //1. Pega dados do frontend (script.js)
            const {recursoId, usuarioId,data,horaInicio,horaFim,justificativa}=req.body;

            //2.validação básica
            if(!recursoId || !usuarioId || !data || !horaInicio || !horaFim){
                return res.status(400).json({
                    message:'Campos obrigatórios estão faltando'
                });
            }
            //3.Conversão de data/hora frontend->backend
            const startAt = new Date(`${data}T${horaInicio}`);
            const endAt = new Date(`${data}T${horaFim}`);

            //4. Verificação de conflito
            const conflito = await Reserva.findOne({
                where: {
                    recursoId: recursoId,
                    status:{[Op.ne]:'rejeitada'}, //ignora as reservas rejeitadas
                    startAt: {[Op.lt]:endAt}, //inicio da reserva existente<fim da nova
                    endAt:{[Op.gt]:startAt} //Fim da reserva existente>Inicio da nova
                }
            });

            //5.Se encontra conflito, retorna erro (409)
            if (conflito){
                return res.status(409).json({
                    message: 'Conflito de horário. Já existe reserva'
                });
            }

            //6.Se não há conflito cria a reserva no banco
            const novaReserva = await Reserva.create({
                recursoId,
                usuarioId,
                startAt,
                endAt,
                justificativa,
                status: 'pendente'
            });

            //7.retorna reserva criada
            res.status(201).json(novaReserva);

        } catch(error){
            console.error(error);
            if(error.name ==='SequelizeValidationError'){
                return res.status(400).json({
                    message: error.message,
                    details:error.errors
                })
            }
            res.status(500).json({
                message: 'Erro ao criar nova reserva',
                error: error.message
            });
        }
    },
};

module.exports = reservaController;
