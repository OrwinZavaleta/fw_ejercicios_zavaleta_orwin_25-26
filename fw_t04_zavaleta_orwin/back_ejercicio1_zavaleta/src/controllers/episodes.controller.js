const getEpisodes = (req, res) => {
    res.status(200).json({ message: "Obtener Episodes" });
};
const getEpisode = (req, res) => {
    res.status(200).json({ message: "Obtener Episode: " + req.params.id });
};

const createEpisode = (req, res) => {
    res.status(201).json({ message: "Crear Episode" });
};

const updateEpisode = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Actualizar Episode ${id}` });
};

const deleteEpisode = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Eliminar Episode ${id}` });
};

module.exports = { getEpisodes, getEpisode, createEpisode, updateEpisode, deleteEpisode }