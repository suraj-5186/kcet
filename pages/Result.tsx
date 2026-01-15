
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scores } from '../types';

interface Props {
  scores: Scores;
}

const Result: React.FC<Props> = ({ scores }) => {
  const navigate = useNavigate();
  const physics = scores.Physics || 0;
  const chemistry = scores.Chemistry || 0;
  const maths = scores.Mathematics || 0;
  const total = physics + chemistry + maths;
  
  const percentage = ((total / 180) * 100).toFixed(1);

  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col items-center bg-gray-50">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-widest mb-4">
            Official Report
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Mock Results</h1>
          <p className="text-gray-500 text-lg">Your performance summary across all subjects</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden mb-10 border border-gray-100">
          <div className="bg-indigo-600 p-12 text-center text-white">
            <p className="text-indigo-200 font-medium uppercase tracking-widest text-sm mb-2">Total Combined Score</p>
            <div className="text-8xl font-black mb-4 flex items-center justify-center">
              {total} <span className="text-3xl font-normal opacity-50 ml-4">/ 180</span>
            </div>
            <div className="inline-flex items-center px-6 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/20">
              <span className="font-bold mr-2 text-xl">{percentage}%</span>
              <span className="opacity-70 text-sm">Overall Accuracy</span>
            </div>
          </div>

          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Physics', score: physics, color: 'blue' },
                { label: 'Chemistry', score: chemistry, color: 'emerald' },
                { label: 'Mathematics', score: maths, color: 'amber' }
              ].map(subj => (
                <div key={subj.label} className="text-center">
                  <div className={`w-full h-2 rounded-full bg-gray-100 mb-6 overflow-hidden`}>
                    <div 
                      className={`h-full bg-${subj.color}-500 transition-all duration-1000 ease-out`}
                      style={{ width: `${(subj.score / 60) * 100}%` }}
                    ></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{subj.label}</h3>
                  <p className="text-3xl font-black text-gray-900">{subj.score} <span className="text-sm font-medium text-gray-400">/ 60</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4">Performance Insights</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Highest Score Subject</span>
                <span className="font-bold text-green-600">
                  {Math.max(physics, chemistry, maths) === physics ? 'Physics' : 
                   Math.max(physics, chemistry, maths) === chemistry ? 'Chemistry' : 'Mathematics'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Correct Questions</span>
                <span className="font-bold text-gray-900">{total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Suggested Improvement</span>
                <span className="font-bold text-amber-600">
                  {Math.min(physics, chemistry, maths) === physics ? 'Physics' : 
                   Math.min(physics, chemistry, maths) === chemistry ? 'Chemistry' : 'Mathematics'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-center">
            <h4 className="font-bold mb-2">Ready for the real KCET?</h4>
            <p className="text-blue-200 text-sm mb-6">Take another mock test to improve your speed and accuracy.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-950/20"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
