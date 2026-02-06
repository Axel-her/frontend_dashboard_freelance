"use client";

import { useState } from "react";
import { registerRequest } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validatePassword(password)) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await registerRequest(email, password, nom, prenom);
      // Redirection vers le login après inscription
      router.push("/login");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        
        <h1 className="text-3xl font-bold text-center mb-8">
          Créer un compte
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
            <label className="block mb-1 font-medium">Nom</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Prénom</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Votre prénom"
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
            <p className="text-sm text-gray-500 mt-1">
              Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition text-white py-3 rounded-lg text-lg font-medium"
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>

        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">ou</p>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg text-lg font-medium mt-2"
            onClick={() => router.push('/login')}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}