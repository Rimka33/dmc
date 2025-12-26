import React from "react"
import { Link } from "@inertiajs/react"
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline"

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link href="/admin" className="text-gray-500 hover:text-forest-green transition-colors">
        <HomeIcon className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="text-gray-500 hover:text-forest-green transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
