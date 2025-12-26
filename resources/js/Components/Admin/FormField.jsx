"use client"
import { AlertCircle } from "lucide-react"

export default function FormField({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  onBlur,
  placeholder = "",
  error = null,
  required = false,
  hint = null,
  disabled = false,
  options = [],
  rows = 4,
  className = "",
}) {
  const baseClass =
    "w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-forest-green focus:border-forest-green focus:bg-white outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400 font-medium"
  const inputClass = `${baseClass} ${error ? "border-red-500 bg-red-50" : "border-gray-200"} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-black text-gray-700 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
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
      ) : type === "select" ? (
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
      ) : type === "checkbox" ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            disabled={disabled}
            className="w-4 h-4 border-gray-300 rounded accent-forest-green cursor-pointer bg-gray-50"
          />
          <span className="text-sm text-gray-700 font-medium">{label}</span>
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
  )
}
