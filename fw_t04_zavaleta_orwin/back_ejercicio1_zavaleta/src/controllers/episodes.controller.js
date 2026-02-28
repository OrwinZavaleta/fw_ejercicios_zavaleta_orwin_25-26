const getEpisodes = async (req, res) => {
    res.status(200).json({ message: "Obtener Episodes" });
};
const getEpisode = async (req, res) => {
    res.status(200).json({ message: "Obtener Episode: " + req.params.id });
};

const createEpisode = async (req, res) => {
    res.status(201).json({ message: "Crear Episode" });
};

const updateEpisode = async (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Actualizar Episode ${id}` });
};

const deleteEpisode = async (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Eliminar Episode ${id}` });
};

const searchEpisodes = async (req, res) => {
};

module.exports = { getEpisodes, getEpisode, createEpisode, updateEpisode, deleteEpisode, searchEpisodes }