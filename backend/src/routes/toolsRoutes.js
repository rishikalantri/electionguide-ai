const express = require('express');
const toolsController = require('../controllers/toolsController');

const router = express.Router();

router.post('/translate', toolsController.translateText);
router.post('/tts', toolsController.textToSpeech);

module.exports = router;
