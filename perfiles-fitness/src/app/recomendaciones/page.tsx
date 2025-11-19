"use client";

import { useState } from "react";
import Image from "next/image";

export default function RecomendacionesPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const perfiles = [
    {
      nombre: "Cardio 🩸",
      genre: "dance",
      minTempo: 110,
      maxTempo: 140,
      color: "from-pink-500 to-red-500",
    },
    {
      nombre: "Fuerza 💪",
      genre: "rock",
      minTempo: 90,
      maxTempo: 120,
      color: "from-orange-500 to-yellow-500",
    },
    {
      nombre: "Relajado 🌿",
      genre: "chill",
      minTempo: 70,
      maxTempo: 90,
      color: "from-blue-500 to-green-500",
    },
  ];

  // ✅ Versión corregida y segura
  const obtenerRecomendaciones = async (perfil: any) => {
    setLoading(true);
    setSongs([]);

    try {
      const res = await fetch(
        `/api/spotify/recomendaciones?genre=${perfil.genre}&minTempo=${perfil.minTempo}&maxTempo=${perfil.maxTempo}&limit=10`
      );
      const data = await res.json();

      // 🔒 Verificar que sea un arreglo
      if (Array.isArray(data)) {
        setSongs(data);
      } else if (Array.isArray(data.tracks)) {
        setSongs(data.tracks);
      } else {
        setSongs([]); // evita el error .map()
      }
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      setSongs([]); // fallback seguro
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎶 Generador de Playlists Dinámicas
      </h1>

      {/* Tarjetas de perfiles */}
      <section className="grid md:grid-cols-3 gap-6 mb-10">
        {perfiles.map((perfil) => (
          <button
            key={perfil.nombre}
            onClick={() => obtenerRecomendaciones(perfil)}
            className={`p-6 rounded-xl text-white bg-gradient-to-r ${perfil.color} hover:scale-105 transition-transform`}
          >
            <h2 className="text-2xl font-semibold">{perfil.nombre}</h2>
            <p className="mt-2 opacity-90">
              Género: {perfil.genre.toUpperCase()} <br />
              BPM: {perfil.minTempo} – {perfil.maxTempo}
            </p>
          </button>
        ))}
      </section>

      {/* Estado de carga */}
      {loading && (
        <p className="text-center text-gray-400 mt-4">
          Cargando canciones recomendadas...
        </p>
      )}

      {/* Lista de canciones */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(songs) &&
          songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {song.image && (
                <Image
                  src={song.image}
                  alt={song.name}
                  width={300}
                  height={300}
                  className="rounded-md mb-3"
                />
              )}
              <h3 className="text-lg font-bold">{song.name}</h3>
              <p className="text-gray-400">{song.artists}</p>
              <p className="text-sm text-gray-500">{song.album}</p>

              {song.preview_url && (
                <audio controls className="w-full mt-2">
                  <source src={song.preview_url} type="audio/mpeg" />
                </audio>
              )}
            </div>
          ))}
      </section>

      {/* Mensaje inicial */}
      {!loading && Array.isArray(songs) && songs.length === 0 && (
        <p className="text-center text-gray-400 mt-6">
          Selecciona un perfil arriba para generar tu playlist 🎧
        </p>
      )}
    </main>
  );
}
