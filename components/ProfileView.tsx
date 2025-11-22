
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
import Leaderboard from './Leaderboard';

interface ProfileViewProps {
  onClose: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const { currentUser, logout, userStats } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard'>('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85dvh]">
        
        {/* Header */}
        <div className="p-6 pb-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                 {currentUser.email?.[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-800 text-sm">{currentUser.email?.split('@')[0]}</span>
                <span className="text-xs text-stone-400">Member since {new Date().getFullYear()}</span>
              </div>
           </div>
           <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-stone-50 gap-2 px-6">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-white text-teal-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
           >
             Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('leaderboard')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'leaderboard' ? 'bg-white text-teal-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
           >
             Leaderboard
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white">
           {activeTab === 'dashboard' && userStats && <Dashboard stats={userStats} />}
           {activeTab === 'leaderboard' && <Leaderboard />}
           
           {/* Fallback if stats loading */}
           {!userStats && activeTab === 'dashboard' && (
             <div className="flex justify-center py-10"><div className="w-5 h-5 bg-teal-500 rounded-full animate-ping"></div></div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50">
           <button 
             onClick={handleLogout}
             className="w-full py-3 rounded-xl border border-stone-200 text-stone-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors text-sm font-medium"
           >
             Sign Out
           </button>
        </div>
        
      </div>
    </div>
  );
};

export default ProfileView;
