import React, { useState } from 'react';
import { getZenWisdom } from '../services/geminiService';

interface ZenGuideProps {
  contextPresetName: string;
}

const ZenGuide: React.FC<ZenGuideProps> = ({ contextPresetName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const wisdom = await getZenWisdom(query, `User is about to practice ${contextPresetName}`);
    setResponse(wisdom);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-36 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-stone-600 p-3 rounded-full shadow-lg transition-all hover:scale-105 z-40 border border-stone-100 group"
        title="Ask Zen Guide"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-pulse"></span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-stone-800">Zen Guide</h3>
          <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600 p-2 bg-stone-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!response ? (
          <div className="space-y-4 pb-4">
            <p className="text-stone-600 text-sm">How are you feeling right now? Or what seeks clarity?</p>
            <textarea 
              className="w-full border border-stone-200 rounded-lg p-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none bg-stone-50"
              rows={3}
              placeholder="e.g., I feel scattered and anxious..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={handleAsk}
              disabled={loading || !query}
              className={`w-full py-3 rounded-lg font-medium transition-all ${loading || !query ? 'bg-stone-200 text-stone-400' : 'bg-teal-700 text-white hover:bg-teal-800 shadow-md hover:shadow-lg'}`}
            >
              {loading ? 'Meditating on answer...' : 'Seek Wisdom'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center py-4 pb-8">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 mx-auto text-teal-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <p className="text-lg text-stone-800 italic leading-relaxed font-light">"{response}"</p>
            <button 
              onClick={() => { setResponse(null); setQuery(''); }}
              className="text-xs text-stone-400 hover:text-teal-600 uppercase tracking-widest border border-stone-200 px-4 py-2 rounded-full"
            >
              Ask Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZenGuide;