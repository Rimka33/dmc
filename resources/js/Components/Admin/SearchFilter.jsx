"use client"
import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { router } from "@inertiajs/react"

export default function SearchFilter({
  onSearch = null,
  placeholder = "Rechercher...",
  filters = [],
  currentFilters = {},
  endpoint = null,
  showFilters = true,
}) {
  const [search, setSearch] = useState(currentFilters.search || "")
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [activeFilters, setActiveFilters] = useState(currentFilters)

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(search)
    } else if (endpoint) {
      router.get(endpoint, { search, ...activeFilters }, { preserveState: true })
    }
  }

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value }
    setActiveFilters(newFilters)
    if (endpoint) {
      router.get(endpoint, { search, ...newFilters }, { preserveState: true })
    }
  }

  const clearFilters = () => {
    setActiveFilters({})
    setSearch("")
    if (endpoint) {
      router.get(endpoint, {}, { preserveState: true })
    }
  }

  const hasActiveFilters = Object.values(activeFilters).some((v) => v)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-forest-green outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400 font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {showFilters && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-all font-semibold text-sm whitespace-nowrap ${
              hasActiveFilters
                ? "border-forest-green/30 bg-forest-green/10 text-forest-green"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} className="flex-shrink-0" />
            <span>Filtres</span>
            {hasActiveFilters && (
              <span className="bg-forest-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {Object.values(activeFilters).filter((v) => v).length}
              </span>
            )}
          </button>
        )}
      </div>

      {showFilterPanel && filters.length > 0 && (
        <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">{filter.label}</label>
                {filter.type === "select" ? (
                  <select
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest-green outline-none text-gray-900 font-medium"
                  >
                    <option value="">Tous</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === "date" ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-forest-green outline-none text-gray-900 font-medium"
                  />
                ) : null}
              </div>
            ))}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all border border-red-200"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  )
}
