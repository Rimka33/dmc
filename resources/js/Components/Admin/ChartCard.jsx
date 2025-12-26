export default function ChartCard({
  title,
  subtitle = null,
  children,
  loading = false,
  height = "h-80",
  className = "",
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>}
      </div>
      <div className={`${height} p-5 flex items-center justify-center overflow-hidden`}>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Chargement des données...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
