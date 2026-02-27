const router = require('express').Router();

// Delegamos en places.js
router.use('/characters', require('./api/characters'));
router.use('/episodes', require('./api/episodes'));

// Exportamos el router para poder usarlo en otros archivos
module.exports = router;
