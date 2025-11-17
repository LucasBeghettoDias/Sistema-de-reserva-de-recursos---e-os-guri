const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/',reservaController.listarTodas);
router.post('/',reservaController.criar);

module.exports = router;
