const Character = require("../models/character.model");
const mongoose = require("mongoose");

const getCharacters = async (req, res) => {
    try {
        const characters = await Character.find();
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los Personajes",
        });
    }

};

const getCharacter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const character = await Character.findById(id);

        if (!character) {
            return res.status(404).json({ error: "Personaje no encontrado" });
        }

        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener el personaje.",
        });
    }
};

const createCharacter = async (req, res) => {
    try {
        console.log(req.body);
        
        const newCharacter = await Character.create(req.body); //TODO: validar la entrada
        res.status(201).json(newCharacter);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: "El nombre ya está registrado",
            });
        }

        res.status(500).json({ error: "Error al crear el personaje" });
    }
};

const updateCharacter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const updated = await Character.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });//TODO: validar la entrada

        if (!updated) {
            return res.status(404).json({ error: "Personaje no encontrado" });
        }

        res.status(200).json(updated);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: "El nombre ya está registrado",
            });
        }

        res.status(500).json({ error: "Error al actualizar el personaje" });
    }
};

const deleteCharacter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const characterDeleted = await Character.findByIdAndDelete(id);

        if (!characterDeleted) {
            return res.status(404).json({ error: "Personaje no encontrado" });
        }

        res.status(200).json({ message: "Personaje eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar un personaje" });
    }
};

const searchCharacter = async (req, res) => {
    try {
        const { name, age, species, role } = req.query;

        const filter = {};

        if (name) filter.name = name;
        if (age) filter.age = age;
        if (species) filter.species = species;
        if (role) filter.role = role; // TODO: hacer una mejor validacion

        const results = await Character.find(filter);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el personaje." });
    }

}

module.exports = { getCharacters, getCharacter, createCharacter, updateCharacter, deleteCharacter, searchCharacter }