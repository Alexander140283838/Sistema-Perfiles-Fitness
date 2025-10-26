"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Inicio() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // ✅ Verificar sesión
  useEffect(() => {
    const checkSession = () => {
      const loggedInLocal = localStorage.getItem("loggedIn");
      const loggedInCookie = document.cookie.includes("loggedIn=true");
      const storedUser = localStorage.getItem("username");

      if ((loggedInLocal === "true" || loggedInCookie) && storedUser) {
        setUsername(storedUser);
      } else {
        // 🚫 No hay sesión → limpiar todo y redirigir
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        document.cookie =
          "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        router.replace("/login");
      }
      setIsChecking(false);
    };

    checkSession();
  }, [router]);

  // 🔓 Cerrar sesión correctamente
  const handleLogout = () => {
    // 🧹 Borrar localStorage
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");

    // 🗑️ Borrar cookie universalmente
    document.cookie =
      "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    // 🔁 Redirigir limpio al login
    router.replace("/login");
  };

  // ⏳ Mientras verifica la sesión
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Verificando sesión...
      </div>
    );
  }

  // ⚠️ Si no hay usuario (evita pantalla negra)
  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Redirigiendo al inicio de sesión...
      </div>
    );
  }

  // ✅ Si hay sesión, mostrar la interfaz
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-green-400">
          Sistema Perfiles Fitness
        </h2>
        <nav className="flex flex-col gap-2 mt-4">
          <Link href="/inicio" className="hover:text-green-400 transition-colors">
            Inicio
          </Link>
          <Link href="/buscar" className="hover:text-green-400 transition-colors">
            Buscar
          </Link>
          <Link href="/mibiblioteca" className="hover:text-green-400 transition-colors">
            Mi biblioteca
          </Link>
          <hr className="border-gray-700 my-2" />
          <Link href="/crearlista" className="hover:text-green-400 transition-colors">
            Crear lista
          </Link>
          <Link href="/canciones" className="hover:text-green-400 transition-colors">
            Canciones que te gustan
          </Link>
        </nav>

        {/* Botón de cierre de sesión */}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-10 flex flex-col items-center justify-center text-center">
        <div className="bg-gradient-to-r from-purple-700 via-purple-900 to-pink-700 p-10 rounded-3xl shadow-2xl w-full max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenid@ de nuevo{" "}
            <span className="text-green-400">{username}</span> 👋
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Bienvenido a tu{" "}
            <span className="text-green-400 font-semibold">panel principal</span>. Aquí podrás acceder a tus{" "}
            <span className="text-green-400">rutinas</span>,{" "}
            <span className="text-green-400">playlists</span> y{" "}
            <span className="text-green-400">recomendaciones personalizadas</span> para mejorar tu entrenamiento día a día.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push("/buscar")}
              className="bg-green-400 text-black font-bold py-2 px-6 rounded-xl hover:bg-green-500 transition"
            >
              Explorar música
            </button>
            <button
              onClick={() => router.push("/mibiblioteca")}
              className="border border-white text-white font-bold py-2 px-6 rounded-xl hover:bg-white hover:text-black transition"
            >
              Ir a mi biblioteca
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
