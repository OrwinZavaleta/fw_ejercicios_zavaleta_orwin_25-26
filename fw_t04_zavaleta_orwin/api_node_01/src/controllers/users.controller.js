const mongoose = require("mongoose");
const User = require("../models/user.model");

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        // Error por índice único duplicado
        if (error.code === 11000) {
            return res.status(400).json({
                error: "El email ya está registrado",
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Recuperar usuarios con el carrito "relleno" 
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").populate("cart");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Añadir un producto al carrito
const addToCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $push: { cart: productId } },
            { returnDocument: "after" },
        ).populate("cart");

        // { $addToSet: { cart: productId }} evita duplicados

        if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Sin populate() → más rápido, devuelve solo ids.
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserByEmailv2 = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User
            .findOne({ email })
            .populate("cart");   // Aquí está la diferencia

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { $pull: { cart: productId } },
            { returnDocument: "after" },
        ).populate("cart");

        if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const updated = await User.findByIdAndUpdate(id, { $set: { cart: [] } }, { returnDocument: "after" }).populate(
            "cart",
        );

        if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createUser, getUsers, addToCart, getUserByEmail, removeFromCart, clearCart };
