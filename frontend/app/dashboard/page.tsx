"use client";

import { useState, useEffect } from "react";
import { getDashboardData, DashboardData } from "@/services/missionService";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Aucune donnée disponible.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Revenu total */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Revenu total</h2>
          <p className="text-3xl font-bold">{data.totalRevenue.toLocaleString()} €</p>
        </div>

        {/* Nombre de missions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Missions</h2>
          <p className="text-3xl font-bold">{data.numberOfMissions}</p>
        </div>

        {/* Clients */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Clients</h2>
          <p className="text-3xl font-bold">{data.numberOfClients}</p>
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
          {data.latestMissions.length === 0 ? (
            <p className="text-gray-500">Aucune mission trouvée.</p>
          ) : (
            data.latestMissions.map((mission) => (
              <div key={mission.id} className="p-4 border rounded-lg flex justify-between">
                <div>
                  <p className="font-medium text-lg">{mission.title}</p>
                  <p className="text-gray-500 text-sm">Client : {mission.client}</p>
                </div>
                <p className="font-semibold">{(mission.tjm * mission.duree).toLocaleString()} €</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}    
