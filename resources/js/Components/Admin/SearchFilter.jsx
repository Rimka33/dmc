import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function SearchFilter({ 
  onSearch = null,
  placeholder = 'Rechercher...',
  filters = [],
  currentFilters = {},
  endpoint = null,
  showFilters = true
}) {
  const [search, setSearch] = useState(currentFilters.search || '');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState(currentFilters);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(search);
    } else if (endpoint) {
      router.get(endpoint, { search, ...activeFilters }, { preserveState: true });
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    if (endpoint) {
      router.get(endpoint, { search, ...newFilters }, { preserveState: true });
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch('');
    if (endpoint) {
      router.get(endpoint, {}, { preserveState: true });
    }
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all text-sm"
          />
        </form>

        {showFilters && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
              hasActiveFilters
                ? 'border-forest-green bg-green-50 text-forest-green'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filtres {hasActiveFilters && `(${Object.values(activeFilters).filter(v => v).length})`}
          </button>
        )}
      </div>

      {showFilterPanel && filters.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-neon-green outline-none"
                >
                  <option value="">Tous</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'date' ? (
                <input
                  type="date"
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-neon-green outline-none"
                />
              ) : null}
            </div>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}