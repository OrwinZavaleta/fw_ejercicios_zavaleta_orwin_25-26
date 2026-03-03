const router = require('express').Router();
const { checkToken } = require("../middlewares/auth.middleware");

router.use("/auth", require("./api/auth"));

router.use('/characters', checkToken, require('./api/characters'));
router.use('/episodes', checkToken, require('./api/episodes'));

module.exports = router;
