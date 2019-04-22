const express = require('express');
const router = express.Router();
const validation = require('./validation');
const collaboratorController = require('../controllers/collaboratorController')

router.post('/wiki/:id/collaborator', validation.validateCollaborators, collaboratorController.create);
router.post('/wiki/:wikiId/collaborator/:id', collaboratorController.destroy);

module.exports = router;
