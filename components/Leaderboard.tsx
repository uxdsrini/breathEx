
import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/gamificationService';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardUser {
  uid: string;
  email: string;
  stats: {
    totalPoints: number;
    zenScore: number;
  };
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchLB = async () => {
      try {
        const data = await getLeaderboard();
        setUsers(data as any);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLB();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-stone-400 text-sm">Loading rankings...</div>;
  }

  return (
    <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">
        <span>Practitioner</span>
        <span>Points</span>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
        {users.map((user, index) => {
          const isMe = user.uid === currentUser?.uid;
          return (
            <div 
              key={user.uid} 
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isMe ? 'bg-teal-50 border-teal-200' : 'bg-white border-stone-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-stone-100 text-stone-500'}`}>
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isMe ? 'text-teal-900' : 'text-stone-700'}`}>
                    {isMe ? 'You' : user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-stone-400">Zen Score: {user.stats?.zenScore || 0}</span>
                </div>
              </div>
              <div className="font-mono text-sm font-bold text-teal-600">
                {user.stats?.totalPoints?.toLocaleString() || 0}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-2">
        <p className="text-[10px] text-stone-400 italic">Practice daily to improve your rank.</p>
      </div>
    </div>
  );
};

export default Leaderboard;
