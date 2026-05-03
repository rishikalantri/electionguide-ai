import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Default to English
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
  ];

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
  };

  const translate = async (text) => {
    if (currentLanguage === 'en') return text;
    
    try {
      const response = await axios.post('http://localhost:5001/api/tools/translate', {
        text,
        targetLanguage: currentLanguage
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Fallback to original text
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
