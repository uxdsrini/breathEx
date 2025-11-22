import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PRESETS } from './constants';
import { AppState, PhaseType, Preset } from './types';
import PresetSelector from './components/PresetSelector';
import ZenGuide from './components/ZenGuide';
import InfoModal from './components/InfoModal';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import BreathingCircle from './components/BreathingCircle';
import { useAuth } from './contexts/AuthContext';
import { recordSession, calculatePoints } from './services/gamificationService';
import { triggerHaptic, HapticPatterns } from './services/hapticService';
import CameraCoach from './components/CameraCoach';
import SubscriptionModal from './components/SubscriptionModal';

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
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [isCameraMode, setIsCameraMode] = useState(false);
  
  const { currentUser, loading, userStats, isPremium } = useAuth();
  
  // Breathing State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalSessionTime, setTotalSessionTime] = useState(0); // Time elapsed
  
  // Timer Mode State
  const [timerDuration, setTimerDuration] = useState(PRESETS[0].defaultDuration ? PRESETS[0].defaultDuration * 60 : 0);
  
  // Session Analysis
  const [accuracy, setAccuracy] = useState(0);

  // Refs for loop
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  
  // Initialize based on preset
  const initPreset = useCallback((preset: Preset) => {
    setActivePreset(preset);
    setAppState(AppState.Idle);
    setTotalSessionTime(0);
    setShowCompletion(false);
    setAccuracy(0);
    
    if (preset.id === 'mindful-movement') {
       if (isPremium) {
         setIsCameraMode(true);
       } else {
         setIsCameraMode(false);
       }
    } else {
      setIsCameraMode(false);
    }
    
    if (preset.type === 'breathing' && preset.phases) {
      setCurrentPhaseIndex(0);
      setPhaseTimeLeft(preset.phases[0].duration);
    } else if (preset.type === 'timer') {
      setTimerDuration((preset.defaultDuration || 10) * 60);
    }
  }, [isPremium]);

  // Logic to handle session completion
  const handleComplete = useCallback(async (finalDuration: number, finalAccuracy?: number) => {
    setAppState(AppState.Completed);
    setShowCompletion(true);
    triggerHaptic(HapticPatterns.Success);
    
    if (currentUser && finalDuration > 10) {
      const points = calculatePoints(finalDuration);
      setLastPointsEarned(points);
      await recordSession(currentUser.uid, finalDuration, activePreset.id);
    }
  }, [currentUser, activePreset.id]);

  // Main Loop
  const animate = useCallback((time: number) => {
    if (appState !== AppState.Running) return;

    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // seconds

      setTotalSessionTime(prev => {
          const newTotal = prev + deltaTime;
          return newTotal;
      });

      if (activePreset.type === 'breathing' && activePreset.phases) {
        setPhaseTimeLeft(prev => {
          const newTime = prev - deltaTime;
          return newTime;
        });
      } else if (activePreset.type === 'timer') {
        setTimerDuration(prev => {
          const newTime = prev - deltaTime;
          if (newTime <= 0) {
            return 0;
          }
          return newTime;
        });
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [appState, activePreset]);

  // Watch for Timer Completion in loop
  useEffect(() => {
      if (activePreset.type === 'timer' && timerDuration <= 0 && appState === AppState.Running) {
          handleComplete((activePreset.defaultDuration || 10) * 60);
      }
  }, [timerDuration, appState, activePreset, handleComplete]);

  // Effect to handle phase switching for breathing
  useEffect(() => {
    if (activePreset.type === 'breathing' && activePreset.phases && appState === AppState.Running) {
      if (phaseTimeLeft <= 0.05) {
         const nextIndex = (currentPhaseIndex + 1) % activePreset.phases.length;
         setCurrentPhaseIndex(nextIndex);
         setPhaseTimeLeft(activePreset.phases[nextIndex].duration);
         triggerHaptic(HapticPatterns.PhaseChange);
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
    if (activePreset.id === 'mindful-movement' && !isPremium && !isCameraMode) {
      setIsSubModalOpen(true);
      return;
    }

    triggerHaptic(HapticPatterns.Soft);
    if (appState === AppState.Running) {
      setAppState(AppState.Paused);
    } else if (appState === AppState.Completed) {
        reset();
    } else {
      setAppState(AppState.Running);
    }
  };

  const finishEarly = () => {
      handleComplete(totalSessionTime, accuracy);
  };

  const reset = () => {
    initPreset(activePreset);
  };

  const handleCameraToggle = () => {
    if (!isPremium) {
      setIsSubModalOpen(true);
      return;
    }
    setIsCameraMode(!isCameraMode);
  };

  const adjustDuration = (minutes: number) => {
    triggerHaptic(HapticPatterns.Soft);
    setTimerDuration(prev => {
      const newDuration = prev + (minutes * 60);
      if (newDuration < 60) return 60;
      if (newDuration > 180 * 60) return 180 * 60;
      return newDuration;
    });
  };

  // --- VISUAL CALCULATIONS ---
  const calculateBreathingScale = (): number => {
    if (!activePreset.phases) return 1;
    
    const phase = activePreset.phases[currentPhaseIndex];
    const progress = 1 - (phaseTimeLeft / phase.duration); // 0 to 1
    
    let targetScale = 1;
    const prevPhaseIndex = currentPhaseIndex === 0 ? activePreset.phases.length - 1 : currentPhaseIndex - 1;
    const prevPhase = activePreset.phases[prevPhaseIndex];
    const isPrevInhale = prevPhase.type === PhaseType.Inhale;
    const isPrevHoldAtTop = prevPhase.type === PhaseType.Hold && (
       (currentPhaseIndex > 1 ? activePreset.phases[currentPhaseIndex - 2].type === PhaseType.Inhale : false)
    );
    
    if (phase.type === PhaseType.Inhale) {
        targetScale = 1 + (progress * 0.8); 
    } else if (phase.type === PhaseType.Exhale) {
        targetScale = 1.8 - (progress * 0.8); 
    } else if (phase.type === PhaseType.Hold) {
        if (isPrevInhale || isPrevHoldAtTop) {
             targetScale = 1.8;
        } else {
            targetScale = 1;
        }
    }
    return targetScale;
  };

  const isBreathing = activePreset.type === 'breathing';
  const isRunning = appState === AppState.Running;
  const currentScale = (isRunning && isBreathing) ? calculateBreathingScale() : 1;
  
  const currentLabel = (isRunning && isBreathing) 
      ? activePreset.phases?.[currentPhaseIndex].label || 'Ready'
      : (isBreathing ? 'Ready' : 'Focus');

  const currentPhaseDuration = (isRunning && isBreathing) 
      ? activePreset.phases?.[currentPhaseIndex]?.duration 
      : undefined;

  const currentMainText = (activePreset.type === 'timer')
      ? formatTime(Math.ceil(timerDuration))
      : (isRunning ? Math.ceil(phaseTimeLeft) : 'Start');

  const subIcon = !isRunning && (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white opacity-80 mt-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  );

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
           
           <button 
             onClick={() => setIsAuthOpen(true)}
             className="flex items-center gap-2 bg-white border border-stone-200 hover:border-teal-300 rounded-full py-1.5 px-2 pr-4 transition-all shadow-sm hover:shadow-md group"
           >
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center overflow-hidden group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors relative">
                   {userStats && (
                       <div className="absolute inset-0 rounded-full border-2 border-teal-500 opacity-20" 
                            style={{clipPath: `inset(${100 - (userStats.zenScore || 0)}% 0 0 0)`}}></div>
                   )}
                   <span className="font-bold text-sm z-10">{currentUser.email?.[0].toUpperCase()}</span>
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-stone-600 group-hover:text-teal-800 leading-none">
                      Profile
                  </span>
                  {isPremium ? (
                    <span className="text-[10px] text-amber-500 font-bold mt-0.5 flex items-center gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" /></svg>
                      PRO
                    </span>
                  ) : (
                    userStats && userStats.zenScore > 0 && (
                        <span className="text-[10px] text-teal-500 font-bold mt-0.5">Score: {userStats.zenScore}</span>
                    )
                  )}
              </div>
           </button>
        </div>
      </header>

      {/* Main Content Area with Scroll Support */}
      <main className="flex-grow flex flex-col items-center w-full relative z-10 pb-40 pt-4 overflow-y-auto scrollbar-hide">
        
        <div className="w-full flex flex-col items-center my-auto">
        
            {/* Completion Overlay */}
            {showCompletion && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-stone-50/90 backdrop-blur-sm animate-in zoom-in-95 duration-500 h-[100dvh]">
                    <div className="text-center px-6">
                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce text-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-light text-teal-900 mb-2">Session Complete</h2>
                        <p className="text-stone-500 mb-6">You have earned <span className="font-bold text-teal-600">+{lastPointsEarned} points</span>.</p>
                        
                        {accuracy > 0 && (
                        <div className="mb-8 bg-white p-4 rounded-xl border border-stone-100 inline-block">
                            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Movement Accuracy</div>
                            <div className="text-2xl font-mono text-teal-700">{accuracy}%</div>
                            {!isPremium && <div className="text-[10px] text-amber-500 mt-1">Upgrade to see detailed reports</div>}
                        </div>
                        )}

                        <div className="block">
                            <button 
                                onClick={reset}
                                className="bg-stone-900 text-white px-8 py-3 rounded-full hover:scale-105 transition-transform"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Coach Mode (GATED) */}
            {isCameraMode && isPremium && appState === AppState.Running ? (
                <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-stone-900 z-20">
                    <CameraCoach 
                    isActive={true} 
                    onFeedback={(text) => {}} 
                    onFinish={handleComplete}
                    />
                    <button 
                    onClick={finishEarly}
                    className="absolute top-6 right-6 bg-white/20 text-white p-2 rounded-full backdrop-blur-md z-30"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                /* Standard Mode (Breathing Circle) */
                <div className={`flex-none relative mb-6 md:mb-12 transition-all duration-500 ${showCompletion ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <BreathingCircle 
                    isActive={appState === AppState.Running}
                    mode={activePreset.type}
                    scale={currentScale}
                    label={currentLabel}
                    text={currentMainText}
                    subText={!isRunning && activePreset.type === 'breathing' ? subIcon : null}
                    phaseDuration={currentPhaseDuration}
                />
                </div>
            )}

            {/* Dynamic Action Area - Controls using CSS Grid for overlap without absolute positioning issues */}
            {(!isCameraMode || !isPremium) && (
            <div className={`w-full max-w-md px-6 grid grid-cols-1 grid-rows-1 min-h-[200px] ${showCompletion ? 'opacity-0' : ''}`}>
                
                {/* IDLE STATE CONTENT */}
                <div className={`col-start-1 row-start-1 flex flex-col items-center transition-all duration-500 ${appState !== AppState.Idle ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <h2 className="text-2xl md:text-3xl font-light text-stone-800 mb-2 text-center">{activePreset.name}</h2>
                <p className="text-sm md:text-base text-stone-500 leading-relaxed text-center max-w-sm mx-auto mb-6">{activePreset.description}</p>
                
                {/* Duration Selector for Timer Type */}
                {activePreset.type === 'timer' && (
                    <div className="flex items-center gap-4 mb-6 bg-white p-2 rounded-2xl border border-stone-100 shadow-sm">
                        <button 
                        onClick={() => adjustDuration(-1)}
                        className="w-8 h-8 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-500 flex items-center justify-center transition-colors"
                        title="Decrease duration"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                        </button>
                        <span className="text-lg font-medium text-stone-700 w-16 text-center tabular-nums">
                        {Math.floor(timerDuration / 60)}m
                        </span>
                        <button 
                        onClick={() => adjustDuration(1)}
                        className="w-8 h-8 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-500 flex items-center justify-center transition-colors"
                        title="Increase duration"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        </button>
                    </div>
                )}

                {/* Camera Toggle */}
                {activePreset.id !== 'mindful-movement' && (
                    <div className="mb-4 flex items-center gap-2">
                        <button 
                        onClick={handleCameraToggle}
                        className={`relative text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all flex items-center gap-2 ${isCameraMode ? 'bg-teal-100 text-teal-700 border-teal-200' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-300'}`}
                        >
                        {isCameraMode ? 'Camera On' : 'Camera Off'}
                        {!isPremium && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Premium Feature"></span>
                        )}
                        </button>
                    </div>
                )}
                
                {activePreset.id === 'mindful-movement' && !isPremium && (
                    <div className="mb-4 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    Premium subscription required for live guidance
                    </div>
                )}

                <div className="flex flex-col items-center gap-5 mt-1 pb-4">
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
                <div className={`col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-500 ${appState === AppState.Idle ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={finishEarly}
                        className="w-12 h-12 rounded-full border border-stone-300 bg-white text-stone-400 hover:text-teal-600 hover:border-teal-300 flex items-center justify-center transition-all active:scale-95"
                        title="Finish & Save"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
                {!isPremium && (
                    <div className="absolute -bottom-8 w-full text-center">
                    <button onClick={() => setIsSubModalOpen(true)} className="text-xs text-stone-400 hover:text-teal-600">
                        Upgrade for AI Guidance
                    </button>
                    </div>
                )}
                <p className="mt-4 text-stone-400 text-sm font-medium animate-pulse">{appState === AppState.Paused ? 'Paused' : 'Focus...'}</p>
                </div>

            </div>
            )}
        </div>
      </main>

      {/* Preset Menu */}
      <div className={`fixed bottom-0 w-full bg-gradient-to-t from-stone-50 via-stone-50 to-transparent pt-8 pb-2 z-20 ${showCompletion || (isCameraMode && appState === AppState.Running) ? 'pointer-events-none opacity-0' : ''}`}>
        <PresetSelector 
          currentPresetId={activePreset.id} 
          onSelect={initPreset} 
          disabled={appState === AppState.Running}
        />
      </div>

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} preset={activePreset} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
      <ZenGuide contextPresetName={activePreset.name} />

    </div>
  );
};

export default App;