"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Si ya está logueado, lo redirigimos al inicio
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      router.push("/inicio");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // ✅ Guardamos sesión en localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", data.user.username);

      // ✅ También guardamos cookie para el middleware
      document.cookie = "loggedIn=true; path=/; max-age=86400"; // dura 1 día

      router.push("/inicio");
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-purple-900 to-pink-700">
      <div className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Sistema Perfiles Fitness
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Inicia sesión para continuar
        </p>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          autoComplete="new-password"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full font-bold py-3 rounded-xl transition-colors ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-400 text-black hover:bg-green-500"
          }`}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          ¿No tienes cuenta?{" "}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}
