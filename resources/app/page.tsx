export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-forest-green to-dark-green rounded-2xl flex items-center justify-center font-black text-white text-3xl mx-auto shadow-lg">
            D
          </div>

          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">DMC Computer Admin</h1>
            <p className="text-gray-600 font-medium">Interface d'administration modernisée</p>
          </div>

          <div className="bg-forest-green/5 border border-forest-green/20 rounded-xl p-6 text-left space-y-3">
            <h2 className="font-bold text-forest-green text-lg">✅ Composants modernisés</h2>
            <ul className="text-sm text-gray-700 space-y-2 font-medium">
              <li>
                • <strong>Layout Admin</strong> - Sidebar responsive avec navigation moderne
              </li>
              <li>
                • <strong>DataTable</strong> - Tableaux avec scroll horizontal et pagination
              </li>
              <li>
                • <strong>FormField</strong> - Champs de formulaire avec validation
              </li>
              <li>
                • <strong>StatCard</strong> - Cartes de statistiques avec gradients
              </li>
              <li>
                • <strong>ChartCard</strong> - Graphiques et visualisations
              </li>
              <li>
                • <strong>SearchFilter</strong> - Recherche et filtres avancés
              </li>
              <li>
                • <strong>StatusBadge</strong> - Badges de statut colorés
              </li>
              <li>
                • <strong>ActionButtons</strong> - Boutons d'action avec icônes
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-2">
            <h3 className="font-bold text-gray-900">🎨 Design System</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 font-medium">
              <div>
                <span className="font-bold text-forest-green">Couleur principale :</span>
                <br />
                Vert forêt (#058031)
              </div>
              <div>
                <span className="font-bold text-neon-green">Couleur accent :</span>
                <br />
                Vert néon (#00ff24)
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-medium">
              Projet Laravel + Inertia.js - Tous les fichiers admin dans{" "}
              <code className="bg-gray-100 px-2 py-1 rounded font-mono">js/Pages/Admin/</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
