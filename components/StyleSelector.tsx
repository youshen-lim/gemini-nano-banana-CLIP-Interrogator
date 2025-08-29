
import React from 'react';

interface StyleSelectorProps {
  styles: string[];
  selectedStyle: string;
  onChange: (style: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {styles.map((style) => (
        <label
          key={style}
          className={`relative flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
            selectedStyle === style
              ? 'bg-[#1974e8] border-[#1974e8] text-white shadow-md shadow-[#1974e8]/30'
              : 'bg-white border-slate-300 hover:border-[#1974e8] text-slate-600'
          }`}
        >
          <input
            type="radio"
            name="style-selector"
            value={style}
            checked={selectedStyle === style}
            onChange={() => onChange(style)}
            className="absolute opacity-0 w-full h-full cursor-pointer"
            aria-label={style}
          />
          <span className="font-medium text-sm">{style}</span>
        </label>
      ))}
    </div>
  );
};

export default StyleSelector;
