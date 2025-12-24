import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ 
  title, 
  subtitle = null,
  breadcrumbs = [],
  action = null,
  actionText = null,
  onAction = null
}) {
  return (
    <div className="mb-8">
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={14} />}
              <span className={idx === breadcrumbs.length - 1 ? 'text-gray-900 font-bold' : ''}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
        </div>
        
        {action || actionText ? (
          <div className="flex-shrink-0">
            {action}
            {!action && actionText && (
              <button
                onClick={onAction}
                className="px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-colors font-bold shadow-lg shadow-forest-green/20 flex items-center gap-2"
              >
                {actionText}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}