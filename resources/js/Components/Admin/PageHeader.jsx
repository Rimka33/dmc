"use client"

import React from "react"
import { ChevronRight } from "lucide-react"

export default function PageHeader({
  title,
  subtitle = null,
  breadcrumbs = [],
  action = null,
  actionText = null,
  onAction = null,
}) {
  return (
    <div className="mb-6">
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-semibold overflow-x-auto pb-1">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={14} className="flex-shrink-0" />}
              <span className={`whitespace-nowrap ${idx === breadcrumbs.length - 1 ? "text-gray-900 font-bold" : ""}`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1.5 text-sm sm:text-base font-medium line-clamp-2">{subtitle}</p>}
        </div>

        {action || actionText ? (
          <div className="flex-shrink-0 w-full sm:w-auto">
            {action}
            {!action && actionText && (
              <button
                onClick={onAction}
                className="w-full sm:w-auto px-5 py-2.5 bg-forest-green text-white rounded-lg hover:bg-dark-green transition-all font-bold shadow-md shadow-forest-green/20 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                {actionText}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
