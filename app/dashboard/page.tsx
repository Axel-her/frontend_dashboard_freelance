"use client";

import { useState, useEffect } from "react";
import { getDashboardData, createMission, getMissionsPaginated, updateMission, deleteMission, getAvailableYears, DashboardData, PaginatedMissions, Mission } from "@/services/missionService";
import { getUserProfile } from "@/services/authService";
import { useRouter } from "next/navigation";

interface MissionFormData {
  title: string;
  description: string;
  tjm: number;
  duree: number;
  client: string;
  startDate: string;
}

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [missionsData, setMissionsData] = useState<PaginatedMissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    tjm: 0,
    duree: 0,
    client: '',
    startDate: '',
  });

  const router = useRouter();

  const fetchData = async () => {
    try {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Unauthorized");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async (page: number = 1, year?: number | null) => {
    try {
      const missions = await getMissionsPaginated(page, 10, year || undefined);
      setMissionsData(missions);
      setCurrentPage(page);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Unauthorized");
      } else {
        setError(err.message);
      }
    }
  };

  const fetchAvailableYears = async () => {
    try {
      const years = await getAvailableYears();
      setAvailableYears(years);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Unauthorized");
      } else {
        console.error("Erreur lors de la récupération des années:", err);
      }
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Unauthorized");
      } else {
        console.error("Erreur lors de la récupération du profil:", err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
    fetchMissions();
    fetchAvailableYears();
    fetchUser();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    try {
      if (editingMission) {
        // Mode édition
        await updateMission(editingMission.id, {
          ...formData,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        });
      } else {
        // Mode ajout
        await createMission({
          ...formData,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        });
      }
      setShowForm(false);
      resetForm();
      await fetchData(); // Refresh dashboard data
      await fetchMissions(currentPage, selectedYear); // Refresh missions
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMission = async () => {
    if (!editingMission || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await deleteMission(editingMission.id);
      setShowForm(false);
      resetForm();
      await fetchData(); // Refresh dashboard data
      
      // Vérifier si on doit revenir à la page précédente
      const newTotal = (missionsData?.total || 1) - 1;
      const newTotalPages = Math.ceil(newTotal / 10);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else {
        await fetchMissions(currentPage, selectedYear); // Refresh missions
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
    setIsSubmitting(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tjm' || name === 'duree' ? Number(value) : value,
    }));
  };

  const handlePageChange = (page: number) => {
    fetchMissions(page, selectedYear);
  };

  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset to first page when changing filter
    fetchMissions(1, year);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard{user ? ` - ${user.prenom} ${user.nom}` : ''}
        </h1>

        <button
          onClick={handleLogout}
          title="Se déconnecter"
          className="
            w-11 h-11 rounded-full
            flex items-center justify-center
            border-2 border-black
            transition
            hover:ring-2 hover:ring-black hover:ring-offset-2 hover:ring-offset-gray-50
            hover:scale-105 active:scale-95
          "
        >
          ⏻
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

      {/* Formulaire ajout mission */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingMission ? 'Modifier la mission' : 'Ajouter une mission'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TJM (€)</label>
                <input
                  type="number"
                  name="tjm"
                  value={formData.tjm}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durée (jours)</label>
                <input
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de début</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'En cours...' : (editingMission ? 'Modifier' : 'Ajouter')}
                </button>
                {editingMission && (
                  <button
                    type="button"
                    onClick={handleDeleteMission}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 rounded-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Suppression...' : 'Supprimer'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-black py-2 rounded-lg disabled:cursor-not-allowed"
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Toutes les missions  :
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
                className="p-4 border rounded-lg flex justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => openEditForm(mission)}
              >
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

    </div>
  );
}    
