"use client"
import { Edit, Trash2, Eye, Download, Copy, MoreVertical } from "lucide-react"

const iconMap = {
  edit: Edit,
  delete: Trash2,
  view: Eye,
  download: Download,
  copy: Copy,
  more: MoreVertical,
}

export default function ActionButtons({ actions = [], onAction = null, size = "sm" }) {
  const sizeClass = size === "lg" ? "p-2.5" : size === "md" ? "p-2" : "p-1.5"
  const iconSize = size === "lg" ? 20 : size === "md" ? 18 : 16

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {actions.map((action) => {
        const Icon = iconMap[action.icon] || MoreVertical
        const colorClass =
          action.color === "danger"
            ? "text-red-600 hover:bg-red-50 hover:border-red-200"
            : action.color === "success"
              ? "text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
              : action.color === "warning"
                ? "text-amber-600 hover:bg-amber-50 hover:border-amber-200"
                : "text-gray-600 hover:text-forest-green hover:bg-forest-green/5 hover:border-forest-green/20"

        return (
          <button
            key={action.key}
            onClick={() => onAction?.(action.key)}
            title={action.label}
            className={`inline-flex items-center justify-center ${sizeClass} ${colorClass} rounded-lg transition-all border border-transparent`}
          >
            <Icon size={iconSize} className="flex-shrink-0" />
          </button>
        )
      })}
    </div>
  )
}
