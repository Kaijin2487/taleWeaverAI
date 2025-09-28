import express from 'express';
import { geminiService } from '../services/geminiService.js';
import { validate, chatbotSchemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/chatbot
 * @desc    Get response from Sparkle chatbot for parenting questions
 * @access  Public
 */
router.post('/', validate(chatbotSchemas.query), async (req, res, next) => {
  try {
    const { query } = req.body;

    // Generate response using Gemini AI
    const response = await geminiService.generateChatbotResponse(query);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    next(error);
  }
});

export default router;
