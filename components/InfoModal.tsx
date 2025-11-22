import React from 'react';
import { Preset } from '../types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: Preset;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, preset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-light text-teal-900 tracking-tight mb-2">{preset.name}</h2>
            <p className="text-stone-500 leading-relaxed">{preset.description}</p>
          </div>

          {/* Benefits Section */}
          <div>
            <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6 20.25a.75.75 0 01.75.75v.75h.75a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0v.75zM6 3a.75.75 0 01.75.75v.75h.75a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0v.75zM18 3a.75.75 0 01.75.75v.75h.75a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0v.75zM18 20.25a.75.75 0 01.75.75v.75h.75a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
              </svg>
              Benefits
            </h3>
            <ul className="space-y-3">
              {preset.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-stone-600 text-sm leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Technique Section */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              Technique
            </h3>
            <div className="space-y-4">
              {preset.technique.map((step, idx) => (
                <div key={idx} className="flex gap-4 text-sm">
                  <span className="flex-none w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-mono text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-stone-600 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-10 pt-6 border-t border-stone-100">
          <button 
            onClick={onClose}
            className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-all active:scale-[0.98]"
          >
            Got it, let's begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;