import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Mission {
  id: number;
  title: string;
  description?: string;
  tjm: number;
  duree: number;
  client: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalRevenue: number;
  numberOfMissions: number;
  numberOfClients: number;
  latestMissions: Mission[];
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get(`${API_URL}/missions/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur lors de la récupération des données du dashboard");
  }
}