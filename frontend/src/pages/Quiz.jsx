import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const quizData = [
  {
    question: "What is the minimum age required to vote in India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    answer: 1
  },
  {
    question: "Which form is used for registering as a new voter?",
    options: ["Form 6", "Form 7", "Form 8", "Form 49A"],
    answer: 0
  },
  {
    question: "What does EVM stand for?",
    options: ["Electronic Voting Machine", "Electoral Verification Module", "Election Voting Management", "Early Voting Method"],
    answer: 0
  },
  {
    question: "What is NOTA?",
    options: ["Notice of Temporary Absence", "None of the Above", "National Office for Tribal Affairs", "New Online Tracking App"],
    answer: 1
  },
  {
    question: "How long is the VVPAT slip visible through the glass window?",
    options: ["3 seconds", "5 seconds", "7 seconds", "10 seconds"],
    answer: 2
  },
  {
    question: "What is Rule 49P used for?",
    options: ["Registering a new political party", "Filing a complaint against a candidate", "Casting a tendered vote if someone else voted in your name", "Applying for a duplicate voter ID"],
    answer: 2
  },
  {
    question: "Which app allows citizens to report Model Code of Conduct violations?",
    options: ["Voter Helpline", "cVIGIL", "Garuda App", "Suvidha App"],
    answer: 1
  },
  {
    question: "When does the 'Silence Period' for campaigning begin before polling?",
    options: ["24 hours before", "48 hours before", "72 hours before", "1 week before"],
    answer: 1
  },
  {
    question: "Can an NRI (Non-Resident Indian) vote in Indian elections?",
    options: ["No, they cannot vote", "Yes, they can vote online", "Yes, but they must be physically present at their polling booth", "Yes, they can vote at Indian Embassies"],
    answer: 2
  },
  {
    question: "Who conducts the general elections to the Lok Sabha in India?",
    options: ["State Election Commission", "President of India", "Election Commission of India", "Ministry of Home Affairs"],
    answer: 2
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === quizData[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      submitScore();
    }
  };

  const submitScore = async () => {
    setIsSubmitting(true);
    try {
      const sessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
      // This will hit the backend we created, handling mocked responses internally if no Firestore
      await axios.post(`${import.meta.env.VITE_API_URL}/api/quiz/score`, {

        sessionId,
        score,
        totalQuestions: quizData.length
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / quizData.length) * 100);
    let message = '';
    
    if (percentage >= 80) message = 'Excellent! You are a highly informed voter.';
    else if (percentage >= 50) message = 'Good job! You know the basics of the electoral process.';
    else message = 'Keep learning! Check out the Election Journey and Rights pages to learn more.';

    return (
      <div className="max-w-2xl mx-auto py-12 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-md border border-slate-200 text-center w-full"
        >
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h1>
          <p className="text-slate-600 mb-8">{message}</p>
          
          <div className="flex justify-center items-end gap-2 mb-10">
            <span className="text-6xl font-black text-primary">{score}</span>
            <span className="text-2xl font-bold text-slate-400 mb-1">/ {quizData.length}</span>
          </div>

          <button 
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
          >
            <RotateCcw size={20} /> Take Quiz Again
          </button>
        </motion.div>
      </div>
    );
  }

  const q = quizData[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Election Knowledge Quiz</h1>
        <div className="bg-slate-100 px-4 py-2 rounded-lg font-medium text-slate-600">
          Question {currentQuestion + 1} of {quizData.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {q.question}
        </h2>

        <div className="space-y-4">
          {q.options.map((option, index) => {
            let stateClass = 'bg-slate-50 border-slate-200 hover:border-primary/50 hover:bg-slate-100';
            let icon = null;
            
            if (isAnswered) {
              if (index === q.answer) {
                stateClass = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                icon = <CheckCircle2 className="text-emerald-500" />;
              } else if (index === selectedOption) {
                stateClass = 'bg-red-50 border-red-500 text-red-900';
                icon = <XCircle className="text-red-500" />;
              } else {
                stateClass = 'bg-slate-50 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateClass}`}
              >
                <span className="font-medium text-lg">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm"
          >
            {currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
            <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
