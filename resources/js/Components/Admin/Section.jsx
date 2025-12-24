import React from 'react';

export default function Section({ 
  title = null,
  subtitle = null,
  icon: Icon = null,
  children,
  actions = null,
  className = ''
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {(title || subtitle || actions) && (
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && <Icon size={20} className="text-forest-green" />}
            <div>
              {title && <h2 className="font-bold text-gray-900">{title}</h2>}
              {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}