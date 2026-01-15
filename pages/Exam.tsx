
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, SubjectType, User } from '../types';
import { fetchQuestions, saveAttempt } from '../services/examService';

interface Props {
  user: User;
  onComplete: (subject: SubjectType, score: number) => void;
}

const Exam: React.FC<Props> = ({ user, onComplete }) => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const displaySubject = useMemo(() => {
    return (subject?.charAt(0).toUpperCase() + subject?.slice(1)) as SubjectType;
  }, [subject]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [loading, setLoading] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Disable back navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      alert("Back navigation is disabled during the exam.");
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchQuestions(displaySubject);
      setQuestions(data);
      setLoading(false);
    };
    loadData();
  }, [displaySubject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectAnswer = (optionIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentIdx].id]: optionIdx
    }));
  };

  const calculateScore = useCallback(() => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) score++;
    });
    return score;
  }, [questions, answers]);

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    await saveAttempt({
      userId: user.id,
      subject: displaySubject,
      answers,
      score: finalScore,
      total: questions.length
    });
    onComplete(displaySubject, finalScore);
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Preparing Question Paper...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-700 p-2 rounded-lg font-bold">KCET</div>
          <div>
            <h2 className="text-lg font-bold leading-none">{displaySubject}</h2>
            <span className="text-xs text-blue-300 opacity-80 uppercase tracking-widest">Mock Session</span>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="hidden md:block">
            <span className="text-xs text-blue-300 block uppercase font-bold">Candidate</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center border border-white/20">
            <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Question Area */}
        <main className="flex-1 flex flex-col overflow-y-auto p-6 md:p-10 border-r border-gray-100">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold text-blue-900">Question {currentIdx + 1} of {questions.length}</h3>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">+1.0</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">0.0</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xl leading-relaxed text-gray-800 mb-10 whitespace-pre-wrap">
              {currentQ.text}
            </p>

            <div className="space-y-4 max-w-2xl">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                    answers[currentQ.id] === idx
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-4 shrink-0 ${
                    answers[currentQ.id] === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`text-lg font-medium ${answers[currentQ.id] === idx ? 'text-blue-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 py-6 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-white">
            <div className="flex space-x-3">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Previous
              </button>
              <button
                disabled={currentIdx === questions.length - 1}
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600"
              >
                Next
              </button>
            </div>
            
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all hover:-translate-y-1"
            >
              Finish & Submit
            </button>
          </div>
        </main>

        {/* Question Palette Sidebar */}
        <aside className="w-full md:w-80 bg-gray-50 p-6 overflow-y-auto border-l border-gray-200">
          <h4 className="font-bold text-gray-700 mb-6 uppercase tracking-wider text-xs">Question Palette</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIdx === idx;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    isCurrent ? 'ring-2 ring-blue-500 scale-110 z-10' : ''
                  } ${
                    isAnswered ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex items-center text-xs font-medium text-gray-600">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              Answered ({Object.keys(answers).length})
            </div>
            <div className="flex items-center text-xs font-medium text-gray-600">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2"></div>
              Not Answered ({questions.length - Object.keys(answers).length})
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">!</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit Exam?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              You have answered <strong>{Object.keys(answers).length}</strong> out of {questions.length} questions. Are you sure you want to end this session?
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Yes, Submit Now
              </button>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                No, Keep Working
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
