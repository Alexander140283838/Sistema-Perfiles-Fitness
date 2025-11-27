"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string;
  bpm: number;
  duration_ms: number;
};

export default function BuscarPage() {
  // ================================
  // LEER ID DE LA LISTA DESDE LA URL
  // ================================
  const searchParams = useSearchParams();
  const listaId = searchParams.get("id"); // ← CORREGIDO (antes decía "lista")

  const [genre, setGenre] = useState("rock");
  const [minBpm, setMinBpm] = useState(80);
  const [maxBpm, setMaxBpm] = useState(120);
  const [minDur, setMinDur] = useState(180);
  const [maxDur, setMaxDur] = useState(300);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // =====================================
  // BUSCAR CANCIONES EN API INTERNA
  // =====================================
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setTracks([]);
      setSearched(true);

      const res = await fetch(
        `/api/spotify/filtrar?genre=${genre}&minBpm=${minBpm}&maxBpm=${maxBpm}&minDur=${minDur}&maxDur=${maxDur}`
      );

      if (!res.ok) throw new Error("Error al buscar canciones en Spotify");

      const data = await res.json();
      setTracks(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido al buscar canciones");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // AGREGAR CANCIÓN A LA LISTA
  // =============================================
  const agregarCancion = async (track: Track) => {
    if (!listaId) {
      alert("No hay lista seleccionada.");
      return;
    }

    const res = await fetch(`/api/listas/${listaId}/agregar-cancion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track }),
    });

    if (res.ok) {
      alert(`🎶 Canción agregada a la lista correctamente`);
    } else {
      alert("Error al agregar canción.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-2">
        Buscar canciones por filtros 🎧
      </h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm mb-1">Género</label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
            placeholder="rock, salsa, dance..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">BPM mínimo</label>
          <input
            type="number"
            value={minBpm}
            onChange={(e) => setMinBpm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">BPM máximo</label>
          <input
            type="number"
            value={maxBpm}
            onChange={(e) => setMaxBpm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Duración mínima (segundos)</label>
          <input
            type="number"
            value={minDur}
            onChange={(e) => setMinDur(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Duración máxima (segundos)</label>
          <input
            type="number"
            value={maxDur}
            onChange={(e) => setMaxDur(Number(e.target.value))}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Botón buscar */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-green-400 text-black font-bold py-2 px-6 rounded hover:bg-green-500 transition disabled:opacity-50"
      >
        {loading ? "Buscando..." : "Buscar canciones"}
      </button>

      {/* SI NO HAY LISTA SELECCIONADA */}
      {!listaId && (
        <p className="mt-6 text-yellow-400 font-semibold">
          ⚠ No se ha seleccionado ninguna lista.  
          Regresa a una lista y presiona **"Agregar canciones"**.
        </p>
      )}

      {/* Resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {tracks.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition transform hover:scale-[1.02]"
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-full h-48 object-cover rounded mb-3 shadow-md"
            />

            <h3 className="font-bold text-lg">{t.name}</h3>
            <p className="text-sm text-gray-400">{t.artists}</p>
            <p className="text-xs text-gray-500 italic mb-2">{t.album}</p>

            <p className="text-xs text-green-400 mb-3">
              💽 <b>{t.bpm}</b> BPM • ⏱ {(t.duration_ms / 60000).toFixed(2)} min
            </p>

            {/* BOTÓN AGREGAR */}
            {listaId ? (
              <button
                onClick={() => agregarCancion(t)}
                className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
              >
                + Agregar a esta lista
              </button>
            ) : (
              <p className="text-yellow-400 text-sm">
                Selecciona una lista antes de agregar canciones.
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
