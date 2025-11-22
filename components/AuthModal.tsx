
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileView from './ProfileView';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, currentUser } = useAuth();

  if (!isOpen) return null;

  // If user is already logged in, show Profile View (Dashboard/Stats)
  if (currentUser) {
      return <ProfileView onClose={onClose} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      // Don't close immediately on signup/login so they see the profile/stats
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to authenticate. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-light text-teal-900 mb-2">
                {isLogin ? 'Sign In' : 'Join ZenFlow'}
            </h2>
            <p className="text-sm text-stone-500">
                {isLogin ? 'Welcome back to your practice.' : 'Begin your journey to mindfulness.'}
            </p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Email</label>
                <input 
                    type="email" 
                    required
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-stone-700"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Password</label>
                <input 
                    type="password" 
                    required
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-stone-700"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {!isLogin && (
              <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Confirm Password</label>
                  <input 
                      type="password" 
                      required
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-stone-700"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
              </div>
            )}

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-teal-800 text-white py-3 rounded-xl font-medium hover:bg-teal-900 transition-all active:scale-[0.98] shadow-lg shadow-teal-900/10 mt-2 disabled:opacity-70"
            >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); setConfirmPassword(''); }}
                className="text-xs text-stone-400 hover:text-teal-600 transition-colors"
            >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
