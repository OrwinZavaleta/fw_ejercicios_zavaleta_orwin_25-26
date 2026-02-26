const router = require('express').Router();

// Delegamos en places.js
router.use('/places', require('./api/places'));

//Delegamos a products.js
router.use("/products", require("./api/products"));

// Exportamos el router para poder usarlo en otros archivos
module.exports = router;
