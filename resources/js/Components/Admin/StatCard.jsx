import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend = null,
  trendValue = null,
  trendLabel = null,
  color = "blue",
  description = null,
  loading = false,
}) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-forest-green to-[#046b29]",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
  }

  const bgGradient = colorMap[color] || colorMap.blue

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${bgGradient} p-3 rounded-xl text-white shadow-lg`}>
          {Icon && <Icon size={22} />}
        </div>
        {trend !== null && (
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
              trend > 0
                ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                : "text-red-600 bg-red-50 border border-red-200"
            }`}
          >
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
            {trendValue || Math.abs(trend) + "%"}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-gray-900 mt-1">{loading ? "..." : value}</p>
      {description && <p className="text-xs text-gray-500 mt-2 font-medium">{description}</p>}
      {trendLabel && <p className="text-xs text-gray-500 mt-2 font-medium">{trendLabel}</p>}
    </div>
  )
}
