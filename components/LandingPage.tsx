
import React, { useState } from 'react';
import { FAQS, POLICIES } from '../constants';
import PolicyModal from './PolicyModal';

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  const [openPolicy, setOpenPolicy] = useState<keyof typeof POLICIES | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="h-[100dvh] w-full bg-stone-50 flex flex-col text-stone-800 overflow-y-auto selection:bg-teal-100">
      
      {/* Navigation */}
      <nav className="w-full p-6 md:p-8 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-600 block"></span>
          <h1 className="text-xl font-semibold tracking-tighter text-teal-900">ZenFlow</h1>
        </div>
        <div className="flex items-center gap-6">
            <a href="#pricing" className="hidden md:block text-sm font-medium text-stone-500 hover:text-teal-800 transition-colors">Pricing</a>
            <a href="#faq" className="hidden md:block text-sm font-medium text-stone-500 hover:text-teal-800 transition-colors">FAQ</a>
            <button 
            onClick={onConnect}
            className="text-sm font-medium bg-white border border-stone-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:border-teal-200 transition-all text-stone-600"
            >
            Sign In
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-start md:justify-center px-6 text-center pt-12 md:pt-10 pb-20">
        
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 w-full">
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

        {/* Pricing Section */}
        <div id="pricing" className="w-full max-w-5xl mx-auto mt-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-teal-900 mb-4">Simple, Transparent Pricing</h2>
                <p className="text-stone-500">Invest in your peace of mind. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                    <div className="text-lg font-medium text-stone-500 mb-2">Basic</div>
                    <div className="text-4xl font-bold text-stone-800 mb-6">Free</div>
                    <ul className="space-y-4 text-left mb-8">
                        <li className="flex items-center gap-3 text-stone-600">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            All Breathing Presets
                        </li>
                        <li className="flex items-center gap-3 text-stone-600">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Focus Timers
                        </li>
                        <li className="flex items-center gap-3 text-stone-600">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Basic Progress Tracking
                        </li>
                    </ul>
                    <button onClick={onConnect} className="w-full py-3 rounded-xl border border-stone-200 font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                        Get Started
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-teal-900 p-8 rounded-3xl border border-teal-800 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                    <div className="text-lg font-medium text-teal-200 mb-2">ZenFlow Pro</div>
                    <div className="text-4xl font-bold text-white mb-1">$9.99<span className="text-lg font-normal text-teal-300">/mo</span></div>
                    <p className="text-sm text-teal-300 mb-6">or $79.99/year (Save 33%)</p>
                    
                    <ul className="space-y-4 text-left mb-8">
                        <li className="flex items-center gap-3 text-teal-50">
                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            AI Camera Coach
                        </li>
                        <li className="flex items-center gap-3 text-teal-50">
                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Rewards Program (Earn Coupons)
                        </li>
                        <li className="flex items-center gap-3 text-teal-50">
                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Advanced Analytics & Health Score
                        </li>
                    </ul>
                    <button onClick={onConnect} className="w-full py-3 rounded-xl bg-white text-teal-900 font-bold hover:bg-teal-50 transition-colors">
                        Start 7-Day Free Trial
                    </button>
                </div>
            </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="w-full max-w-3xl mx-auto mt-32 text-left">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-teal-900 mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-white border border-stone-200 rounded-2xl overflow-hidden transition-all duration-300">
                        <button 
                            onClick={() => toggleFaq(idx)}
                            className="w-full flex justify-between items-center p-6 text-left hover:bg-stone-50 transition-colors"
                        >
                            <span className="font-medium text-stone-800">{faq.question}</span>
                            <svg 
                                className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className={`px-6 text-stone-600 leading-relaxed overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 py-12 mt-12 shrink-0">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 block"></span>
                    <span className="font-bold text-teal-900">ZenFlow</span>
                </div>
                <p className="text-sm text-stone-400">© {new Date().getFullYear()} ZenFlow Inc. Breathe easy.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-500">
                <button onClick={() => setOpenPolicy('terms')} className="hover:text-teal-700 transition-colors">Terms & Conditions</button>
                <button onClick={() => setOpenPolicy('privacy')} className="hover:text-teal-700 transition-colors">Privacy Policy</button>
                <button onClick={() => setOpenPolicy('refund')} className="hover:text-teal-700 transition-colors">Refund Policy</button>
                <button onClick={() => setOpenPolicy('subscription')} className="hover:text-teal-700 transition-colors">Subscription Terms</button>
            </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {openPolicy && (
        <PolicyModal 
            isOpen={!!openPolicy} 
            onClose={() => setOpenPolicy(null)} 
            title={POLICIES[openPolicy].title}
            content={POLICIES[openPolicy].content}
        />
      )}
    </div>
  );
};

export default LandingPage;
