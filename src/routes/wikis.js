const express = require('express');
const router = express.Router();
const wikiController = require('../controllers/wikiController')

router.get('/wiki/new', wikiController.new);
router.post('/wiki/create', wikiController.create);
router.get('/wiki/:id', wikiController.show);
router.get('/wiki', wikiController.index);
router.get('/wiki/:id/edit', wikiController.edit);
router.post('/wiki/:id/update', wikiController.update);
router.post('/wiki/:id/destroy', wikiController.destroy);

module.exports = router;
