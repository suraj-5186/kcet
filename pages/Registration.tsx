
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../services/examService';
import { User } from '../types';

interface Props {
  onRegister: (user: User) => void;
}

const Registration: React.FC<Props> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    // Timeout safety: if it takes more than 3 seconds, proceed anyway (Demo Mode)
    const timeout = setTimeout(() => {
      if (isLoading) {
        const localUser = { id: `demo_${Date.now()}`, name, mobile };
        onRegister(localUser);
        navigate('/dashboard');
      }
    }, 3000);

    try {
      const userId = await saveUser(name, mobile);
      clearTimeout(timeout);
      onRegister({ id: userId, name, mobile });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Fallback
      onRegister({ id: `fallback_${Date.now()}`, name, mobile });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Candidate Details</h2>
        <p className="text-gray-500 mb-8">Please enter your information to proceed to the test portal.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number (Optional)</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              isLoading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1'
            }`}
          >
            {isLoading ? 'Entering Portal...' : 'Proceed to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
