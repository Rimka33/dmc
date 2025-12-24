import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend = null, 
  trendValue = null,
  trendLabel = null,
  color = 'blue',
  description = null,
  loading = false 
}) {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-forest-green',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  const bgColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg text-white`}>
          {Icon && <Icon size={24} />}
        </div>
        {trend !== null && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
            trend > 0 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
            {trendValue || Math.abs(trend) + '%'}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {loading ? '...' : value}
      </p>
      {description && <p className="text-xs text-gray-400 mt-2">{description}</p>}
      {trendLabel && <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>}
    </div>
  );
}