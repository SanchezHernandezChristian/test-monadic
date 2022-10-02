const express = require('express');
const router = express.Router();
const usuarioService = require('../service/usuario.service');
router.get('/users', usuarioService.findAll);
router.post('/createUser', usuarioService.create);
router.put('/updateUser/:id', usuarioService.update);
router.delete('/deleteUser/:id', usuarioService.delete);
router.get('/findUsersByStatus/:estatus', usuarioService.findByStatus);
module.exports = router;
