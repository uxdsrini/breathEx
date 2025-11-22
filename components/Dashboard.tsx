
import React from 'react';
import { UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  
  // Helper to calculate progress circle stroke
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = circumference - ((stats.zenScore || 0) / 100) * circumference;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Health Score Card */}
      <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-teal-900 font-semibold text-lg">Mindfulness Score</h3>
          <p className="text-stone-500 text-xs mt-1 max-w-[140px]">
            Based on your consistency, volume, and frequency.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-100 px-2 py-1 rounded">
              {stats.zenScore > 80 ? 'Master' : stats.zenScore > 50 ? 'Advanced' : 'Beginner'}
            </span>
            <span className="text-xs text-stone-400">Level {stats.level}</span>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-stone-100"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
              strokeLinecap="round"
              className="text-teal-500 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-teal-800">{stats.zenScore || 0}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-wider font-bold mb-1">Streak</div>
          <div className="text-2xl font-light text-stone-800 flex items-baseline gap-1">
            {stats.currentStreak} <span className="text-sm text-stone-400">days</span>
          </div>
        </div>
        
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-wider font-bold mb-1">Total Time</div>
          <div className="text-2xl font-light text-stone-800 flex items-baseline gap-1">
            {stats.totalMinutes} <span className="text-sm text-stone-400">min</span>
          </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-wider font-bold mb-1">Sessions</div>
          <div className="text-2xl font-light text-stone-800">
            {stats.totalSessions}
          </div>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-wider font-bold mb-1">Points</div>
          <div className="text-2xl font-light text-teal-700">
            {stats.totalPoints?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Mini-Chart (Visualization of consistency) */}
      <div className="bg-white border border-stone-100 rounded-xl p-4">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Activity Distribution</h4>
        <div className="flex items-end gap-2 h-16">
          {/* Simulated bars for visual aesthetic - in real app, map over last 7 days history */}
          <div className="flex-1 bg-stone-100 rounded-t-sm h-[30%]"></div>
          <div className="flex-1 bg-stone-100 rounded-t-sm h-[60%]"></div>
          <div className="flex-1 bg-stone-100 rounded-t-sm h-[20%]"></div>
          <div className="flex-1 bg-stone-100 rounded-t-sm h-[45%]"></div>
          <div className="flex-1 bg-teal-200/50 rounded-t-sm h-[80%]"></div>
          <div className="flex-1 bg-teal-300 rounded-t-sm h-[90%]"></div>
          <div className="flex-1 bg-teal-500 rounded-t-sm h-[100%] relative group">
             {/* Tooltip idea for later */}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-stone-400 uppercase">
          <span>Last 7 Days</span>
          <span>Today</span>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
