import React from 'react';
import { ShieldAlert, Book, Eye, Volume2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Rights = () => {
  const rights = [
    {
      id: 'nota',
      title: 'NOTA (None of the Above)',
      description: 'If you do not find any candidate suitable, you have the right to press the NOTA button on the EVM. It allows you to register a negative vote.',
      icon: ShieldAlert,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: '49p',
      title: 'Rule 49P (Tendered Vote)',
      description: 'If you find that someone else has already cast a vote in your name, you can still vote using a Tendered Ballot Paper under Rule 49P after proving your identity to the Presiding Officer.',
      icon: Book,
      color: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'vvpat',
      title: 'Verify Your Vote (VVPAT)',
      description: 'You have the right to verify your vote. After pressing the EVM button, the VVPAT machine prints a slip visible for 7 seconds confirming your choice.',
      icon: Eye,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'accessibility',
      title: 'Accessibility Support',
      description: 'Voters with disabilities (PwD) and senior citizens have the right to accessible polling stations, ramps, wheelchairs, and the option for home voting or postal ballots.',
      icon: Volume2,
      color: 'bg-emerald-100 text-emerald-700'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Know Your Rights</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">As an Indian citizen, you are empowered by the Constitution and Election Commission guidelines. Be aware of your rights at the polling booth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rights.map((right, index) => {
          const Icon = right.icon;
          return (
            <motion.div 
              key={right.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${right.color}`}>
                <Icon size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{right.title}</h2>
              <p className="text-slate-600 leading-relaxed">{right.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 bg-amber-50 rounded-2xl border border-amber-200 p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Filing a Complaint (cVIGIL)</h2>
        <p className="text-amber-800 mb-6">
          If you witness any violation of the Model Code of Conduct, such as bribery, freebies, or intimidation, you have the right and duty to report it. You can use the ECI's cVIGIL app to anonymously upload photos or videos of the violation.
        </p>
        <a 
          href="https://cvigil.eci.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Learn about cVIGIL <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
};

export default Rights;
