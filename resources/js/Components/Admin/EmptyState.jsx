"use client"

export default function EmptyState({
  icon,
  title = "Aucune donnée",
  description = "Aucun élément à afficher pour le moment.",
  action,
  actionLabel,
}) {
  return (
    <div className="empty-state py-16">
      {icon && <div className="empty-state-icon mb-4">{icon}</div>}
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {action && actionLabel && (
        <button onClick={action} className="btn-admin btn-admin-primary">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
