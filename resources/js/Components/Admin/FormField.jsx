'use client';
import { AlertCircle } from 'lucide-react';

export default function FormField({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  error = null,
  required = false,
  hint = null,
  disabled = false,
  options = [],
  rows = 4,
  className = '',
}) {
  const baseClass =
    'w-full px-5 py-3 bg-white/50 border rounded-2xl focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green focus:bg-white outline-none transition-all text-sm text-dark-green placeholder:text-dark-green/30 font-bold';
  const inputClass = `${baseClass} ${error ? 'border-red-500 bg-red-50/50' : 'border-forest-green/10'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="space-y-3">
      {label && type !== 'checkbox' && (
        <label className="block text-[10px] font-black text-dark-green/40 uppercase tracking-[0.2em] ml-1">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={inputClass}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={inputClass}
        >
          <option value="">-- Sélectionnez --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              disabled={disabled}
              className="w-5 h-5 border-forest-green/20 rounded-lg accent-forest-green cursor-pointer bg-white transition-all focus:ring-2 focus:ring-forest-green/20"
            />
          </div>
          <span className="text-xs text-dark-green font-bold uppercase tracking-wider group-hover:text-forest-green transition-colors">
            {label}
          </span>
        </label>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
        />
      )}

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600 font-bold">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {hint && !error && <p className="text-xs text-gray-500 font-medium">{hint}</p>}
    </div>
  );
}
