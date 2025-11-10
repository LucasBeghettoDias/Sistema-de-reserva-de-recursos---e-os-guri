// importa os models e operadores do sequelize
const { Reserva, Recurso } = require('../models');
const { Op } = require('sequelize');

// Controller para manipular operações relacionadas a reservas
const reservaController = {
    async listarTodos(req, res) {
        try {
            const queryOptions = {
                include: [{
                    model: Recurso,
                    as: 'recurso',
                    attributes: ['nome'] // estava 'attribute' no singular, o correto é 'attributes'
                }],
                order: [['startAt', 'DESC']]
            };

            if (req.query.usuarioId) {
                queryOptions.where = {
                    usuarioId: req.query.usuarioId
                };
            }

            // executa a busca no banco
            const reservas = await Reserva.findAll(queryOptions);

            // retorna as reservas
            res.status(200).json(reservas);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao buscar reservas',
                error: error.message
            });
        }
    },

    async criar(req, res) {
        try {
            // 1. Pega dados do frontend
            const { recursoId, usuarioId, data, horaInicio, horaFim, justificativa } = req.body;

            // 2. Validação básica
            if (!recursoId || !usuarioId || !data || !horaInicio || !horaFim) {
                return res.status(400).json({
                    message: 'Campos obrigatórios estão faltando'
                });
            }

            // 3. Conversão de data/hora frontend -> backend
            const startAt = new Date(`${data}T${horaInicio}`);
            const endAt = new Date(`${data}T${horaFim}`);

            // 4. Verificação de conflito
            const conflito = await Reserva.findOne({
                where: {
                    recursoId: recursoId,
                    status: { [Op.ne]: 'rejeitada' },
                    startAt: { [Op.lt]: endAt },
                    endAt: { [Op.gt]: startAt },
                }
            });

            // 5. Se encontra conflito retorna erro (409)
            if (conflito) {
                return res.status(409).json({
                    message: 'Conflito de horário: já existe reserva nesse período.'
                });
            }

            // 6. Se não há conflito, cria a reserva no banco
            const novaReserva = await Reserva.create({
                recursoId,
                usuarioId,
                startAt,
                endAt,
                justificativa,
                status: 'pendente'
            });

            // 7. Retorna reserva criada
            res.status(201).json(novaReserva);

        } catch (error) {
            console.error(error);
            if(error.name === 'sequelizeValidationError'){
                return res.status(400).json({
                    message: error.message,
                    details: error.errors
                })
            };
            res.status(500).json({
                message: 'Erro ao criar nova reserva',
                error: error.message
            });
        }
    },
};

module.exports = reservaController;

