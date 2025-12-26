export default function LoadingSpinner({ size = "md", color = "forest-green" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const colorClasses = {
    "forest-green": "border-forest-green",
    "neon-green": "border-neon-green",
    white: "border-white",
    gray: "border-gray-400",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  )
}
