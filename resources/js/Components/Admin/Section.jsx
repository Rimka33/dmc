export default function Section({
  title = null,
  subtitle = null,
  icon: Icon = null,
  children,
  actions = null,
  className = '',
}) {
  return (
    <div
      className={`p-6 rounded-2xl backdrop-blur-xl border border-forest-green/15 shadow-sm bg-white/80 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-forest-green/10 border border-forest-green/20 flex items-center justify-center">
                <Icon size={20} className="text-forest-green" strokeWidth={2} />
              </div>
            )}
            <div>
              {title && (
                <h3
                  className="text-xl font-bold text-dark-green"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-sm text-dark-green/60 mt-1">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
