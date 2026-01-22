"use client";

import { useState } from "react";
import { loginRequest } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage("");

    try {
      await loginRequest(email, password);
      // Redirection vers le dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage("Email ou mot de passe incorrect. Veuillez réessayer.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        
        <h1 className="text-3xl font-bold text-center mb-8">
          Bienvenue sur ton Dashboard Freelance
        </h1>

        {errorMessage && (
          <div className="mb-4 text-red-600 font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@mail.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg text-lg font-medium"
          >
            Connexion
          </button>

        </form>
      </div>
    </div>
  );
}
