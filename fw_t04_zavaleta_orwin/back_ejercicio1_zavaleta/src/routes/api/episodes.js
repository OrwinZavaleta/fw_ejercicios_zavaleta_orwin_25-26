const router = require('express').Router();
const episodesController = require('../../controllers/episodes.controller');

router.get('/', episodesController.getEpisodes);
router.post('/', episodesController.createEpisode);
router.get('/:id', episodesController.getEpisode);
router.put('/:id', episodesController.updateEpisode);
router.delete('/:id', episodesController.deleteEpisode);

module.exports = router;
