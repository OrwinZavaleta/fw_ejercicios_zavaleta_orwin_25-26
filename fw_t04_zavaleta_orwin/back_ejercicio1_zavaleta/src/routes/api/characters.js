const router = require('express').Router();
const charactersController = require('../../controllers/characters.controller');

const { createCharacterRules, updateCharacterRules, validate } = require("../../validators/character.validator");

router.get('/', charactersController.getCharacters);
router.post('/', createCharacterRules, validate, charactersController.createCharacter);

// router.get("/search", charactersController.searchCharacter);

router.get('/:id', charactersController.getCharacter);
router.put('/:id', updateCharacterRules, validate, charactersController.updateCharacter);
router.delete('/:id', charactersController.deleteCharacter);

module.exports = router;

