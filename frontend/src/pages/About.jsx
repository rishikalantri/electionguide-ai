import React from 'react';
import { Info, ExternalLink, ShieldAlert, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const sources = [
    {
      id: 'voter-portal',
      title: 'ECI Voters Service Portal',
      description: 'Official portal for voter registration, application tracking, and downloading e-EPIC.',
      url: 'https://voters.eci.gov.in/',
    },
    {
      id: 'electoral-search',
      title: 'Electoral Search',
      description: 'Search your name in the electoral roll and find your polling station details.',
      url: 'https://electoralsearch.eci.gov.in/',
    },
    {
      id: 'evm-vvpat',
      title: 'EVM & VVPAT Information',
      description: 'Official ECI documentation on the operation and security of Electronic Voting Machines and Voter Verifiable Paper Audit Trails.',
      url: 'https://www.eci.gov.in/evm-vvpat',
    },
    {
      id: 'mcc',
      title: 'Model Code of Conduct',
      description: 'Guidelines issued by ECI for political parties and candidates during elections.',
      url: 'https://www.eci.gov.in/mcc',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About & Sources</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">ElectionGuide AI is an educational initiative to help citizens understand the Indian democratic process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* About Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6">
            <Info size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Built for the PromptWars Virtual Challenge 2, ElectionGuide AI serves as an interactive and easy-to-follow guide for Indian citizens, especially first-time voters and non-technical users.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We aim to simplify the complex election process, timelines, and voter rights through intuitive step-by-step visuals, interactive checklists, and a politically neutral AI assistant.
          </p>
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center text-sm text-slate-500 gap-2">
            Made with <Heart size={16} className="text-rose-500 fill-rose-500" /> for Indian Democracy
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-6">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Important Disclaimer</h2>
          <p className="text-amber-800 leading-relaxed mb-4 font-medium">
            This application is an educational tool and is completely politically neutral. It does not recommend any party, candidate, ideology, or voting choice.
          </p>
          <div className="bg-amber-100/50 p-4 rounded-xl border border-amber-200/50">
            <p className="text-amber-900 text-sm leading-relaxed">
              <strong>Verification Warning:</strong> Voter registration, personal voter status, and polling station locations should be verified <strong>ONLY</strong> through official Election Commission of India (ECI) portals.
            </p>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Official Sources & References</h2>
        <p className="text-slate-600 mb-8">All information provided in this application is based on official ECI guidelines.</p>
        
        <div className="space-y-4">
          {sources.map((source, index) => (
            <motion.div 
              key={source.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a 
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary/40 hover:bg-slate-100 transition-all gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-2">
                    {source.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{source.description}</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/40 transition-colors shrink-0">
                  <ExternalLink size={18} />
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
