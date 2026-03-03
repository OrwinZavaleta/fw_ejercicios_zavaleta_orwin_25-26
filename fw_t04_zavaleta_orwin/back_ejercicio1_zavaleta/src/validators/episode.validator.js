const { body, validationResult } = require('express-validator');
const mongoose = require("mongoose");

const createEpisodeRules = [
    body('code')
        .notEmpty().withMessage('El código es obligatorio.')
        .matches(/^S\d{2}E\d{2}$/).withMessage('Formato inválido. Use S##E## (ej: S01E05)')
        .trim(),

    body('title')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')
        .trim(),

    body('summary')
        .notEmpty().withMessage('Un pequeño resumen es obligatorio')
        .isLength({ max: 800 }).withMessage('La URL no puede exceder 800 caracteres')
        .trim(),

    body('year')
        .notEmpty().withMessage('El año es obligatorio')
        .isInt({ min: 2000 }).withMessage('El año debe ser mayor a 2000'),

    body('characters') // TODO: validar que existan ademas de ser valido
        .optional({ nullable: true })
        .isArray().withMessage('Los rasgos especiales deben ser un array')
        .custom((value) => {
            if (!value || value.length === 0) return true;
            if (!value.every((id => mongoose.Types.ObjectId.isValid(id)))) {
                return false
            }
            return true
        }).withMessage('Todos los ids deben ser ids validos de MongoDB'),

];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { createEpisodeRules, validate };
