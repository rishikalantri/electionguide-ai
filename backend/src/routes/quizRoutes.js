const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.post('/score', quizController.saveScore);
router.get('/leaderboard', quizController.getLeaderboard);

module.exports = router;
