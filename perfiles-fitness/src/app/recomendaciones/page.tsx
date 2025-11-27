"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string;
  duration_ms: number;
  preview_url?: string;
};

const perfiles = [
  { id: "cardio", nombre: "Cardio 🔥", descripcion: "Ritmos rápidos para mantener la intensidad", color: "from-red-500 to-orange-500" },
  { id: "fuerza", nombre: "Fuerza 💪", descripcion: "Música poderosa para levantar pesado", color: "from-purple-600 to-indigo-600" },
  { id: "hiit", nombre: "HIIT ⚡", descripcion: "Explosividad y energía máxima", color: "from-yellow-500 to-red-600" },
  { id: "relax", nombre: "Relax 😌", descripcion: "Música suave para estiramientos", color: "from-blue-400 to-cyan-500" },
  { id: "flow_urbano", nombre: "Flow Urbano 🎧", descripcion: "Beats urbanos para activar el mood", color: "from-green-500 to-lime-500" },
];

export default function RecomendacionesPage() {
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [canciones, setCanciones] = useState<Track[]>([]);
  const [error, setError] = useState("");

  const obtenerRecomendaciones = async (perfil: any) => {
    try {
      setLoading(true);
      setError("");
      setPerfilSeleccionado(perfil.id);
      setCanciones([]);

      const res = await fetch(`/api/spotify/recomendaciones?perfil=${perfil.id}`);
      if (!res.ok) throw new Error("Error al obtener recomendaciones");

      const data = await res.json();
      setCanciones(data.resultados || []);
    } catch (err: any) {
      console.error("Error fetch recomendaciones:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-green-400">Perfiles Fitness SPIN 🎧🔥</h1>
      <p className="text-gray-300 mb-10">Selecciona un perfil y genera recomendaciones musicales según tu tipo de entrenamiento.</p>

      {/* Perfiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {perfiles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => obtenerRecomendaciones(p)}
            className={`cursor-pointer p-6 rounded-xl bg-gradient-to-br ${p.color} shadow-lg`}
          >
            <h2 className="text-2xl font-bold">{p.nombre}</h2>
            <p className="text-sm mt-2">{p.descripcion}</p>
          </motion.div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400 mt-6">{error}</p>}

      {/* Resultados */}
      {!loading && perfilSeleccionado && (
        <div className="mt-12">
          <h2 className="text-3xl font-semibold mb-4 text-green-400">
            Canciones recomendadas para: {perfilSeleccionado.toUpperCase()}
          </h2>
          {canciones.length === 0 ? (
            <p className="text-gray-400">No se encontraron canciones.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {canciones.map((song) => (
                <motion.div key={song.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700 transition">
                  <img src={song.image} alt={song.name} className="w-full h-48 object-cover rounded mb-3" />
                  <h3 className="font-bold">{song.name}</h3>
                  <p className="text-sm text-gray-400">{song.artists}</p>
                  <p className="text-xs text-gray-500 italic">{song.album}</p>
                  <p className="text-xs text-green-400 mt-1">⏱ {(song.duration_ms / 60000).toFixed(2)} min</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
