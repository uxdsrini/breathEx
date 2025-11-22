import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
  const { login, signup, currentUser, logout } = useAuth();

  if (!isOpen) return null;

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
      onClose();
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      // Simple error message formatting
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

  const handleLogout = async () => {
    try {
        await logout();
        onClose();
    } catch {
        setError("Failed to log out");
    }
  }

  // If user is already logged in, show profile view
  if (currentUser) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300 text-center">
                 <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-stone-800 mb-1">Welcome Back</h2>
                <p className="text-sm text-stone-500 mb-6">{currentUser.email}</p>
                
                <button 
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors text-sm font-medium"
                >
                    Sign Out
                </button>
            </div>
        </div>
      )
  }

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