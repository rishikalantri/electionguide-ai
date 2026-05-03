const request = require('supertest');
const express = require('express');

// We need to mock BEFORE requiring the route that instantiates the model
const mockSendMessage = jest.fn();
const mockGetGenerativeModel = jest.fn().mockReturnValue({
  startChat: jest.fn().mockReturnValue({
    sendMessage: mockSendMessage
  })
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    })
  };
});

const chatRoutes = require('../src/routes/chatRoutes');

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);

describe('POST /api/chat', () => {
  afterEach(() => {
    mockSendMessage.mockClear();
  });

  it('should return 400 if message is empty (Empty user input test)', async () => {
    const res = await request(app).post('/api/chat').send({ message: '   ' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toBe('Message is required');
  });

  it('should return 200 and a reply if message is valid', async () => {
    mockSendMessage.mockResolvedValue({
      response: { text: () => 'Mocked response about elections' }
    });

    const res = await request(app).post('/api/chat').send({ message: 'How do I register to vote?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.reply).toBe('Mocked response about elections');
  });

  it('should handle API errors gracefully (API error handling test)', async () => {
    mockSendMessage.mockRejectedValue(new Error('Gemini API is down'));

    const res = await request(app).post('/api/chat').send({ message: 'What is NOTA?' });
    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Failed to generate response. Please try again later.');
  });

  it('should enforce political neutrality guardrails by checking system instructions setup', async () => {
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        systemInstruction: expect.stringContaining('STRICTLY politically neutral')
      })
    );
  });
});
