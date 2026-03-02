const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const checkToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        // Validar header correcto
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token requerido" });
        }

        // Extraer token
        const token = header.split(" ")[1];

        // Verificar token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Comprobar que el usuario sigue existiendo
        const user = await User.findById(payload.user_id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Usuario no válido" });
        }

        // Guardar usuario limpio en req
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = { checkToken };
