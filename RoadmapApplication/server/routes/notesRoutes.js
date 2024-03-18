// routes/notesRoutes.js
const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.get('/', notesController.getAllNotes);
router.post('/', notesController.createNote);
// Other routes like PUT, DELETE can be added similarly

module.exports = router;
