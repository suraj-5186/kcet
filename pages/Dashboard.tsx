
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Scores, SubjectType } from '../types';

interface Props {
  user: User;
  scores: Scores;
  onReset: () => void;
}

const Dashboard: React.FC<Props> = ({ user, scores, onReset }) => {
  const navigate = useNavigate();
  const subjects: SubjectType[] = ['Physics', 'Chemistry', 'Mathematics'];
  
  const allComplete = subjects.every(s => scores[s] !== null);
  const totalScore = subjects.reduce((acc, s) => acc + (scores[s] || 0), 0);

  const getStatusColor = (subject: SubjectType) => {
    return scores[subject] !== null ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-100';
  };

  return (
    <div className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-500 mt-2">KCET Mock Test Dashboard • Exam Session active</p>
        </div>
        {allComplete && (
          <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl">
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Aggregate Performance</p>
            <h2 className="text-3xl font-bold">{totalScore} <span className="text-lg font-normal opacity-70">/ 180</span></h2>
            <button 
              onClick={() => navigate('/result')}
              className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors w-full"
            >
              View Full Report
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <div key={subject} className="flex flex-col">
            <button
              disabled={scores[subject] !== null}
              onClick={() => navigate(`/exam/${subject.toLowerCase()}`)}
              className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center group ${
                scores[subject] !== null 
                  ? 'bg-gray-50 border-gray-200 opacity-80 cursor-default' 
                  : 'bg-white border-transparent shadow-xl hover:shadow-2xl hover:border-blue-500 transform hover:-translate-y-2'
              }`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-colors ${
                scores[subject] !== null ? 'bg-green-500 text-white' : 'bg-blue-600 text-white group-hover:bg-blue-700'
              }`}>
                {subject[0]}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{subject}</h3>
              <p className="text-gray-500 text-sm mb-6">60 Questions • 60 Minutes • +1 Mark</p>
              
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(subject)}`}>
                {scores[subject] !== null ? `Completed: ${scores[subject]}/60` : 'Not Started'}
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-amber-50 rounded-3xl border border-amber-200">
        <h4 className="font-bold text-amber-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          Important Exam Guidelines
        </h4>
        <ul className="text-amber-700 text-sm space-y-2 list-disc list-inside">
          <li>Each subject consists of 60 Multiple Choice Questions (MCQs).</li>
          <li>Each correct answer earns 1 mark. There is <strong>no negative marking</strong>.</li>
          <li>Back navigation is disabled during the exam session.</li>
          <li>Scores are saved immediately upon subject submission.</li>
        </ul>
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
        >
          Clear all session data and restart
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
