const { GoogleGenerativeAI } = require('@google/generative-ai');
const { validationResult } = require('express-validator');

// Strict system instructions to enforce political neutrality
const SYSTEM_INSTRUCTION = `You are ElectionGuide AI, an official-style educational assistant for Indian citizens. Your sole purpose is to explain the Indian election process.

YOU MUST ANSWER questions about:
- election process
- voter registration
- voting day steps
- electoral roll
- EVM/VVPAT
- counting process
- Model Code of Conduct
- voter rights
- complaint guidance

YOU MUST REFUSE questions about:
- who should I vote for
- which party is better
- compare candidates
- campaign strategy
- political persuasion
- misinformation
- fake election dates
- live results without official source

When refusing a question, you MUST use exactly this response style:
"I can help explain the election process, but I cannot recommend parties, candidates, or voting choices."

CRITICAL RULES:
1. You must be STRICTLY politically neutral.
2. Use simple, easy-to-understand language.
3. Base your answers on official Indian election procedures (like the ECI guidelines).

REQUIRED ANSWER FORMAT:
For every valid question, structure your response exactly like this using Markdown:
1. A brief, simple answer.
2. A clear "Step-by-step process" (using numbered lists).
3. "Helpful Links" section with relevant official ECI links (e.g., https://voters.eci.gov.in/).
4. A final reminder: "Please remember to verify your personal details and registration status only on official ECI portals."`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_now');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: SYSTEM_INSTRUCTION,
});

exports.handleChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { message } = req.body;

  try {
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.2, // Keep it deterministic and factual
        maxOutputTokens: 2000,
      },
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate response. Please try again later.' });
  }
};
