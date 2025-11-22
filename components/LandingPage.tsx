import React from 'react';

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  return (
    <div className="h-[100dvh] w-full bg-stone-50 flex flex-col text-stone-800 overflow-y-auto selection:bg-teal-100">
      
      {/* Navigation */}
      <nav className="w-full p-6 md:p-8 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-600 block"></span>
          <h1 className="text-xl font-semibold tracking-tighter text-teal-900">ZenFlow</h1>
        </div>
        <button 
          onClick={onConnect}
          className="text-sm font-medium text-stone-500 hover:text-teal-800 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-start md:justify-center px-6 text-center pt-12 md:pt-10 pb-20">
        
        <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-700 delay-100 fill-mode-backwards">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold tracking-wider uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Mindfulness Reimagined
          </div>
          
          <h2 className="text-5xl md:text-7xl font-light text-teal-950 tracking-tight leading-[1.1]">
            Find your center in a <span className="font-serif italic text-teal-600">noisy world.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            A hyper-minimalist companion for deep work, anxiety relief, and daily calm. 
            Powered by ancient breathing techniques and modern AI wisdom.
          </p>

          <div className="pt-8">
            <button 
              onClick={onConnect}
              className="group relative inline-flex items-center gap-3 bg-teal-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-teal-900 transition-all shadow-xl shadow-teal-900/10 hover:shadow-2xl hover:-translate-y-1"
            >
              Begin Your Practice
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 w-full pb-12">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards text-left">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-teal-900 mb-2">Scientific Breathing</h3>
                <p className="text-stone-500 leading-relaxed">
                    Master presets like Box Breathing and 4-7-8 to instantly regulate your nervous system and reduce stress.
                </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-backwards text-left">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-teal-900 mb-2">Deep Focus Timer</h3>
                <p className="text-stone-500 leading-relaxed">
                    Distraction-free timers for Zazen meditation or Pomodoro focus sessions to boost productivity.
                </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-in slide-in-from-bottom-8 duration-700 delay-400 fill-mode-backwards text-left">
                 <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-teal-900 mb-2">AI Zen Guide</h3>
                <p className="text-stone-500 leading-relaxed">
                    Personalized, philosophy-driven guidance to answer your questions and clear your mind before practice.
                </p>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-stone-400 text-sm shrink-0">
        <p>© {new Date().getFullYear()} ZenFlow. Breathe easy.</p>
      </footer>
    </div>
  );
};

export default LandingPage;