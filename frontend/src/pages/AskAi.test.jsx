/**
 * AskAi.test.jsx
 * ─────────────────────────────────────────────────────────────────
 * Covers:
 *  1. Chatbot political neutrality guardrails
 *  2. Empty user input (does not send)
 *  3. API error handling
 *  4. Suggested follow-up questions
 *  5. Neutrality disclaimer rendered
 *  6. Structured voter-registration answer
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import AskAi, { isPoliticalQuery } from './AskAi';

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock the centralized API client (axios instance from ../api.js)
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock LanguageContext
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ currentLanguage: 'en', translate: vi.fn((t) => t) }),
  LanguageProvider: ({ children }) => <div>{children}</div>,
}));

// ── Helper ───────────────────────────────────────────────────────────────────

const renderAskAi = () => render(<AskAi isPanel={true} />);

// ── Test suite ───────────────────────────────────────────────────────────────

describe('AskAi Component', () => {

  // ── 1. Political neutrality unit tests ─────────────────────────────────────
  describe('isPoliticalQuery (neutrality guardrail)', () => {
    it('returns true for party recommendation queries', () => {
      expect(isPoliticalQuery('Which party should I vote for?')).toBe(true);
      expect(isPoliticalQuery('which party is best')).toBe(true);
      expect(isPoliticalQuery('who should i vote for')).toBe(true);
    });

    it('returns true for candidate name mentions', () => {
      expect(isPoliticalQuery('Tell me about BJP')).toBe(true);
      expect(isPoliticalQuery('Should I support Congress?')).toBe(true);
    });

    it('returns false for neutral election process queries', () => {
      expect(isPoliticalQuery('How do I register as a new voter?')).toBe(false);
      expect(isPoliticalQuery('What is Form 6?')).toBe(false);
      expect(isPoliticalQuery('What is the minimum voting age?')).toBe(false);
      expect(isPoliticalQuery('Where is my polling station?')).toBe(false);
    });
  });

  // ── 2. Render tests ─────────────────────────────────────────────────────────
  describe('UI rendering', () => {
    it('renders the "Ask a Question" section title', () => {
      renderAskAi();
      expect(screen.getByText('Ask a Question')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      renderAskAi();
      expect(
        screen.getByTestId('chat-subtitle')
      ).toHaveTextContent('Your AI assistant for election-related questions');
    });

    it('renders the neutrality disclaimer', () => {
      renderAskAi();
      const disclaimer = screen.getByTestId('neutrality-disclaimer');
      expect(disclaimer).toBeInTheDocument();
      expect(disclaimer).toHaveTextContent('neutral');
      expect(disclaimer).toHaveTextContent('non-political');
    });

    it('renders suggested follow-up question buttons', () => {
      renderAskAi();
      const btns = screen.getAllByTestId('suggested-question-btn');
      expect(btns.length).toBeGreaterThanOrEqual(2);
      expect(btns[0]).toHaveTextContent('What documents are required?');
    });

    it('renders the input box and send button', () => {
      renderAskAi();
      expect(screen.getByTestId('chat-input')).toBeInTheDocument();
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });
  });

  // ── 3. Empty input ──────────────────────────────────────────────────────────
  describe('Empty input handling', () => {
    it('does not send a message when input is empty', () => {
      renderAskAi();
      const sendBtn = screen.getByTestId('send-button');
      expect(sendBtn).toBeDisabled();
    });

    it('does not send when only whitespace is typed', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      const form = screen.getByTestId('chat-form');

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.submit(form);

      // Axios should NOT have been called
      await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
      });
    });
  });

  // ── 4. Political guardrail in UI ────────────────────────────────────────────
  describe('Political neutrality guardrail in chat', () => {
    it('shows a guardrail response for political questions without calling API', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      const form = screen.getByTestId('chat-form');

      fireEvent.change(input, { target: { value: 'Which party should I vote for?' } });
      fireEvent.submit(form);

      await waitFor(() => {
        const botBubbles = screen.getAllByTestId('bot-bubble');
        const lastBubble = botBubbles[botBubbles.length - 1];
        expect(lastBubble).toHaveTextContent('cannot');
      });

      // The real API should NOT have been called
      expect(api.post).not.toHaveBeenCalled();
    });

    it('shows guardrail for BJP mention', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'Tell me about BJP' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => {
        const botBubbles = screen.getAllByTestId('bot-bubble');
        const lastBubble = botBubbles[botBubbles.length - 1];
        expect(lastBubble).toHaveTextContent('neutral');
      });
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  // ── 5. Structured voter-registration answer ─────────────────────────────────
  describe('Structured answer for voter registration', () => {
    it('shows step-by-step answer for "How do I register as a new voter?"', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'How do I register as a new voter?' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => {
        // Check step-by-step numbered steps appear
        expect(screen.getByText('Fill Form 6 (New Voter Registration).')).toBeInTheDocument();
      });

      // Check helpful links section
      const helpfulLinks = screen.getAllByTestId('helpful-link');
      expect(helpfulLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('shows the helpful links section in structured answer', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'How to register as a voter?' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => {
        expect(screen.getByText('Helpful Links')).toBeInTheDocument();
      });
    });
  });

  // ── 6. API error handling ───────────────────────────────────────────────────
  describe('API error handling', () => {
    beforeEach(() => {
      api.post.mockRejectedValue(new Error('Network Error'));
    });

    it('shows an error message when the API call fails', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      // A neutral query that won't hit the local guardrail or demo handler
      fireEvent.change(input, { target: { value: 'What is NOTA?' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => {
        const botBubbles = screen.getAllByTestId('bot-bubble');
        const lastBubble = botBubbles[botBubbles.length - 1];
        expect(lastBubble).toHaveTextContent('trouble connecting');
      });
    });

    it('re-enables the input after an API error', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'What is NOTA?' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => {
        expect(input).not.toBeDisabled();
      });
    });
  });

  // ── 7. Successful API response ──────────────────────────────────────────────
  describe('Successful API response', () => {
    beforeEach(() => {
      api.post.mockResolvedValue({
        data: { reply: 'NOTA stands for None of the Above.' },
      });
    });

    it('displays the API reply in a bot bubble', async () => {
      renderAskAi();
      const input = screen.getByTestId('chat-input');
      fireEvent.change(input, { target: { value: 'What is NOTA?' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => {
        expect(
          screen.getByText('NOTA stands for None of the Above.')
        ).toBeInTheDocument();
      });
    });
  });

  // ── 8. Suggested question populates input ───────────────────────────────────
  describe('Suggested questions', () => {
    it('clicking a suggested question populates the input', () => {
      renderAskAi();
      const btns = screen.getAllByTestId('suggested-question-btn');
      fireEvent.click(btns[0]); // "What documents are required?"
      expect(screen.getByTestId('chat-input')).toHaveValue(
        'What documents are required?'
      );
    });
  });
});
