const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.listarTodos);
router.post('/', reservaController.criar); 


module.exports = router;