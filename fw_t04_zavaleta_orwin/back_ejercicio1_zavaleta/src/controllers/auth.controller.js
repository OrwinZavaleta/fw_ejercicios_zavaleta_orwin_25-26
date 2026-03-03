const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ error: "Credenciales inválidas" });

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES || "10m",
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };

