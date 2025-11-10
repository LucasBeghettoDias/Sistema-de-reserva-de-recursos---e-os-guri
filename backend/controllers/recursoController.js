const { Router } = require('express');
const { Recurso } = require('../models');

const recursoController = {
    // @route
    // @Desc  
    // @access   

    async listarTodos(req, res) {
        try {
            const recursos = await Recurso.findAll({
                order: [['nome', 'ASC']]
            });
            res.status(200).json(recursos);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao buscar recursos',
                error: error.message
            })

        }
    },

    async criar(req, res) {
        try {
            //pega os dados enviados no corpo de requisicao
            const { nome, tipo, status, capacity, location, meta } = req.body
            //validacao basica poggers
            if (!nome || !tipo) {
                return res.status(400).json({
                    message: 'Os Campos "nome" e "tipo" são obrigatórios'
                });
            }

            // 3.Criar um novo recurso no banco de dados
            // Equivale: a INSERT INTO recursos (...) VALUES (...)
            const novoRecurso = await Recurso.create({
                nome,
                tipo,
                stat,
                capacity,
                location,
                meta
            });

            //4. Retorna o recurso recem-criado com status 201
            res.status(201).json(novoRecurso);

        }catch (error){
            //5. Em caso de erro
            console.error(error);
            res.status(500).json({
                message: 'Erro ao crir novo recurso',
                error: error.message
            });
        }
    },
};

module.exports = recursoController;