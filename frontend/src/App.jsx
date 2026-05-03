import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import AskAi from './pages/AskAi';
import Journey from './pages/Journey';
import Checklist from './pages/Checklist';
import Rights from './pages/Rights';
import Quiz from './pages/Quiz';
import About from './pages/About';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ask" element={<Home />} />
            <Route path="journey" element={<Journey />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="rights" element={<Rights />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
