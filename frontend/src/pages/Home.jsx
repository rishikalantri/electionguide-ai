import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare, CalendarDays, ClipboardList, Shield, Trophy,
  UserPlus, FileText, Megaphone, FileSignature, Users,
  CheckCircle2, BarChart3, Medal, ArrowRight,
  ShieldCheck, BookOpen, UsersRound, Lock, X,
} from 'lucide-react';
import AskAi from './AskAi';

// ─── Election Process timeline steps ────────────────────────────────────────
const TIMELINE_STEPS = [
  { id: 1, label: 'Registration',           icon: UserPlus,     color: 'text-indigo-600 bg-indigo-100' },
  { id: 2, label: 'Electoral Roll',          icon: FileText,     color: 'text-blue-600 bg-blue-100' },
  { id: 3, label: 'Election Announcement',  icon: Megaphone,    color: 'text-emerald-600 bg-emerald-100' },
  { id: 4, label: 'Nomination',             icon: FileSignature, color: 'text-amber-600 bg-amber-100' },
  { id: 5, label: 'Campaigning',            icon: Users,        color: 'text-rose-600 bg-rose-100' },
  { id: 6, label: 'Polling Day',            icon: CheckCircle2, color: 'text-purple-600 bg-purple-100' },
  { id: 7, label: 'Counting',               icon: BarChart3,    color: 'text-cyan-600 bg-cyan-100' },
  { id: 8, label: 'Results',                icon: Medal,        color: 'text-green-600 bg-green-100' },
];

// ─── Trust badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  {
    icon: ShieldCheck, color: 'text-indigo-500',
    title: '100% Neutral',
    desc: 'We provide non-political information only.',
  },
  {
    icon: BookOpen, color: 'text-blue-500',
    title: 'Official Sources',
    desc: 'All information is from Election Commission of India.',
  },
  {
    icon: UsersRound, color: 'text-emerald-500',
    title: 'For Every Citizen',
    desc: 'Simple language, audio support and multi-language.',
  },
  {
    icon: Lock, color: 'text-purple-500',
    title: 'Secure & Private',
    desc: 'Your data is safe with us. We respect your privacy.',
  },
];

// ─── Feature cards data ──────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    to: '/ask', icon: MessageSquare, bg: 'bg-indigo-100', text: 'text-indigo-600',
    arrow: 'text-indigo-400 group-hover:text-indigo-600',
    title: 'Ask a Question',
    desc: 'Get answers to all your election related questions from our AI assistant.',
  },
  {
    to: '/journey', icon: CalendarDays, bg: 'bg-blue-100', text: 'text-blue-600',
    arrow: 'text-blue-400 group-hover:text-blue-600',
    title: 'See Timelines',
    desc: 'Explore important dates, election phases and key events.',
  },
  {
    to: '/checklist', icon: ClipboardList, bg: 'bg-emerald-100', text: 'text-emerald-600',
    arrow: 'text-emerald-400 group-hover:text-emerald-600',
    title: 'Voter Steps',
    desc: 'Follow step-by-step guides for voting and registration.',
  },
  {
    to: '/rights', icon: Shield, bg: 'bg-amber-100', text: 'text-amber-600',
    arrow: 'text-amber-400 group-hover:text-amber-600',
    title: 'Know Your Rights',
    desc: 'Learn your rights as a voter, rules, facilities and how to seek help.',
  },
  {
    to: '/quiz', icon: Trophy, bg: 'bg-rose-100', text: 'text-rose-600',
    arrow: 'text-rose-400 group-hover:text-rose-600',
    title: 'Take a Quiz',
    desc: 'Test your knowledge and earn your democracy badge.',
  },
];

// ─── Hero illustration (SVG-like CSS art matching reference) ─────────────────
const HeroIllustration = () => (
  <div className="w-full max-w-[380px] aspect-[4/3] relative select-none">
    {/* Sky background */}
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 border border-sky-200">
      {/* Clouds */}
      <div className="absolute top-4 right-12 w-16 h-6 bg-white rounded-full opacity-80" />
      <div className="absolute top-6 right-8 w-10 h-5 bg-white rounded-full opacity-60" />
      <div className="absolute top-3 left-10 w-12 h-5 bg-white rounded-full opacity-70" />

      {/* Parliament dome base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%]">
        {/* Pillars */}
        <div className="flex justify-center gap-1.5 mb-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-4 bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 rounded-t-sm"
              style={{ height: `${32 + (i % 2 === 0 ? 8 : 0)}px` }}
            />
          ))}
        </div>
        {/* Main dome */}
        <div className="relative flex justify-center">
          <div className="w-[55%] h-16 bg-gradient-to-b from-amber-100 to-amber-200 border-x border-t border-amber-300 rounded-t-[80%]" />
        </div>
        {/* Flag */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-0.5 h-10 bg-slate-500" />
          <div className="flex -mt-10 ml-0.5">
            <div className="w-8 h-2 bg-amber-500" />
            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[6px] border-t-transparent border-b-transparent border-l-amber-500" />
          </div>
        </div>
      </div>

      {/* Trees */}
      <div className="absolute bottom-12 left-4 flex flex-col items-center gap-0">
        <div className="w-10 h-10 bg-emerald-400 rounded-full opacity-90" />
        <div className="w-2 h-4 bg-amber-700 rounded-sm" />
      </div>
      <div className="absolute bottom-12 right-4 flex flex-col items-center gap-0">
        <div className="w-8 h-8 bg-emerald-500 rounded-full opacity-90" />
        <div className="w-1.5 h-3 bg-amber-700 rounded-sm" />
      </div>
    </div>

    {/* Voting hand — foreground */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
      {/* Finger */}
      <div className="w-6 h-14 bg-amber-200 rounded-t-full border border-amber-300 flex items-start justify-center pt-1 shadow-md">
        <div className="w-2 h-3 bg-indigo-600 rounded-full opacity-90" />
      </div>
      {/* Palm */}
      <div className="w-12 h-8 bg-amber-200 rounded-b-xl border border-amber-300 shadow-md" />
    </div>
  </div>
);

// ─── Dashboard content ────────────────────────────────────────────────────────
const DashboardContent = ({ chatOpen, isMobile }) => {
  const panelMode = chatOpen && !isMobile;

  return (
    <div
      className={`w-full bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${
        panelMode ? 'shadow-soft' : 'shadow-soft'
      }`}
      data-testid="dashboard-content"
    >
      {/* Hero */}
      <div
        className={`flex ${panelMode ? 'flex-col gap-6' : 'flex-col md:flex-row'} items-center justify-between p-6 lg:p-10 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50`}
      >
        {/* Text */}
        <div className={`${panelMode ? 'w-full' : 'w-full md:w-1/2'} space-y-5 z-10`}>
          <h1
            className={`${panelMode ? 'text-2xl' : 'text-3xl lg:text-4xl xl:text-5xl'} font-extrabold text-slate-900 leading-tight`}
          >
            Understand India's <br />
            <span className="text-indigo-600">Election Process</span> <br />
            in Simple Steps
          </h1>
          <p className="text-slate-600 text-base max-w-md leading-relaxed">
            Ask questions, explore timelines, learn your rights and become an
            informed voter.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm text-sm"
              data-testid="ask-question-btn"
            >
              <MessageSquare size={18} />
              Ask a Question
            </Link>
            <Link
              to="/journey"
              className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm"
            >
              <CalendarDays size={18} className="text-indigo-600" />
              See Timelines
            </Link>
          </div>
        </div>

        {/* Illustration — hidden in panel mode to save space */}
        {!panelMode && (
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-end">
            <HeroIllustration />
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="p-6 lg:p-8" data-testid="feature-cards">
        <div
          className={`grid grid-cols-1 gap-4 ${
            panelMode
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'sm:grid-cols-2 lg:grid-cols-5'
          }`}
        >
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group flex flex-col items-center text-center p-5 bg-white border border-slate-100 rounded-2xl shadow-soft hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-full ${card.bg} ${card.text} flex items-center justify-center mb-3`}
                >
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-3 leading-relaxed">
                  {card.desc}
                </p>
                <ArrowRight
                  size={18}
                  className={`${card.arrow} mt-auto transition-colors`}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Election Process Timeline */}
      <div
        className="px-6 lg:px-8 pb-8"
        data-testid="election-timeline"
      >
        <div className="bg-slate-50 rounded-2xl p-5 lg:p-7 border border-slate-100 overflow-x-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Election Process at a Glance
          </h2>

          <div className="relative flex justify-between items-start min-w-[560px]">
            {/* Dashed connector */}
            <div className="absolute top-5 left-0 right-0 h-px border-t-2 border-dashed border-slate-300 -z-10" />

            {TIMELINE_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center w-[11%] shrink-0"
                  data-testid="timeline-step"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 border-4 border-white shadow-sm ${step.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 mb-0.5">
                    {step.id}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-600 leading-tight">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/journey"
              className="inline-block bg-indigo-50 text-indigo-700 px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              Click on any step to learn more
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div
        className="bg-slate-50 border-t border-slate-100 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        data-testid="trust-badges"
      >
        {TRUST_BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.title} className="flex items-start gap-3">
              <Icon size={24} className={`${badge.color} shrink-0 mt-0.5`} />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{badge.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {badge.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const location = useLocation();
  const showChat = location.pathname === '/ask';

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <div
      className="flex w-full gap-6 items-start relative"
      data-testid="home-container"
    >
      {/* Dashboard — always visible on desktop, hidden on mobile when chat open */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ${
          showChat && isMobile ? 'hidden' : 'block'
        }`}
      >
        <DashboardContent chatOpen={showChat} isMobile={isMobile} />
      </div>

      {/* ── Chat Panel ─────────────────────────────────────────────────────── */}
      {showChat && (
        <>
          {/* Desktop: sticky side panel */}
          {!isMobile && (
            <div
              className="w-[420px] shrink-0 sticky top-20 h-[calc(100vh-6.5rem)]"
              data-testid="chat-side-panel"
            >
              <AskAi isPanel={true} />
            </div>
          )}

          {/* Mobile: full-screen overlay */}
          {isMobile && (
            <div
              className="fixed inset-0 z-50 bg-white flex flex-col"
              data-testid="chat-mobile-panel"
            >
              {/* Close button */}
              <Link
                to="/"
                className="absolute top-4 right-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} className="text-slate-700" />
              </Link>
              <AskAi isPanel={true} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
