import React from 'react';

interface BreathingCircleProps {
  isActive: boolean;
  scale: number;
  label: string;
  text: string | number; // The main big text (timer or countdown)
  subText?: React.ReactNode; // Optional icon or text below
  mode: 'breathing' | 'timer';
  phaseDuration?: number;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ 
  isActive, 
  scale, 
  label, 
  text, 
  subText,
  mode,
  phaseDuration
}) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 transition-all">
       {/* Background Halo */}
       <div 
         className={`absolute inset-0 rounded-full bg-teal-100/40 blur-3xl transition-all duration-1000 ${isActive ? 'scale-125 opacity-80' : 'scale-100 opacity-0'}`}
       />
       
       {/* Main Circle */}
       <div 
         className="w-48 h-48 md:w-60 md:h-60 lg:w-64 lg:h-64 rounded-full bg-teal-800 shadow-2xl flex items-center justify-center text-teal-50 z-10 relative will-change-transform"
         style={{
           transform: `scale(${scale})`,
           transition: isActive && mode === 'breathing' ? 'transform 0.1s linear' : 'transform 0.5s ease-out'
         }}
       >
          {/* Content Container */}
          {/* We counter-scale the text slightly in breathing mode if we wanted it to stay static, 
              but usually growing text effect is desired. We keep it growing with the parent. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-teal-100/80 mb-1 transition-all flex items-center justify-center gap-1">
                 {label}
                 {phaseDuration && (
                    <span className="opacity-60 text-[0.9em] font-normal tracking-normal lowercase ml-1">
                      {phaseDuration}s
                    </span>
                 )}
              </span>
              <span className={`font-light text-white tracking-tight tabular-nums animate-in fade-in duration-300 ${mode === 'timer' ? 'text-5xl md:text-7xl font-mono opacity-90' : 'text-4xl md:text-6xl'}`}>
                 {text}
              </span>
              {subText && (
                <div className="mt-2 opacity-80">{subText}</div>
              )}
          </div>
       </div>
    </div>
  );
};

export default BreathingCircle;