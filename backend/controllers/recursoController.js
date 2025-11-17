//importar o model recurso
const {Recurso} = require('../models');

//controller para manipular operações relacionadas a Recursos
const recursoController = {
    // @route //GET/api/recursos
    // @desc //listar todos os recursos
    // @access //Public

    async listarTodos(req,res){
        try{
            const recursos = await Recurso.findAll({
                order: [['nome','ASC']]
            });
        res.status(200).json(recursos);
        }
        catch(error){
            console.error(error);
            res.status(500).json({
                message: "Erro ao buscar recursos",
                error: error.message
            });
        }
    },

    async criar(req,res){
        try{
            //1. pega os dados enviados no corpo de requisição
            const {nome, tipo, status, capacity, location, meta}=req.body;
            //2.validação básica
            if(!nome||!tipo){
                return res.status(400).json({
                    message: 'Os campos "nome" e "tipo" são obrigatórios'
                });
            }

            //3.Cria um novo recurso no banco de dados
            //Equivale: a INSERT INTO recursos (...) VALUES (...)
            const novoRecurso = await Recurso.create({
                nome,
                tipo,
                status,
                capacity,
                location,
                meta
            });

            //4.Retorna o recurso recém-criado com status 201
            res.status(201).json(novoRecurso);
        } catch(error){
            //5. Em caso de erro
            console.error(error);
            res.status(500).json({
                message: 'Erro ao criar novo recurso',
                error: error.message
            });
        }
    },
};

module.exports = recursoController;