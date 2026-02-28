const router = require('express').Router();
const charactersController = require('../../controllers/characters.controller');

router.get('/', charactersController.getCharacters);
router.post('/', charactersController.createCharacter);

router.get("/search", charactersController.searchCharacter);

router.get('/:id', charactersController.getCharacter);
router.put('/:id', charactersController.updateCharacter);
router.delete('/:id', charactersController.deleteCharacter);

module.exports = router;

