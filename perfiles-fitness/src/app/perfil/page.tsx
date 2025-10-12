"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [edad, setEdad] = useState("");
  const [objetivo, setObjetivo] = useState("");

  // Verificar si el usuario está logueado
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const savedUser = localStorage.getItem("username");

    if (!loggedIn) {
      router.push("/login"); // Redirige si no hay sesión
    } else {
      setUsername(savedUser || "");
      setEdad(localStorage.getItem("edad") || "");
      setObjetivo(localStorage.getItem("objetivo") || "");
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("edad", edad);
    localStorage.setItem("objetivo", objetivo);
    alert("Perfil actualizado ✅");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Perfil de {username}</h2>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="p-2 rounded bg-gray-700"
          />
          <input
            type="text"
            placeholder="Objetivo (ej: bajar de peso, ganar músculo)"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="p-2 rounded bg-gray-700"
          />
          <button
            type="submit"
            className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:bg-green-500"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
