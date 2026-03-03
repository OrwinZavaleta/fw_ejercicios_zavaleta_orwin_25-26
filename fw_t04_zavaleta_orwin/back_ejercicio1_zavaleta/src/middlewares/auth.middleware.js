const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const checkToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token requerido" });
        }

        const token = header.split(" ")[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.user_id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Usuario no válido" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = { checkToken };
