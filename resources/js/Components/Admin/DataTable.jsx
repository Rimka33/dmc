import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function DataTable({ 
  columns, 
  data = [], 
  pagination = null,
  onRowClick = null,
  rowClassName = '',
  emptyMessage = 'Aucun résultat',
  loading = false
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                  Chargement...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <tr 
                  key={row.id || idx} 
                  className={`hover:bg-gray-50 transition-colors group text-sm cursor-pointer ${rowClassName}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 italic">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Affichage de {pagination.from} à {pagination.to} sur {pagination.total}
          </span>
          <div className="flex gap-2">
            {pagination.links?.map((link, key) =>
              link.url ? (
                <Link
                  key={key}
                  href={link.url}
                  className={`px-3 py-1 rounded-md text-xs transition-all ${
                    link.active
                      ? 'bg-forest-green text-white font-bold'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label.includes('Previous') ? '← Précédent' : link.label.includes('Next') ? 'Suivant →' : link.label}
                </Link>
              ) : (
                <span key={key} className="px-3 py-1 rounded-md text-xs text-gray-300">
                  {link.label.includes('Previous') ? '← Précédent' : link.label.includes('Next') ? 'Suivant →' : link.label}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}