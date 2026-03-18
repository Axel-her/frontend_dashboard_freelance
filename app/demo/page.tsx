"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Mission {
  id: number;
  title: string;
  description?: string;
  tjm: number;
  duree: number;
  client: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  totalRevenue: number;
  numberOfMissions: number;
  numberOfClients: number;
  latestMissions: Mission[];
}

interface MissionFormData {
  title: string;
  description: string;
  tjm: number;
  duree: number;
  client: string;
  startDate: string;
}

// Données statiques pour la démo
const demoMissions: Mission[] = [
  {
    id: 1,
    title: "Développement site e-commerce",
    description: "Création d'une plateforme de vente en ligne avec paiement intégré",
    tjm: 450,
    duree: 20,
    client: "TechCorp",
    startDate: "2025-03-15",
    createdAt: "2025-03-10T10:00:00Z",
    updatedAt: "2025-03-10T10:00:00Z"
  },
  {
    id: 2,
    title: "Refonte application mobile",
    description: "Modernisation de l'interface utilisateur et optimisation des performances",
    tjm: 500,
    duree: 25,
    client: "StartupXYZ",
    startDate: "2025-06-01",
    createdAt: "2025-05-20T14:30:00Z",
    updatedAt: "2025-05-20T14:30:00Z"
  },
  {
    id: 3,
    title: "Audit sécurité",
    description: "Évaluation et recommandations pour la sécurité des systèmes",
    tjm: 600,
    duree: 10,
    client: "FinancePlus",
    startDate: "2025-08-12",
    createdAt: "2025-08-05T09:15:00Z",
    updatedAt: "2025-08-05T09:15:00Z"
  },
  {
    id: 4,
    title: "Intégration API",
    description: "Connexion avec services tiers et synchronisation des données",
    tjm: 400,
    duree: 15,
    client: "DataFlow",
    startDate: "2025-11-20",
    createdAt: "2025-11-15T16:45:00Z",
    updatedAt: "2025-11-15T16:45:00Z"
  },
  {
    id: 5,
    title: "Développement API REST",
    description: "Création d'une API robuste pour l'application web",
    tjm: 480,
    duree: 18,
    client: "WebSolutions",
    startDate: "2026-01-10",
    createdAt: "2025-12-20T11:20:00Z",
    updatedAt: "2025-12-20T11:20:00Z"
  },
  {
    id: 6,
    title: "Migration cloud",
    description: "Déplacement des infrastructures vers le cloud avec optimisation",
    tjm: 550,
    duree: 22,
    client: "CloudTech",
    startDate: "2026-03-05",
    createdAt: "2026-02-25T13:10:00Z",
    updatedAt: "2026-02-25T13:10:00Z"
  },
  {
    id: 7,
    title: "Formation équipe",
    description: "Sessions de formation sur les nouvelles technologies",
    tjm: 350,
    duree: 8,
    client: "InnovateCorp",
    startDate: "2026-05-15",
    createdAt: "2026-05-10T08:30:00Z",
    updatedAt: "2026-05-10T08:30:00Z"
  },
  {
    id: 8,
    title: "Optimisation base de données",
    description: "Amélioration des performances et de la structure des données",
    tjm: 520,
    duree: 12,
    client: "DataMasters",
    startDate: "2026-07-22",
    createdAt: "2026-07-15T15:00:00Z",
    updatedAt: "2026-07-15T15:00:00Z"
  }
];

export default function DemoPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [missionsData, setMissionsData] = useState<{missions: Mission[], total: number, page: number, limit: number, totalPages: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    tjm: 0,
    duree: 0,
    client: '',
    startDate: '',
  });

  const router = useRouter();

  // Calculer les données du dashboard en fonction de l'année sélectionnée
  const calculateDashboardData = (year?: number | null): DashboardData => {
    let filteredMissions = demoMissions;

    if (year) {
      filteredMissions = demoMissions.filter(mission => {
        if (!mission.startDate) return false;
        const missionYear = new Date(mission.startDate).getFullYear();
        return missionYear === year;
      });
    }

    const totalRevenue = filteredMissions.reduce((sum, mission) => sum + (mission.tjm * mission.duree), 0);
    const numberOfMissions = filteredMissions.length;
    const numberOfClients = new Set(filteredMissions.map(m => m.client)).size;

    const latestMissions = filteredMissions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return {
      totalRevenue,
      numberOfMissions,
      numberOfClients,
      latestMissions,
    };
  };

  // Calculer les missions paginées
  const calculateMissionsPaginated = (page: number = 1, year?: number | null) => {
    let filteredMissions = demoMissions;

    if (year) {
      filteredMissions = demoMissions.filter(mission => {
        if (!mission.startDate) return false;
        const missionYear = new Date(mission.startDate).getFullYear();
        return missionYear === year;
      });
    }

    const sortedMissions = filteredMissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = sortedMissions.length;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMissions = sortedMissions.slice(startIndex, endIndex);

    return {
      missions: paginatedMissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  };

  // Calculer les années disponibles
  const calculateAvailableYears = (): number[] => {
    const years = new Set<number>();
    demoMissions.forEach(mission => {
      if (mission.startDate) {
        years.add(new Date(mission.startDate).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  useEffect(() => {
    // Calculer les années disponibles
    const years = calculateAvailableYears();
    setAvailableYears(years);

    // Calculer les données initiales
    const dashboardData = calculateDashboardData(selectedYear);
    setData(dashboardData);

    const missions = calculateMissionsPaginated(currentPage, selectedYear);
    setMissionsData(missions);

    setLoading(false);
  }, [selectedYear, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const openEditForm = (mission: Mission) => {
    setEditingMission(mission);
    setFormData({
      title: mission.title,
      description: mission.description || '',
      tjm: mission.tjm,
      duree: mission.duree,
      client: mission.client,
      startDate: mission.startDate ? new Date(mission.startDate).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tjm: 0,
      duree: 0,
      client: '',
      startDate: '',
    });
    setEditingMission(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Aucune donnée disponible.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Titre */}
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard John Doe
        </h1>

        

        <h2 className="text-lg font-medium text-gray-600">
          Mode démo — données simulées
        </h2>

        <button
          onClick={handleBackToLogin}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
        >
          Retour
        </button>

        

      </div>


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
              onClick={openAddForm}
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

      {/* Dernières missions */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Toutes les missions :
          </h2>

          {/* Filtre par année */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Filtrer par année:</label>
            <select
              value={selectedYear || ''}
              onChange={(e) => handleYearChange(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="">Toutes les années</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {missionsData && missionsData.missions.length === 0 ? (
            <p className="text-gray-500">Aucune mission trouvée.</p>
          ) : (
            missionsData?.missions.map((mission) => (
              <div
                key={mission.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => openEditForm(mission)}
              >
                <div>
                  <p className="font-medium text-lg">{mission.title}</p>
                  <p className="text-gray-500 text-sm">Client : {mission.client}</p>
                  {mission.startDate && (
                    <p className="text-gray-500 text-sm">Début : {new Date(mission.startDate).toLocaleDateString('fr-FR')}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{mission.description}</p>
                </div>
                <p className="font-semibold mt-2">{(mission.tjm * mission.duree).toLocaleString()} €</p>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {missionsData && missionsData.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Précédent
            </button>
            <span className="text-sm">
              Page {currentPage} sur {missionsData.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === missionsData.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Modal pour afficher la mission */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingMission ? 'Détails de la mission' : 'Ajouter une mission'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">TJM (€)</label>
                  <input
                    type="number"
                    value={formData.tjm}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée (jours)</label>
                  <input
                    type="number"
                    value={formData.duree}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <input
                  type="text"
                  value={formData.client}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date de début</label>
                <input
                  type="date"
                  value={formData.startDate}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              {!editingMission && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="font-medium">💡 Mode démo</p>
                  <p>Les champs sont désactivés car il s'agit de données simulées.</p>
                </div>
              )}
              
              {editingMission && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium">Revenu estimé : {(formData.tjm * formData.duree).toLocaleString()} €</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fermer
              </button>
              {editingMission ? (
                <>
                  <button
                    disabled
                    className="px-4 py-2 bg-blue-500 text-white rounded opacity-50 cursor-not-allowed"
                  >
                    Modifier
                  </button>
                  <button
                    disabled
                    className="px-4 py-2 bg-red-500 text-white rounded opacity-50 cursor-not-allowed"
                  >
                    Supprimer
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-green-500 text-white rounded opacity-50 cursor-not-allowed"
                >
                  Ajouter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}