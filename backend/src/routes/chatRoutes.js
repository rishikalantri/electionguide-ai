const express = require('express');
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post(
  '/',
  [
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }).withMessage('Message too long'),
  ],
  chatController.handleChat
);

module.exports = router;
