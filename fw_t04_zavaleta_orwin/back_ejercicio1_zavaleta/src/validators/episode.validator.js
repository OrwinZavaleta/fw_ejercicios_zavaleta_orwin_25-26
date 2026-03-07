const { body, validationResult } = require('express-validator');
const Character = require("../models/character.model");
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

    body('characters')
        .optional({ nullable: true })
        .isArray().withMessage('Los rasgos especiales deben ser un array')
        .custom(async (value) => {
            if (!value || value.length === 0) return true;
            if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
                return false
            }

            const existencias = await Promise.all(value.map(id => Character.findById(id)))

            if (existencias.some(e => !e)) {
                throw new Error("Alguno de los Ids no existe");
            }

            return true
        }).withMessage('Todos los ids deben ser ids validos de MongoDB'),
];
const updateEpisodeRules = [
    body('code')
        .optional()
        .matches(/^S\d{2}E\d{2}$/).withMessage('Formato inválido. Use S##E## (ej: S01E05)')
        .trim(),

    body('title')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')
        .trim(),

    body('summary')
        .optional()
        .isLength({ max: 800 }).withMessage('La URL no puede exceder 800 caracteres')
        .trim(),

    body('year')
        .optional()
        .isInt({ min: 2000 }).withMessage('El año debe ser mayor a 2000'),

    body('characters')
        .optional({ nullable: true })
        .isArray().withMessage('Los rasgos especiales deben ser un array')
        .custom(async (value) => {
            if (!value || value.length === 0) return true;
            if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
                return false
            }

            const existencias = await Promise.all(value.map(id => Character.findById(id)))

            if (existencias.some(e => !e)) {
                throw new Error("Alguno de los Ids no existe");
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

module.exports = { createEpisodeRules, updateEpisodeRules, validate };
