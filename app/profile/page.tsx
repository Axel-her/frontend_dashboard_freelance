"use client";

import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "@/services/authService";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
      setFormData({
        email: userData.email,
        nom: userData.nom,
        prenom: userData.prenom,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    setShowConfirmSave(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmSave(false);
    setIsSaving(true);

    try {
      const updatedUser = await updateUserProfile(formData.email, formData.nom, formData.prenom);
      setUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    setIsDeleting(true);

    try {
      await deleteUserAccount();
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };
   const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDashboardClick = () => {
    setShowUserMenu(false);
    router.push("/dashboard");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error || "Utilisateur non trouvé"}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
    {/* Titre */}
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard{user ? ` - ${user.prenom} ${user.nom}` : ''}
        </h1>

        <div className="relative user-menu-container">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Menu utilisateur"
            className="
              w-11 h-11 rounded-full
              flex flex-col items-center justify-center
              border-2 border-black
              transition
              hover:ring-2 hover:ring-black hover:ring-offset-2 hover:ring-offset-gray-50
              hover:scale-105 active:scale-95
              gap-1
            "
          >
            <span className="block w-5 h-0.5 bg-black"></span>
            <span className="block w-5 h-0.5 bg-black"></span>
            <span className="block w-5 h-0.5 bg-black"></span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
              <div className="py-1">
                <button
                  onClick={handleDashboardClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Carte profil */}
      <div className="w-full flex justify-center mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl w-full">
          {!isEditing ? (
            /* Vue lecture */
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-lg">{user.nom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Prénom</label>
                <p className="text-lg">{user.prenom}</p>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
                >
                  Modifier
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
          ) : (
            /* Vue édition */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg font-medium transition disabled:cursor-not-allowed"
                >
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-black py-2 px-4 rounded-lg font-medium transition disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmation sauvegarde */}
      {showConfirmSave && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p className="text-gray-700 mb-6">Êtes vous sûre d'enregistrer ces modifications?</p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
              >
                Oui, enregistrer
              </button>
              <button
                onClick={() => setShowConfirmSave(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {showConfirmDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirmation de suppression</h2>
            <p className="text-gray-700 mb-6">Êtes vous sûre de vouloir supprimer votre compte? Cette action est irréversible.</p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 rounded-lg font-medium disabled:cursor-not-allowed"
              >
                {isDeleting ? "Suppression..." : "Oui, supprimer"}
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-black py-2 rounded-lg font-medium disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}