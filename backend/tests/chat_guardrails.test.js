const { handleChat } = require('../src/controllers/chatController');
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai');

describe('Chat Guardrails', () => {
  it('should have the correct guardrails in SYSTEM_INSTRUCTION', () => {
    // The controller initializes the model at the top level
    // We can spy on the mock to see what systemInstruction it received
    const mockGetGenerativeModel = jest.fn();
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));

    // Re-require the controller to force re-evaluation and trigger the top-level code
    jest.isolateModules(() => {
      require('../src/controllers/chatController');
    });

    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        systemInstruction: expect.stringContaining('who should I vote for')
      })
    );
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        systemInstruction: expect.stringContaining('I can help explain the election process, but I cannot recommend parties, candidates, or voting choices.')
      })
    );
  });
});
