import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Send, Bot, AlertTriangle, Loader2, MessageSquare, ShieldCheck, ExternalLink, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─── Canned demo response for "How do I register as a new voter?" ───────────
const DEMO_VOTER_REGISTRATION_ANSWER = {
  type: 'structured',
  intro: 'You can register as a new voter if you are 18 years or above and an Indian citizen.\n\nHere\'s how you can do it:',
  steps: [
    'Fill Form 6 (New Voter Registration).',
    'Submit it online on the Voters\' Portal or offline at the Electoral Registration Office.',
    'Provide required documents (age proof, address proof and photo).',
    'Your application will be verified and your name will be added to the electoral roll.',
    'You will receive your EPIC (Voter ID) after verification.',
  ],
  helpfulLinks: [
    { label: 'Register as a new voter (Form 6)', url: 'https://voters.eci.gov.in/' },
    { label: "Voters' Service Portal", url: 'https://voters.eci.gov.in/' },
    { label: 'Check your application status', url: 'https://electoralsearch.eci.gov.in/' },
  ],
  disclaimer: 'Always verify details on official ECI portals before taking action.',
};

// ─── Political guardrail check ────────────────────────────────────────────────
const POLITICAL_KEYWORDS = [
  'vote for', 'support', 'elect', 'best party', 'which party', 'who should i vote',
  'who to vote', 'recommend candidate', 'recommend party', 'bjp', 'congress', 'aap',
  'modi', 'rahul', 'kejriwal', 'opposition', 'ruling party', 'left wing', 'right wing',
  'which candidate', 'better candidate',
];

export const isPoliticalQuery = (text) => {
  const lower = text.toLowerCase();
  return POLITICAL_KEYWORDS.some((kw) => lower.includes(kw));
};

const POLITICAL_GUARD_RESPONSE = {
  type: 'text',
  text: "I'm here to provide neutral, factual information about the election process — not to make political recommendations.\n\nI **cannot** recommend parties, candidates, or voting choices. Please consult official sources or trusted, independent news media for political opinions.",
};

// ─── Suggested questions ─────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  'What documents are required?',
  'How to check my name in voter list?',
  'What is Form 6?',
  'What is NOTA?',
];

// ─── StructuredBotMessage component ─────────────────────────────────────────
const StructuredBotMessage = ({ data }) => (
  <div className="flex flex-col gap-3 text-sm text-slate-700">
    {data.intro && (
      <p className="leading-relaxed whitespace-pre-wrap">{data.intro}</p>
    )}

    {data.steps && data.steps.length > 0 && (
      <ol className="flex flex-col gap-2">
        {data.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    )}

    {data.helpfulLinks && data.helpfulLinks.length > 0 && (
      <div className="mt-2 rounded-xl bg-indigo-50 border border-indigo-100 p-3">
        <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-2">
          Helpful Links
        </p>
        <ul className="flex flex-col gap-1.5">
          {data.helpfulLinks.map((link, i) => (
            <li key={i}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline text-xs font-medium"
                data-testid="helpful-link"
              >
                {link.label}
                <ExternalLink size={11} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}

    {data.disclaimer && (
      <p className="text-[11px] text-slate-500 italic leading-relaxed">
        ⚠️ {data.disclaimer}
      </p>
    )}
  </div>
);

// ─── Main AskAi Component ────────────────────────────────────────────────────
const AskAi = ({ isPanel = false }) => {
  const { currentLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: 'Namaste! 🙏 I am **ElectionGuide AI**.\n\nI can answer your questions about the Indian election process, voter registration, polling procedures, and your rights as a citizen.\n\nHow can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', type: 'text', text: userMsg },
    ]);
    setIsLoading(true);

    // Political guardrail check
    if (isPoliticalQuery(userMsg)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            ...POLITICAL_GUARD_RESPONSE,
          },
        ]);
        setIsLoading(false);
      }, 400);
      return;
    }

    // Demo structured answer for voter registration
    const lowerMsg = userMsg.toLowerCase();
    const isRegistrationQuery =
      lowerMsg.includes('register') ||
      lowerMsg.includes('new voter') ||
      lowerMsg.includes('form 6') ||
      lowerMsg.includes('registration');

    if (isRegistrationQuery) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            type: 'structured',
            ...DEMO_VOTER_REGISTRATION_ANSWER,
          },
        ]);
        setIsLoading(false);
      }, 600);
      return;
    }

    // Real API call
    try {
      const langPrefix =
        currentLanguage !== 'en'
          ? `(Please answer in the language corresponding to code: ${currentLanguage}) `
          : '';
      const response = await axios.post('http://localhost:5001/api/chat', {
        message: langPrefix + userMsg,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          type: 'text',
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          type: 'text',
          text: 'I apologize, but I am having trouble connecting to my knowledge base right now. Please try again later.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex flex-col bg-white overflow-hidden ${
        isPanel
          ? 'h-full rounded-2xl border border-slate-200 shadow-soft'
          : 'h-[calc(100vh-10rem)] rounded-2xl border border-slate-200 shadow-soft'
      }`}
      data-testid="ask-ai-panel"
    >
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
        <div className="bg-indigo-600 p-2 rounded-full text-white shadow-sm">
          <MessageSquare size={18} />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight text-base">
            Ask a Question
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5" data-testid="chat-subtitle">
            Your AI assistant for election-related questions
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-slate-50 scrollbar-hide"
        data-testid="messages-area"
      >
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {/* Bot avatar */}
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1 border border-indigo-200">
                  <Bot size={16} />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                  }`}
                  data-testid={
                    msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'
                  }
                >
                  {msg.sender === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : msg.type === 'structured' ? (
                    <StructuredBotMessage data={msg} />
                  ) : msg.isError ? (
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-500" />
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {timestamp}
                  {msg.sender === 'user' && ' ✓'}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1 border border-indigo-200">
                <Bot size={16} />
              </div>
              <div
                className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2"
                data-testid="loading-indicator"
              >
                <Loader2 className="animate-spin text-indigo-400" size={15} />
                <span className="text-xs text-slate-500 font-medium">
                  Generating answer…
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Suggested follow-up questions ── */}
      <div
        className="px-4 pt-3 pb-1 bg-white border-t border-slate-100 shrink-0"
        data-testid="suggested-questions"
      >
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Suggested questions
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSuggestedQuestion(q)}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 text-[11px] font-medium rounded-full transition-colors"
              data-testid="suggested-question-btn"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="p-4 bg-white shrink-0 flex flex-col gap-2">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 relative"
          data-testid="chat-form"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question…"
            className="flex-1 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 transition-all outline-none text-sm shadow-sm pr-14"
            disabled={isLoading}
            aria-label="Chat input"
            data-testid="chat-input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
            data-testid="send-button"
          >
            <Send size={16} />
          </button>
        </form>

        {/* Neutrality disclaimer */}
        <div
          className="flex items-start gap-2 px-1"
          data-testid="neutrality-disclaimer"
        >
          <ShieldCheck size={13} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-tight">
            I provide neutral, non-political information based on official
            sources. I cannot recommend parties or candidates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AskAi;
export { POLITICAL_KEYWORDS, DEMO_VOTER_REGISTRATION_ANSWER };
