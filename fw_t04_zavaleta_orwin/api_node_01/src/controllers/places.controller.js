exports.getPlaces = (req, res) => {
    res.status(200).json({ 
       message: "Obtener places" 
    });
};

exports.createPlace = (req, res) => {
    res.status(201).json({ message: "Crear place" });
};

exports.updatePlace = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Actualizar place ${id}` });
};

exports.deletePlace = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Eliminar place ${id}` });
};
