const statusStyles = {
  // Order statuses
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  paid: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  preparing: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  shipped: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  delivered: "bg-forest-green/10 text-forest-green border-forest-green/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-700 border-gray-500/20",

  // Product statuses
  active: "bg-forest-green/10 text-forest-green border-forest-green/20",
  inactive: "bg-red-500/10 text-red-700 border-red-500/20",
  draft: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  published: "bg-forest-green/10 text-forest-green border-forest-green/20",

  // Payment statuses
  successful: "bg-forest-green/10 text-forest-green border-forest-green/20",
  failed: "bg-red-500/10 text-red-700 border-red-500/20",
  pending_payment: "bg-amber-500/10 text-amber-700 border-amber-500/20",
}

const labelMap = {
  pending: "En attente",
  paid: "Payée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
  active: "Actif",
  inactive: "Inactif",
  draft: "Brouillon",
  published: "Publié",
  successful: "Succès",
  failed: "Échoué",
  pending_payment: "En attente de paiement",
}

export default function StatusBadge({ status, size = "sm", className = "" }) {
  const style = statusStyles[status] || "bg-gray-500/10 text-gray-700 border-gray-500/20"
  const label = labelMap[status] || status

  const sizeClass =
    size === "lg" ? "px-4 py-2 text-xs" : size === "md" ? "px-3 py-1.5 text-[10px]" : "px-2.5 py-1 text-[9px]"

  return (
    <span
      className={`inline-flex items-center font-black uppercase tracking-widest rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all ${style} ${sizeClass} ${className}`}
    >
      {label}
    </span>
  )
}
