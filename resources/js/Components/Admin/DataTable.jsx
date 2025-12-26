"use client"
import { Link } from "@inertiajs/react"

export default function DataTable({
  columns,
  data = [],
  pagination = null,
  onRowClick = null,
  rowClassName = "",
  emptyMessage = "Aucun résultat",
  loading = false,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <table className="w-full text-left min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs uppercase font-bold tracking-wide border-b-2 border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 whitespace-nowrap ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
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
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`hover:bg-forest-green/5 transition-all group text-sm ${onRowClick ? "cursor-pointer" : ""} ${rowClassName}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-gray-700 font-medium ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""} ${col.truncate !== false ? "max-w-xs truncate" : ""}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 italic">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-600 font-medium order-2 sm:order-1">
            Affichage de <span className="font-bold text-gray-900">{pagination.from}</span> à{" "}
            <span className="font-bold text-gray-900">{pagination.to}</span> sur{" "}
            <span className="font-bold text-forest-green">{pagination.total}</span> résultats
          </span>
          <div className="flex flex-wrap gap-1.5 order-1 sm:order-2 justify-center">
            {pagination.links?.map((link, key) =>
              link.url ? (
                <Link
                  key={key}
                  href={link.url}
                  className={`px-3 py-2 rounded-lg text-xs transition-all font-semibold min-w-[2.5rem] text-center ${
                    link.active
                      ? "bg-forest-green text-white shadow-md shadow-forest-green/20"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {link.label.includes("Previous") ? "←" : link.label.includes("Next") ? "→" : link.label}
                </Link>
              ) : (
                <span key={key} className="px-3 py-2 rounded-lg text-xs text-gray-400 min-w-[2.5rem] text-center">
                  {link.label.includes("Previous") ? "←" : link.label.includes("Next") ? "→" : link.label}
                </span>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
