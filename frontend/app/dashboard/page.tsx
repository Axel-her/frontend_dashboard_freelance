"use client";

import { useState, useEffect } from "react";
import { getDashboardData, createMission, DashboardData } from "@/services/missionService";

interface MissionFormData {
  title: string;
  description: string;
  tjm: number;
  duree: number;
  client: string;
  startDate: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    tjm: 0,
    duree: 0,
    client: '',
    startDate: '',
  });

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMission({
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        tjm: 0,
        duree: 0,
        client: '',
        startDate: '',
      });
      await fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tjm' || name === 'duree' ? Number(value) : value,
    }));
  };

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

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-gray-500 text-sm font-medium">Missions</h2>

            <button
              className="w-8 h-8 rounded-full bg-white-600 text-black flex items-center justify-center text-xl font-bold
             border-2 border-black transition hover:ring-2 hover:ring-black hover:ring-offset-2 hover:ring-offset-white hover:scale-105 active:scale-95"
              title="Ajouter une mission"
              onClick={() => setShowForm(true)}
            >
              +
            </button>

          </div>

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

      {/* Formulaire ajout mission */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Ajouter une mission</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Titre"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                name="tjm"
                placeholder="TJM (€)"
                value={formData.tjm}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                name="duree"
                placeholder="Durée (jours)"
                value={formData.duree}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="client"
                placeholder="Client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dernières missions */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Missions </h2>

        <div className="space-y-4">
          {data.latestMissions.length === 0 ? (
            <p className="text-gray-500">Aucune mission trouvée.</p>
          ) : (
            data.latestMissions.map((mission) => (
              <div key={mission.id} className="p-4 border rounded-lg flex justify-between">
                <div>
                  <p className="font-medium text-lg">{mission.title}</p>
                  <p className="text-gray-500 text-sm">Client : {mission.client}</p>
                  {mission.startDate && (
                    <p className="text-gray-500 text-sm">Début : {new Date(mission.startDate).toLocaleDateString('fr-FR')}</p>
                  )}
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
