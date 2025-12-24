import React from 'react';

export default function ChartCard({ 
  title, 
  subtitle = null,
  children,
  loading = false,
  height = 'h-80'
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`${height} flex items-center justify-center`}>
        {loading ? (
          <p className="text-gray-400 text-sm">Chargement des données...</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}