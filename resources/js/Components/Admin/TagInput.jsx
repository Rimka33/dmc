import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ 
  value = [], 
  onChange, 
  placeholder = 'Ajouter un tag...',
  suggestions = [],
  allowNew = true
}) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = (tag) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tag) => {
    onChange(value.filter(t => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(input);
    }
  };

  const filtered = suggestions.filter(s => 
    s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[42px] items-center">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-forest-green text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:opacity-75"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="w-full outline-none text-sm"
          />
          
          {showSuggestions && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {filtered.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddTag(suggestion)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
