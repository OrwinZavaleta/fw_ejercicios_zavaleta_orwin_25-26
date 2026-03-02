const router = require("express").Router();
const authController = require("../../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);


const { checkToken } = require("../../middlewares/auth.middleware");

// Ruta privada de prueba
router.get("/me", checkToken, (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    });
});

module.exports = router;
