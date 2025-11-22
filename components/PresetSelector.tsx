import React from 'react';
import { Preset } from '../types';
import { PRESETS } from '../constants';

interface PresetSelectorProps {
  currentPresetId: string;
  onSelect: (preset: Preset) => void;
  disabled: boolean;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ currentPresetId, onSelect, disabled }) => {
  return (
    <div className={`w-full overflow-hidden transition-opacity duration-500 ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="overflow-x-auto pb-6 pt-2 px-6 scrollbar-hide snap-x snap-mandatory">
        <div className="flex space-x-3 md:space-x-4 min-w-max">
          {PRESETS.map((preset) => {
            const isSelected = preset.id === currentPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset)}
                className={`
                  flex flex-col items-start p-3 md:p-4 rounded-2xl border transition-all duration-300 w-40 md:w-48 text-left snap-center
                  ${isSelected 
                    ? 'border-teal-600 bg-teal-50 shadow-md scale-100 ring-1 ring-teal-600/20' 
                    : 'border-stone-200 bg-white hover:border-teal-300 hover:shadow-sm opacity-80 hover:opacity-100 scale-95 hover:scale-100'
                  }
                `}
              >
                <span className={`text-sm font-bold mb-1 block truncate w-full ${isSelected ? 'text-teal-800' : 'text-stone-600'}`}>
                  {preset.name}
                </span>
                <span className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </span>
              </button>
            );
          })}
          {/* Spacer for end of list scrolling */}
          <div className="w-4" />
        </div>
      </div>
    </div>
  );
};

export default PresetSelector;