import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginRequest(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    console.log("Requête envoyée au backend avec :", { email, password }); // <--- AJOUT
    console.log("Réponse backend :", response.data); // <--- AJOUT
    // On récupère le token
    const token = response.data.access_token;

    // On le stocke (localStorage)
    localStorage.setItem("token", token);

    return token;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Propager l'erreur pour que la page puisse l'afficher
    throw new Error(
      error.response?.data?.message || "Erreur lors de la connexion"
    );
  }
}
