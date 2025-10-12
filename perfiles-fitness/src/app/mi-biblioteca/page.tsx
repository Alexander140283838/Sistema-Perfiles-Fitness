"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Cancion = {
  nombre: string;
  artista: string;
};

type Lista = {
  titulo: string;
  canciones: Cancion[];
};

type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
};

export default function MiBibliotecaPage() {
  const router = useRouter();
  const [listas, setListas] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<Track[]>([]);

  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";
  const usuarioId = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : "";

  // Verificar login y cargar listas y canciones de prueba
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
      router.push("/login");
      return;
    }

    if (usuarioId) {
      setLoading(true);
      fetch(`/api/biblioteca?usuarioId=${usuarioId}`)
        .then((res) => res.json())
        .then((data) => {
          setListas(data.listas || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Canciones de prueba de Spotify
    setSpotifyResults([
      { id: "1", name: "Shape of You", artists: [{ name: "Ed Sheeran" }] },
      { id: "2", name: "Blinding Lights", artists: [{ name: "The Weeknd" }] },
      { id: "3", name: "Levitating", artists: [{ name: "Dua Lipa" }] },
      { id: "4", name: "Peaches", artists: [{ name: "Justin Bieber" }] },
      { id: "5", name: "Save Your Tears", artists: [{ name: "The Weeknd" }] },
    ]);
  }, [router, usuarioId]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("usuarioId");
    router.push("/login");
  };

  // Buscar canciones en Spotify
  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await fetch(`/api/spotify/search?q=${query}`);
      const data = await res.json();
      setSpotifyResults(data.tracks || []);
    } catch (error) {
      console.error("Error buscando canciones:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 flex flex-col gap-4">
        <Link href="/inicio" className="text-xl font-bold text-green-400 hover:text-green-300 transition">
          Sistema Perfiles Fitness
        </Link>
        <nav className="flex flex-col gap-2 mt-4">
          <Link href="/inicio" className="hover:text-green-400">Inicio</Link>
          <Link href="/buscar" className="hover:text-green-400">Buscar</Link>
          <Link href="/mi_biblioteca" className="hover:text-green-400">Mi biblioteca</Link>
          <hr className="border-gray-700 my-2"/>
          <Link href="/crearlista" className="hover:text-green-400">Crear lista</Link>
          <Link href="/canciones" className="hover:text-green-400">Canciones que te gustan</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col items-center">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-900 to-pink-700 p-10 rounded-3xl shadow-2xl w-full max-w-4xl mb-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Mi biblioteca <span className="text-green-400">{username}</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Aquí verás todas tus canciones, playlists y rutinas guardadas.
          </p>
        </div>

        {/* Listas de MongoDB */}
        <div className="w-full max-w-4xl mb-8">
          {loading ? (
            <p>Cargando listas...</p>
          ) : listas.length === 0 ? (
            <p>No tienes listas guardadas aún.</p>
          ) : (
            listas.map((lista, idx) => (
              <div key={idx} className="bg-gray-800 rounded p-4 mb-4">
                <h3 className="font-bold text-lg mb-2">{lista.titulo}</h3>
                {lista.canciones && lista.canciones.length > 0 ? (
                  <div className="mt-2 flex flex-col gap-1">
                    {lista.canciones.map((cancion, i) => (
                      <p key={i} className="text-sm text-gray-400">
                        {cancion.nombre} - {cancion.artista}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay canciones en esta lista</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Búsqueda en Spotify */}
        <div className="w-full max-w-4xl mb-10">
          <h2 className="text-2xl font-bold mb-4">Canciones de Spotify</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 p-2 rounded text-black"
              placeholder="Nombre de la canción o artista"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-green-400 text-black px-4 rounded hover:bg-green-500"
            >
              Buscar
            </button>
          </div>
          {spotifyResults.length > 0 ? (
            <ul className="bg-gray-800 p-4 rounded max-h-80 overflow-y-auto">
              {spotifyResults.map((track) => (
                <li key={track.id} className="mb-2">
                  {track.name} - {track.artists.map((a) => a.name).join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No hay canciones para mostrar</p>
          )}
        </div>
      </main>
    </div>
  );
}
