import React from 'react';
import { Globe, info } from 'lucide-react';

const SIZES = {
  US: { name: "United States", desc: "2x2 inches (51x51mm)", key: "US" },
  UK: { name: "UK / India / EU", desc: "35x45 mm", key: "UK" },
  CN: { name: "China", desc: "33x48 mm", key: "CN" }
};

export default function SizeSelector({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <Globe size={16} /> Select Country Standard
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {Object.values(SIZES).map((size) => (
          <button
            key={size.key}
            onClick={() => onSelect(size.key)}
            className={`p-3 text-left rounded-xl border-2 transition-all ${
              selected === size.key 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="font-bold text-sm">{size.name}</div>
            <div className="text-xs text-slate-500">{size.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}