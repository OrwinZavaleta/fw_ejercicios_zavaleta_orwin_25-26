const getCharacters = (req, res) => {
    res.status(200).json({ message: "Obtener Characters" });
};

const getCharacter = (req, res) => {
    res.status(200).json({ message: "Obtener character: " + req.params.id });
};

const createCharacter = (req, res) => {
    res.status(201).json({ message: "Crear Character" });
};

const updateCharacter = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Actualizar Character ${id}` });
};

const deleteCharacter = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Eliminar Character ${id}` });
};

module.exports = { getCharacters, getCharacter, createCharacter, updateCharacter, deleteCharacter }