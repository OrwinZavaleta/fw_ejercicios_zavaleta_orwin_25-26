const router = require('express').Router();
const episodesController = require('../../controllers/episodes.controller');

const { createEpisodeRules, updateEpisodeRules, validate } = require("../../validators/episode.validator");

router.get('/', episodesController.getEpisodes);
router.post('/', createEpisodeRules, validate, episodesController.createEpisode);

// router.get("/search", episodesController.searchEpisodes);

router.get('/:id', episodesController.getEpisode);
router.put('/:id', updateEpisodeRules, validate, episodesController.updateEpisode);
router.delete('/:id', episodesController.deleteEpisode);

module.exports = router;
