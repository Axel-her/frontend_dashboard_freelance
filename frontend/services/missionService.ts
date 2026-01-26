import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Mission {
  id: number;
  title: string;
  description?: string;
  tjm: number;
  duree: number;
  client: string;
  startDate?: string;
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

export async function createMission(missionData: Omit<Mission, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Mission> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.post(`${API_URL}/missions`, missionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur lors de la création de la mission");
  }
}

export interface PaginatedMissions {
  missions: Mission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getMissionsPaginated(page: number = 1, limit: number = 10, year?: number): Promise<PaginatedMissions> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (year) {
      params.append('year', year.toString());
    }
    const response = await axios.get(`${API_URL}/missions/paginated?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur lors de la récupération des missions paginées");
  }
}

export async function updateMission(id: number, missionData: Partial<Omit<Mission, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Mission> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.patch(`${API_URL}/missions/${id}`, missionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur lors de la modification de la mission");
  }
}

export async function deleteMission(id: number): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    await axios.delete(`${API_URL}/missions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la mission");
  }
}

export async function getAvailableYears(): Promise<number[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get(`${API_URL}/missions/years`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur lors de la récupération des années");
  }
}