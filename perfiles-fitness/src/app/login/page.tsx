"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ⚠️ Mensaje de error

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      router.push("/");
    }
  }, [router]);

  const handleLogin = () => {
    if (!username || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      router.push("/");
    } else {
      setError("Usuario o contraseña incorrectos");
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

        {/* ⚠️ Mensaje de error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-green-400 text-black font-bold py-3 rounded-xl hover:bg-green-500 transition-colors"
        >
          Iniciar sesión
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
