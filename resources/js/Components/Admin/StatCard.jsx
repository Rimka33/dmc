import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend = null,
  trendValue = null,
  trendLabel = null,
  color = 'green',
  description = null,
  loading = false,
}) {
  const isPositive = trend === null || trend >= 0;

  return (
    <div className="relative group h-full">
      {/* Card with glassmorphism */}
      <div className="h-full p-6 rounded-2xl backdrop-blur-xl border border-forest-green/15 transition-all duration-300 hover:border-forest-green/50 shadow-sm hover:shadow-md bg-white/80">
        {/* Icon & Trend */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-forest-green/10 border border-forest-green/20 flex items-center justify-center relative">
            {Icon && <Icon className="w-6 h-6 text-forest-green" strokeWidth={2} />}
          </div>

          {(trend !== null || trendValue) && (
            <div
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                isPositive
                  ? 'bg-neon-green/10 border border-neon-green/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              {trend !== null &&
                (trend > 0 ? (
                  <ArrowUpRight size={12} className="text-forest-green" />
                ) : (
                  <ArrowDownLeft size={12} className="text-red-600" />
                ))}
              <span
                className={`text-xs font-semibold ${
                  isPositive ? 'text-forest-green' : 'text-red-600'
                }`}
              >
                {trendValue || (trend !== null ? `${Math.abs(trend)}%` : '')}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div>
          <p className="text-sm text-dark-green/60 mb-1">{title}</p>
          <h3
            className="text-3xl font-bold text-dark-green"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {loading ? '...' : value}
          </h3>
          {description && (
            <p className="text-[10px] text-dark-green/40 mt-2 font-bold uppercase tracking-wider">
              {description}
            </p>
          )}
          {trendLabel && (
            <p className="text-[10px] text-dark-green/40 mt-1 font-bold uppercase tracking-wider">
              {trendLabel}
            </p>
          )}
        </div>
      </div>

      {/* Glow effect on hover */}
      {isPositive && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-forest-green to-neon-green rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity -z-10"></div>
      )}
    </div>
  );
}
