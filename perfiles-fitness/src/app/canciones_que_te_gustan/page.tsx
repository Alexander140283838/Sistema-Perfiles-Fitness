"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Canciones() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") router.push("/login");
  }, [router]);

  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    router.push("/login");
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-5 flex flex-col gap-4">
        <Link href="/inicio" className="text-xl font-bold text-green-400 hover:text-green-300 transition">
          Sistema Perfiles Fitness
        </Link>
        <nav className="flex flex-col gap-2 mt-4">
          <Link href="/inicio" className="hover:text-green-400">Inicio</Link>
          <Link href="/buscar" className="hover:text-green-400">Buscar</Link>
          <Link href="/mibiblioteca" className="hover:text-green-400">Mi biblioteca</Link>
          <hr className="border-gray-700 my-2"/>
          <Link href="/crearlista" className="hover:text-green-400">Crear lista</Link>
          <Link href="/canciones" className="hover:text-green-400">Canciones que te gustan</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-10 flex flex-col items-center justify-center text-center">
        <div className="bg-gradient-to-r from-purple-700 via-purple-900 to-pink-700 p-10 rounded-3xl shadow-2xl w-full max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Canciones que te gustan <span className="text-green-400">{username}</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Aquí podrás ver todas tus canciones favoritas y reproducirlas cuando quieras.
          </p>
        </div>
      </main>
    </div>
  );
}
