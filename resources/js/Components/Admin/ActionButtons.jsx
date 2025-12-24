import React from 'react';
import { Edit, Trash2, Eye, Download, Copy, MoreVertical } from 'lucide-react';

const iconMap = {
  'edit': Edit,
  'delete': Trash2,
  'view': Eye,
  'download': Download,
  'copy': Copy,
  'more': MoreVertical,
};

export default function ActionButtons({ 
  actions = [],
  onAction = null,
  size = 'sm'
}) {
  const sizeClass = size === 'lg' ? 'p-3' : size === 'md' ? 'p-2.5' : 'p-2';
  const iconSize = size === 'lg' ? 20 : size === 'md' ? 18 : 16;

  return (
    <div className="flex items-center gap-1">
      {actions.map((action) => {
        const Icon = iconMap[action.icon] || MoreVertical;
        const colorClass = action.color === 'danger' ? 'text-red-600 hover:bg-red-50' :
                          action.color === 'success' ? 'text-green-600 hover:bg-green-50' :
                          action.color === 'warning' ? 'text-amber-600 hover:bg-amber-50' :
                          'text-gray-400 hover:text-forest-green hover:bg-green-50';

        return (
          <button
            key={action.key}
            onClick={() => onAction?.(action.key)}
            title={action.label}
            className={`inline-flex ${sizeClass} ${colorClass} rounded-lg transition-colors`}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}
    </div>
  );
}