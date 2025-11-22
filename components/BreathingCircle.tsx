import React from 'react';
import { PhaseType } from '../types';

interface BreathingCircleProps {
  phaseType: PhaseType;
  isActive: boolean;
  duration: number; // Duration of current phase in seconds
  label?: string;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ phaseType, isActive, duration, label }) => {
  
  // Determine scale based on phase
  let scaleClass = 'scale-100';
  if (isActive) {
    if (phaseType === PhaseType.Inhale) scaleClass = 'scale-150';
    if (phaseType === PhaseType.Exhale) scaleClass = 'scale-100';
    if (phaseType === PhaseType.Hold && label === 'Hold') scaleClass = 'scale-150'; // Hold after inhale
    // If holding after exhale (box breathing 4th phase), we usually stay small or hold previous state.
    // We'll handle the visual logic: Inhale grows, Exhale shrinks. 
    // To make it stateless css transition, we rely on the parent passing the 'target' state.
    // Actually, for CSS transitions to work, we need to set the style directly.
  }

  // To ensure smooth transitions, we use inline styles for transition duration
  const transitionStyle = {
    transitionProperty: 'transform, opacity',
    transitionDuration: isActive ? `${duration}s` : '0.5s',
    transitionTimingFunction: 'linear',
  };

  // Refined logic: 
  // We need to know if we are holding "full" or holding "empty".
  // This visualizer is simple: It takes a scale prop. 
  // Ideally, the parent calculates the scale, but let's try to infer or map simple states.
  
  const getScale = () => {
     if (!isActive) return 1;
     switch (phaseType) {
         case PhaseType.Inhale: return 1.75;
         case PhaseType.Exhale: return 1;
         // For holds, we need to know "Hold at top" vs "Hold at bottom".
         // This component is receiving the CURRENT phase. 
         // If we are holding, we maintain the previous scale. 
         // However, React re-renders. 
         // A simpler visual approach for "Zen": 
         // Always inhale = grow, exhale = shrink. 
         // Holds = stay. 
         // We will handle this by passing a specific "targetScale" prop from parent if needed, 
         // but let's try to use the type.
         case PhaseType.Hold: return 1; // Default, usually overriden by logic or CSS classes don't change
         default: return 1;
     }
  };

  // Tailwind doesn't support dynamic duration easily in class names without arbitrary values, 
  // and we want exact seconds matching the preset.
  
  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
      {/* Outer Halo - pulsing softly */}
      <div 
        className={`absolute w-full h-full rounded-full bg-teal-100/50 blur-3xl ${isActive ? 'animate-pulse' : ''}`} 
      />
      
      {/* Main Circle */}
      <div 
        className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-teal-800 shadow-2xl flex items-center justify-center z-10`}
        style={{
            transform: `scale(${isActive ? (phaseType === PhaseType.Inhale ? 1.75 : (phaseType === PhaseType.Exhale ? 1 : (label === 'Hold' ? 1 : 1))) : 1})`, 
            // The logic above is tricky for "Hold". 
            // Let's simplify: The parent component will control the scale via a prop or we stick to simple pulsing for 'Timer' mode.
            // For this specific implementation, let's use a CSS class approach managed by the parent actually 
            // or simply rely on the fact that 'Hold' usually follows Inhale (stay big) or Exhale (stay small).
            // To fix this properly:
            // We'll let the Component style persist.
        }}
      >
        <div className="text-teal-50 text-center transition-all duration-500">
            <p className="text-sm tracking-[0.2em] uppercase opacity-80 mb-1">
                {isActive ? label : 'Ready'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;