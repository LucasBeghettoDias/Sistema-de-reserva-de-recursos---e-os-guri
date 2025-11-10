const express = require('express');
const router = express.Router();
const recursoController = require('../controllerss/recursoController');

router.get('/', recursoController.listarTodos);
router.post('/', recursoController.criar);

module.exports = router;