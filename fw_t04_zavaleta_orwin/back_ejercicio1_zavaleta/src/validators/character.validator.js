const { body, validationResult } = require('express-validator');

const createCharacterRules = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')
        .trim(),

    body('img')
        .notEmpty().withMessage('La imagen es obligatoria')
        .isString().withMessage('La imagen debe ser una URL válida')
        .isLength({ max: 100 }).withMessage('La URL no puede exceder 100 caracteres')
        .trim(),

    body('age')
        .notEmpty().withMessage('La edad es obligatoria')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),

    body('species')
        .notEmpty().withMessage('La especie es obligatoria')
        .isIn(['humano', 'demonio', 'otro']).withMessage('Especie no válida. Opciones: humano, demonio, otro')
        .trim()
        .toLowerCase(),

    body('specialTraits')
        .optional({ nullable: true })
        .isArray().withMessage('Los rasgos especiales deben ser un array')
        .custom((value) => {
            if (!value || value.length === 0) return true;
            return value.every(trait => typeof trait === 'string');
        }).withMessage('Cada rasgo especial debe ser un string'),

    body('role')
        .notEmpty().withMessage('El rol es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')
        .trim()
        .toLowerCase(),

    body('firstAppearance')
        .notEmpty().withMessage('La primera aparición es obligatoria')
        .matches(/^S\d{2}E\d{2}$/).withMessage('Formato inválido. Use S##E## (ej: S01E05)')
        .trim(),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { createCharacterRules, validate };
