
import React from 'react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto whitespace-pre-line leading-relaxed text-stone-600 text-sm md:text-base">
          {content}
        </div>

        <div className="p-4 border-t border-stone-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
