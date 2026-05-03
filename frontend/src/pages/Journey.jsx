import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  UserPlus, 
  Search, 
  Calendar, 
  BookOpen, 
  FileSignature, 
  Megaphone, 
  Vote, 
  Monitor, 
  Calculator, 
  Trophy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Journey = () => {
  const { currentLanguage } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'registration',
      title: 'Registration',
      description: 'The first step is to register as a voter. You can apply online using Form 6 on the Voter Service Portal or offline through a Booth Level Officer (BLO).',
      icon: UserPlus,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100'
    },
    {
      id: 'electoral-roll',
      title: 'Electoral Roll',
      description: 'Your name is added to the Electoral Roll (voter list). Always verify your name in the list before the election date.',
      icon: Search,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-100'
    },
    {
      id: 'announcement',
      title: 'Election Announcement',
      description: 'The Election Commission of India (ECI) announces the election schedule, detailing the phases, polling dates, and counting date.',
      icon: Calendar,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100'
    },
    {
      id: 'mcc',
      title: 'Model Code of Conduct',
      description: 'The MCC comes into effect immediately after the announcement. It sets guidelines for political parties and candidates to ensure free and fair elections.',
      icon: BookOpen,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100'
    },
    {
      id: 'nomination',
      title: 'Nomination',
      description: 'Candidates file their nomination papers, declaring their assets, criminal records, and educational qualifications (Form 26).',
      icon: FileSignature,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-100'
    },
    {
      id: 'campaigning',
      title: 'Campaigning',
      description: 'Parties and candidates campaign to win voter support. Campaigning ends 48 hours before polling begins (Silence Period).',
      icon: Megaphone,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-100'
    },
    {
      id: 'polling',
      title: 'Polling Day',
      description: 'Voters go to their designated polling station to cast their vote using EVMs. Always carry a valid ID card.',
      icon: Vote,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-100'
    },
    {
      id: 'evm-vvpat',
      title: 'EVM/VVPAT',
      description: 'After pressing the button on the EVM, the VVPAT prints a slip visible for 7 seconds to verify your vote was recorded correctly.',
      icon: Monitor,
      color: 'bg-cyan-500',
      lightColor: 'bg-cyan-100'
    },
    {
      id: 'counting',
      title: 'Counting',
      description: 'On the scheduled date, EVMs are opened under heavy security and the votes are counted in the presence of candidate representatives.',
      icon: Calculator,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100'
    },
    {
      id: 'results',
      title: 'Results',
      description: 'The ECI declares the official results. The candidate with the highest number of valid votes in a constituency wins.',
      icon: Trophy,
      color: 'bg-green-500',
      lightColor: 'bg-green-100'
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const ActiveIcon = steps[activeStep].icon;

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Election Journey</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Follow the step-by-step process of how elections are conducted in the world's largest democracy.</p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        {/* Timeline Navigation - Left Side (Desktop) / Top (Mobile) */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-20">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isPast = index < activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center gap-3 p-3 rounded-xl min-w-[200px] lg:min-w-0 transition-all text-left ${
                    isActive 
                      ? `${step.lightColor} border ${step.color.replace('bg-', 'border-')}` 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isActive ? step.color + ' text-white' : 
                    isPast ? 'bg-slate-200 text-slate-500' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${isActive ? step.color.replace('bg-', 'text-') : 'text-slate-500'}`}>
                      STEP {index + 1}
                    </p>
                    <p className={`font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area - Right Side */}
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden"
            >
              <div className={`h-32 md:h-48 ${steps[activeStep].color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 pattern-dots"></div>
                <ActiveIcon size={80} className="text-white opacity-90 drop-shadow-md z-10" />
              </div>
              
              <div className="p-8 md:p-12">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 text-slate-500 bg-slate-100">
                  Step {activeStep + 1} of {steps.length}
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  {steps[activeStep].title}
                </h2>
                
                <p className="text-lg text-slate-700 leading-relaxed mb-10">
                  {steps[activeStep].description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    onClick={handlePrev}
                    disabled={activeStep === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                      activeStep === 0 
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                      activeStep === steps.length - 1 
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-blue-800 shadow-sm'
                    }`}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Journey;
