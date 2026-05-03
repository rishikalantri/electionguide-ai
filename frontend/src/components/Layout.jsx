import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Bot, Map, CheckSquare, ShieldAlert, GraduationCap, Globe, Volume2 } from 'lucide-react';

const Layout = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/ask';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-indigo-600 focus:text-white focus:z-50">
        Skip to main content
      </a>

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Bot size={24} className="text-indigo-600" />
              </div>
              <div>
                <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 block">
                  ElectionGuide <span className="text-indigo-600">AI</span>
                </Link>
                <span className="text-xs text-slate-500 font-medium">Your Election Assistant</span>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors bg-white"
                  aria-label="Select Language"
                >
                  <Globe size={16} />
                  <span>English</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-lg rounded-xl py-2 z-50 hidden group-hover:block focus-within:block">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentLanguage === lang.code ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors bg-white">
                <Volume2 size={16} />
                <span>Listen</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex gap-6">
        
        {/* Left Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            <Link to="/ask" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/ask' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Bot size={20} className={location.pathname === '/ask' ? 'text-indigo-600' : ''} />
              Ask a Question
            </Link>
            <Link to="/journey" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/journey' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Map size={20} className={location.pathname === '/journey' ? 'text-indigo-600' : ''} />
              See Timelines
            </Link>
            <Link to="/checklist" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/checklist' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
              <CheckSquare size={20} className={location.pathname === '/checklist' ? 'text-indigo-600' : ''} />
              Voter Steps
            </Link>
            <Link to="/rights" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/rights' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
              <ShieldAlert size={20} className={location.pathname === '/rights' ? 'text-indigo-600' : ''} />
              Know Your Rights
            </Link>
            <Link to="/quiz" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/quiz' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
              <GraduationCap size={20} className={location.pathname === '/quiz' ? 'text-indigo-600' : ''} />
              Take a Quiz
            </Link>
          </nav>
        </aside>

        {/* Content Outlet */}
        <div className="flex-1 w-full min-w-0">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
};

export default Layout;
