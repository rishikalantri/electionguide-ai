import React, { useState } from 'react';
import { CheckSquare, Square, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Checklist = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checklistItems = [
    {
      id: 'register',
      title: 'Register as a Voter',
      description: 'Fill Form 6 on the Voter Service Portal or submit it to your Booth Level Officer.',
      link: 'https://voters.eci.gov.in/'
    },
    {
      id: 'check-roll',
      title: 'Check Name in Electoral Roll',
      description: 'Ensure your name appears on the voter list for your constituency before election day.',
      link: 'https://electoralsearch.eci.gov.in/'
    },
    {
      id: 'polling-station',
      title: 'Know Your Polling Station',
      description: 'Locate your designated polling booth. You can only vote at the specific station assigned to you.'
    },
    {
      id: 'carry-id',
      title: 'Carry Valid ID',
      description: 'Bring your Voter ID (EPIC) or any of the 11 alternative official IDs (Aadhar, PAN, Passport, etc.).'
    },
    {
      id: 'booth-steps',
      title: 'Follow Polling Booth Steps',
      description: 'Check name with Polling Officer 1 -> Ink on finger by Officer 2 -> Cast vote on EVM -> Verify on VVPAT.'
    }
  ];

  const progress = Math.round((Object.values(checkedItems).filter(Boolean).length / checklistItems.length) * 100);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Voter Checklist</h1>
        <p className="text-lg text-slate-600">Complete these steps to ensure you are ready to cast your vote.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Preparation Progress</h2>
          <span className="text-primary font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
          <motion.div 
            className="bg-primary h-3 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      <div className="space-y-4">
        {checklistItems.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
              checkedItems[item.id] 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-white border-slate-200 hover:border-primary/30'
            }`}
            onClick={() => toggleCheck(item.id)}
          >
            <div className="flex items-start gap-4">
              <button className="mt-1 focus:outline-none">
                {checkedItems[item.id] ? (
                  <CheckSquare size={24} className="text-emerald-500" />
                ) : (
                  <Square size={24} className="text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-1 ${checkedItems[item.id] ? 'text-emerald-800' : 'text-slate-800'}`}>
                  {item.title}
                </h3>
                <p className={checkedItems[item.id] ? 'text-emerald-600' : 'text-slate-600'}>
                  {item.description}
                </p>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info size={14} /> View Official Source
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
