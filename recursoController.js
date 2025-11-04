const { Router } = require('express');
const {Recurso} = require('../models');

const recursoController = {
    @route
    @Desc  
    @access   

    async listarTodos(req, res){
        try{
            const recursos = await Recurso.findAll({
                order: [['nome','ASC']]
            });
            res.status(200).json(recursos);
        }
        catch (error){
            console.error(error);
            res.status(500).json({
                message: 'Erro ao buscar recursos',
                error: error.message
            })

        }
    }
}   