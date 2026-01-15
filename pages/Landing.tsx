
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { seedQuestions } from '../services/examService';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to initialize the Firestore database with 180 questions? This should be done once by the admin.")) return;
    
    setIsSeeding(true);
    setSeedStatus("Uploading questions...");
    try {
      await seedQuestions();
      setSeedStatus("Success! Database populated.");
      setTimeout(() => setSeedStatus(null), 5000);
    } catch (err) {
      setSeedStatus("Error: Check console or Firebase keys.");
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          KCET Mock Master
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-blue-100 opacity-90 leading-relaxed">
          The ultimate platform for Karnataka Common Entrance Test preparation. 
          Experience real-time exam conditions and boost your confidence.
        </p>
        
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={() => navigate('/register')}
            className="w-full md:w-auto px-12 py-5 bg-white text-blue-700 rounded-full font-bold text-xl shadow-2xl hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95"
          >
            Start KCET Mock Test
          </button>

          {/* Setup Tool for Owner */}
          <div className="pt-8">
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className={`text-xs font-medium px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors ${isSeeding ? 'opacity-50' : ''}`}
            >
              {isSeeding ? 'Seeding...' : 'Setup: Seed Questions to Firestore'}
            </button>
            {seedStatus && (
              <p className="text-xs mt-2 font-bold animate-pulse">{seedStatus}</p>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">180 MCQs</h3>
            <p className="text-blue-100 text-sm">Full syllabus coverage across Physics, Chemistry, and Mathematics.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Real CBT Interface</h3>
            <p className="text-blue-100 text-sm">Familiarize yourself with the Computer Based Test environment.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-blue-100 text-sm">Get subject-wise and total scores immediately after submission.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
