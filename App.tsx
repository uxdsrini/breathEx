import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PRESETS } from './constants';
import { AppState, PhaseType, Preset } from './types';
import PresetSelector from './components/PresetSelector';
import ZenGuide from './components/ZenGuide';
import InfoModal from './components/InfoModal';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import { useAuth } from './contexts/AuthContext';

// Helper to format time MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const { currentUser, loading } = useAuth();
  
  // Breathing State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalSessionTime, setTotalSessionTime] = useState(0); // Time elapsed
  
  // Timer Mode State
  const [timerDuration, setTimerDuration] = useState(PRESETS[0].defaultDuration ? PRESETS[0].defaultDuration * 60 : 0);
  
  // Refs for loop
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Initialize based on preset
  const initPreset = useCallback((preset: Preset) => {
    setActivePreset(preset);
    setAppState(AppState.Idle);
    setTotalSessionTime(0);
    
    if (preset.type === 'breathing' && preset.phases) {
      setCurrentPhaseIndex(0);
      setPhaseTimeLeft(preset.phases[0].duration);
    } else if (preset.type === 'timer') {
      setTimerDuration((preset.defaultDuration || 10) * 60);
    }
  }, []);

  // Main Loop
  const animate = useCallback((time: number) => {
    if (appState !== AppState.Running) return;

    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // seconds

      setTotalSessionTime(prev => prev + deltaTime);

      if (activePreset.type === 'breathing' && activePreset.phases) {
        setPhaseTimeLeft(prev => {
          const newTime = prev - deltaTime;
          // Logic for switching is handled in useEffect to avoid state thrashing in loop
          return newTime;
        });
      } else if (activePreset.type === 'timer') {
        setTimerDuration(prev => {
          const newTime = prev - deltaTime;
          if (newTime <= 0) {
            setAppState(AppState.Completed);
            return 0;
          }
          return newTime;
        });
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [appState, activePreset]);

  // Effect to handle phase switching for breathing
  useEffect(() => {
    if (activePreset.type === 'breathing' && activePreset.phases && appState === AppState.Running) {
      // If we hit <= 0 (allow small epsilon for float errors)
      if (phaseTimeLeft <= 0.05) {
         const nextIndex = (currentPhaseIndex + 1) % activePreset.phases.length;
         setCurrentPhaseIndex(nextIndex);
         setPhaseTimeLeft(activePreset.phases[nextIndex].duration);
      }
    }
  }, [phaseTimeLeft, activePreset, appState, currentPhaseIndex]);

  // Start/Stop/Reset logic
  useEffect(() => {
    if (appState === AppState.Running) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [appState, animate]);

  const toggleTimer = () => {
    if (appState === AppState.Running) {
      setAppState(AppState.Paused);
    } else {
      setAppState(AppState.Running);
    }
  };

  const reset = () => {
    initPreset(activePreset);
  };

  // Visual Scaling Logic calculation for the visualizer
  const getVisualState = () => {
    if (!activePreset.phases) {
      return { 
        style: { transform: 'scale(1)', transition: 'transform 0.5s ease-out' }, 
        label: 'Focus' 
      };
    }
    
    const phase = activePreset.phases[currentPhaseIndex];
    const progress = 1 - (phaseTimeLeft / phase.duration); // 0 to 1
    
    let targetScale = 1;
    
    const prevPhaseIndex = currentPhaseIndex === 0 ? activePreset.phases.length - 1 : currentPhaseIndex - 1;
    const prevPhase = activePreset.phases[prevPhaseIndex];
    const isPrevInhale = prevPhase.type === PhaseType.Inhale;
    
    if (phase.type === PhaseType.Inhale) {
        // Lerp 1 -> 1.8
        targetScale = 1 + (progress * 0.8);
    } else if (phase.type === PhaseType.Exhale) {
        // Lerp 1.8 -> 1
        targetScale = 1.8 - (progress * 0.8);
    } else if (phase.type === PhaseType.Hold) {
        // Maintain previous scale
        if (isPrevInhale || (prevPhase.type === PhaseType.Hold && prevPhaseIndex > 0 && activePreset.phases[prevPhaseIndex-1].type === PhaseType.Inhale)) {
             targetScale = 1.8;
        } else {
            targetScale = 1;
        }
    }
    
    return {
        style: {
            transform: `scale(${targetScale})`,
            transition: 'transform 0.1s linear', 
        },
        label: phase.label
    };
  };

  const { style: dynamicStyle, label: currentLabel } = (appState === AppState.Running && activePreset.type === 'breathing')
    ? getVisualState() 
    : { 
        style: { transform: 'scale(1)', transition: 'transform 0.5s ease-out' }, 
        label: activePreset.type === 'breathing' ? 'Ready' : 'Focus' 
      };

  // --- AUTHENTICATION GATING ---
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-stone-50 flex items-center justify-center">
        <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LandingPage onConnect={() => setIsAuthOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  // --- MAIN APPLICATION ---

  return (
    <div className="relative h-[100dvh] w-full flex flex-col bg-stone-50 selection:bg-teal-100 overflow-hidden animate-in fade-in duration-700">
      
      {/* Header */}
      <header className={`flex-none w-full p-6 md:p-8 flex justify-between items-center z-20 transition-opacity duration-700 ${appState === AppState.Running ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tighter text-teal-900 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-600 block"></span>
          ZenFlow
        </h1>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-sm text-stone-400 font-medium">
              {appState === AppState.Running ? 'Focus Mode' : 'Ready'}
           </div>
           
           {/* User Profile Button */}
           <button 
             onClick={() => setIsAuthOpen(true)}
             className="flex items-center gap-2 bg-white border border-stone-200 hover:border-teal-300 rounded-full py-1.5 px-2 pr-4 transition-all shadow-sm hover:shadow-md group"
           >
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center overflow-hidden group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                   <span className="font-bold text-sm">{currentUser.email?.[0].toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-stone-600 group-hover:text-teal-800">
                  Profile
              </span>
           </button>
        </div>
      </header>

      {/* Main Content Area - Flex Grow to take available space */}
      <main className="flex-grow flex flex-col items-center justify-center w-full relative z-10 pb-36 md:pb-32 pt-4">
        
        {/* 1. Visualizer Circle */}
        <div className="flex-none relative mb-6 md:mb-12">
           <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 transition-all">
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full bg-teal-100/40 blur-3xl transition-all duration-1000 ${appState === AppState.Running ? 'scale-125 opacity-80' : 'scale-100 opacity-0'}`}></div>
              
              {/* The Circle itself */}
              <div 
                className="w-48 h-48 md:w-60 md:h-60 lg:w-64 lg:h-64 rounded-full bg-teal-800 shadow-2xl flex items-center justify-center text-teal-50 z-10 relative"
                style={dynamicStyle}
              >
                  {/* Breathing Content (Inside Circle) */}
                  {activePreset.type === 'breathing' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-teal-100/80 mb-1 transition-all">
                             {appState === AppState.Running ? currentLabel : 'Start'}
                          </span>
                          {appState === AppState.Running && (
                             <span className="text-4xl md:text-6xl font-light text-white tracking-tight tabular-nums animate-in fade-in duration-300">
                                {Math.max(0, Math.ceil(phaseTimeLeft))}
                             </span>
                          )}
                          {appState !== AppState.Running && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white opacity-80 mt-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          )}
                      </div>
                  )}
              </div>
              
              {/* Timer Overlay (for non-breathing presets) */}
              {activePreset.type === 'timer' && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                     <span className="text-5xl md:text-7xl font-light text-white tracking-widest font-mono opacity-90 drop-shadow-sm">
                        {formatTime(Math.ceil(timerDuration))}
                     </span>
                 </div>
              )}
           </div>
        </div>

        {/* 2. Dynamic Action Area (Text vs Controls) - Replaces Absolute Positioning */}
        <div className="w-full max-w-md px-6 flex flex-col items-center min-h-[160px] relative">
          
          {/* IDLE STATE CONTENT */}
          <div className={`absolute inset-0 flex flex-col items-center transition-all duration-500 ${appState !== AppState.Idle ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <h2 className="text-2xl md:text-3xl font-light text-stone-800 mb-2 text-center">{activePreset.name}</h2>
            {/* Fixed: Removed line-clamp and increased max-width to allow text to flow naturally on mobile */}
            <p className="text-sm md:text-base text-stone-500 leading-relaxed text-center max-w-sm mx-auto">{activePreset.description}</p>
            
            <div className="flex flex-col items-center gap-5 mt-5">
               <button 
                onClick={toggleTimer}
                className="bg-teal-800 text-white hover:bg-teal-700 h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
              </button>

              <button 
                onClick={() => setIsInfoOpen(true)}
                className="text-teal-700 text-xs md:text-sm font-medium hover:text-teal-900 hover:underline underline-offset-4 decoration-teal-300/50 transition-colors flex items-center gap-1 group"
              >
                Learn benefits & technique
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* RUNNING/PAUSED STATE CONTENT */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${appState === AppState.Idle ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
             <div className="flex items-center gap-6">
                <button 
                  onClick={reset}
                  className="w-12 h-12 rounded-full border border-stone-300 bg-white text-stone-400 hover:text-stone-600 hover:border-stone-400 flex items-center justify-center transition-all active:scale-95"
                  title="Reset"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>

                <button 
                  onClick={toggleTimer}
                  className="h-16 w-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-white text-stone-800 hover:bg-stone-100 border border-stone-200"
                >
                  {appState === AppState.Running ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  )}
                </button>
             </div>
             <p className="mt-4 text-stone-400 text-sm font-medium animate-pulse">{appState === AppState.Paused ? 'Paused' : 'Focus...'}</p>
          </div>

        </div>
      </main>

      {/* Preset Menu (Bottom) */}
      <div className={`fixed bottom-0 w-full bg-gradient-to-t from-stone-50 via-stone-50 to-transparent pt-8 pb-2 z-20`}>
        <PresetSelector 
          currentPresetId={activePreset.id} 
          onSelect={initPreset} 
          disabled={appState === AppState.Running}
        />
      </div>

      {/* Info Modal */}
      <InfoModal 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
        preset={activePreset} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* AI Zen Guide */}
      <ZenGuide contextPresetName={activePreset.name} />

    </div>
  );
};

export default App;