import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search employee name, code, email...' }) => {
  const [term, setTerm] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(term);
    }, 400);
    return () => clearTimeout(timer);
  }, [term, onChange]);

  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
      />
      {term && (
        <button
          onClick={() => {
            setTerm('');
            onChange('');
          }}
          className="absolute right-3 text-slate-400 hover:text-slate-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
