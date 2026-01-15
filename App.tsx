
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { User, SubjectType, Scores } from './types';
import Landing from './pages/Landing';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import Result from './pages/Result';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kcet_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [scores, setScores] = useState<Scores>(() => {
    const saved = localStorage.getItem('kcet_scores');
    return saved ? JSON.parse(saved) : { Physics: null, Chemistry: null, Mathematics: null };
  });

  const handleSetUser = (u: User) => {
    setUser(u);
    localStorage.setItem('kcet_user', JSON.stringify(u));
  };

  const handleUpdateScore = (subject: SubjectType, score: number) => {
    const newScores = { ...scores, [subject]: score };
    setScores(newScores);
    localStorage.setItem('kcet_scores', JSON.stringify(newScores));
  };

  const resetExam = () => {
    const initialScores = { Physics: null, Chemistry: null, Mathematics: null };
    setScores(initialScores);
    localStorage.removeItem('kcet_scores');
    // Keep user info for convenience unless specifically requested
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Registration onRegister={handleSetUser} />} />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} scores={scores} onReset={resetExam} /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/exam/:subject" 
            element={user ? <Exam user={user} onComplete={handleUpdateScore} /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/result" 
            element={user ? <Result scores={scores} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
