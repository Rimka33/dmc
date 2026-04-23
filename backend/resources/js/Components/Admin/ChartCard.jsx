export default function ChartCard({
  title,
  subtitle = null,
  children,
  loading = false,
  height = 'h-80',
  className = '',
}) {
  return (
    <div
      className={`p-6 rounded-2xl backdrop-blur-xl border border-forest-green/15 shadow-sm bg-white/80 ${className}`}
    >
      <div className="mb-6">
        <h3
          className="text-xl font-bold text-dark-green"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {title}
        </h3>
        {subtitle && <p className="text-sm text-dark-green/60 mt-1">{subtitle}</p>}
      </div>
      <div className={`${height} flex items-center justify-center overflow-hidden`}>
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-dark-green/60">Analyse des données...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
