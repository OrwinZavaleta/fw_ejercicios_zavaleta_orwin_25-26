const Episode = require("../models/episode.model");
const mongoose = require("mongoose");

const getEpisodes = async (req, res) => {
    try {
        const characters = await Episode.find();
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los Episodios",
        });
    }
};
const getEpisode = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const episode = await Episode.findById(id);

        if (!episode) {
            return res.status(404).json({ error: "Episodio no encontrado" });
        }

        res.status(200).json(episode);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener el episodio.",
        });
    }
};

const createEpisode = async (req, res) => {
    try {
        console.log(req.body);// TODO: corregir los errores que hace que rompa cuando se le envia un characters

        const newEpisode = await Episode.create(req.body); //TODO: validar la entrada
        res.status(201).json(newEpisode);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Un episodio con ese código ya está registrado.",
            });
        }

        res.status(500).json({ error: "Error al crear el episodio" });
    }
};

const updateEpisode = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const updated = await Episode.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });//TODO: validar la entrada

        if (!updated) {
            return res.status(404).json({ error: "Episodio no encontrado" });
        }

        res.status(200).json(updated);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Un episodio con ese código ya está registrado.",
            });
        }

        res.status(500).json({ error: "Error al actualizar el episodio." });
    }
};

const deleteEpisode = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const episodeDeleted = await Episode.findByIdAndDelete(id);

        if (!episodeDeleted) {
            return res.status(404).json({ error: "Episodio no encontrado" });
        }

        res.status(200).json({ message: "Epidosio eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar un Episodio" });
    }
};

const searchEpisodes = async (req, res) => {
    try {
        const { code, title, year } = req.query;

        const filter = {};

        if (code) filter.code = code;
        if (title) filter.title = title;
        if (year) filter.year = year; // TODO: hacer una mejor validacion

        const results = await Episode.find(filter);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el episodio." });
    }
};

module.exports = { getEpisodes, getEpisode, createEpisode, updateEpisode, deleteEpisode, searchEpisodes }