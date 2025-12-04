"use client";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Revenu total */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Revenu total</h2>
          <p className="text-3xl font-bold">12 500 €</p>
        </div>

        {/* Nombre de missions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Missions</h2>
          <p className="text-3xl font-bold">8</p>
        </div>

        {/* Clients */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Clients</h2>
          <p className="text-3xl font-bold">5</p>
        </div>

      </div>
    

      {/* Section graphique / résumé */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
        <h2 className="text-xl font-semibold mb-4">Revenus du mois</h2>
        
        {/* Placeholder pour futur graphique */}
        <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Graphique (à venir)
        </div>
      </div>

      {/* Dernières missions */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Dernières missions</h2>

        <div className="space-y-4">

          <div className="p-4 border rounded-lg flex justify-between">
            <div>
              <p className="font-medium text-lg">Refonte site vitrine</p>
              <p className="text-gray-500 text-sm">Client : ACME Corp</p>
            </div>
            <p className="font-semibold">2 800 €</p>
          </div>

          <div className="p-4 border rounded-lg flex justify-between">
            <div>
              <p className="font-medium text-lg">Dashboard interne</p>
              <p className="text-gray-500 text-sm">Client : Nexa</p>
            </div>
            <p className="font-semibold">1 900 €</p>
          </div>

          <div className="p-4 border rounded-lg flex justify-between">
            <div>
              <p className="font-medium text-lg">Automatisation CRM</p>
              <p className="text-gray-500 text-sm">Client : Brixio</p>
            </div>
            <p className="font-semibold">1 300 €</p>
        </div>

        </div>
      </div>

    </div>
  );
}    
