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
    <div className="p-1 rounded-2xl border border-forest-green/15 bg-white/80 backdrop-blur-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-dark-green/40 text-[10px] uppercase font-black tracking-[0.2em]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-5 whitespace-nowrap border-b border-forest-green/10 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-green/5">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-dark-green/60">Analyse de la base...</span>
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
                      className={`px-6 py-5 text-dark-green font-medium ${col.align === "right" ? "text-right font-black" : col.align === "center" ? "text-center" : ""} ${col.truncate !== false ? "max-w-xs truncate" : ""}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-dark-green/40 font-bold italic text-sm">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-6 border-t border-forest-green/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-dark-green/40 order-2 sm:order-1">
            Résultats <span className="text-dark-green">{pagination.from}-{pagination.to}</span> sur <span className="text-forest-green">{pagination.total}</span>
          </span>
          <div className="flex flex-wrap gap-2 order-1 sm:order-2 justify-center">
            {pagination.links?.map((link, key) =>
              link.url ? (
                <Link
                  key={key}
                  href={link.url}
                  className={`px-4 py-2 rounded-xl text-xs transition-all font-bold min-w-[2.5rem] text-center ${link.active
                      ? "bg-forest-green text-white shadow-lg shadow-forest-green/20"
                      : "bg-forest-green/5 text-dark-green hover:bg-forest-green/10 border border-forest-green/10"
                    }`}
                >
                  {link.label.includes("Previous") ? "←" : link.label.includes("Next") ? "→" : link.label}
                </Link>
              ) : (
                <span key={key} className="px-4 py-2 rounded-xl text-xs text-dark-green/20 font-bold min-w-[2.5rem] text-center border border-transparent">
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
