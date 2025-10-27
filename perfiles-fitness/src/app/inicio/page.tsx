"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const playlists = [
  { title: "Rutinas intensas", subtitle: "Lo mejor para entrenar", songs: 50, img: "/playlist1.jpg" },
  { title: "Relajación post-gym", subtitle: "Perfecta para estirarse", songs: 32, img: "/playlist2.jpg" },
  { title: "Rock motivador", subtitle: "Clásicos para el gym", songs: 75, img: "/playlist3.jpg" },
  { title: "Éxitos latinos", subtitle: "Energía para entrenar", songs: 40, img: "/playlist4.jpg" },
  { title: "Cardio electrónico", subtitle: "Ritmos para correr", songs: 28, img: "/playlist5.jpg" },
  { title: "Indie favorito", subtitle: "Ambiente alternativo", songs: 35, img: "/playlist6.jpg" },
];

type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: string;
};

export default function Inicio() {
  const router = useRouter();
  const [spotifyTracks, setSpotifyTracks] = useState<Track[]>([]);
  const [loadingSpotify, setLoadingSpotify] = useState(true);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // ✅ Verificar sesión y cargar Spotify
  useEffect(() => {
    const checkSession = () => {
      const loggedInLocal = localStorage.getItem("loggedIn");
      const loggedInCookie = document.cookie.includes("loggedIn=true");
      const storedUser = localStorage.getItem("username");

      if ((loggedInLocal === "true" || loggedInCookie) && storedUser) {
        setUsername(storedUser);
      } else {
        // 🚫 No hay sesión → limpiar y redirigir
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        document.cookie =
          "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        router.replace("/login");
        return;
      }

      // 🎵 Cargar canciones Spotify si hay token
      const token = localStorage.getItem("spotify_access_token");
      setSpotifyToken(token);

      if (token) {
        fetch("/api/spotify/top-playlist", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setSpotifyTracks(data.tracks || []))
          .catch(() => console.log("Error cargando canciones de Spotify"))
          .finally(() => setLoadingSpotify(false));
      } else {
        setLoadingSpotify(false);
      }

      setIsChecking(false);
    };

    checkSession();
  }, [router]);

  // 🔓 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("spotify_access_token");

    document.cookie =
      "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    router.push("/login");
    window.location.reload();
  };

  // ⏳ Mientras verifica la sesión
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Verificando sesión...
      </div>
    );
  }

  // ⚠️ Si no hay usuario
  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Redirigiendo al inicio de sesión...
      </div>
    );
  }

  // ✅ Si hay sesión activa
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-green-400">
            Sistema Perfiles Fitness
          </h2>
          <p className="text-gray-400 mt-1 mb-3 text-sm">
            Hola, {username} 👋
          </p>

          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/inicio" className="hover:text-green-400">Inicio</Link>
            <Link href="/buscar" className="hover:text-green-400">Buscar</Link>
            <Link href="/mi-biblioteca" className="hover:text-green-400">Mi biblioteca</Link>
            <hr className="border-gray-700 my-2" />
            <Link href="/crear-lista" className="hover:text-green-400">Crear lista</Link>
            <Link href="/canciones-te-gustan" className="hover:text-green-400">Canciones que te gustan</Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {/* Banner */}
        <section className="mb-10 p-8 rounded-lg bg-gradient-to-r from-purple-700 via-purple-900 to-pink-700 relative">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a <span className="text-green-400">Sistema Perfiles Fitness</span>
          </h1>
          <p className="mb-6">
            Música, rutinas y playlists creadas para motivar tus entrenamientos. 
            Descubre nuevas formas de mantener la energía al máximo.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/buscar")}
              className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:bg-green-500"
            >
              Explorar música
            </button>
            <button
              onClick={() => router.push("/mi-biblioteca")}
              className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black"
            >
              Ir a mi biblioteca
            </button>
          </div>
        </section>

        {/* Playlists destacadas */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Listas de reproducción destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {playlists.map((pl, index) => (
              <div
                key={index}
                onClick={() => router.push(`/playlist/${index}`)}
                className="bg-gray-800 rounded p-2 hover:bg-gray-700 cursor-pointer"
              >
                <div className="relative w-full h-40 mb-2">
                  <Image
                    src={pl.img}
                    alt={pl.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <h3 className="font-bold">{pl.title}</h3>
                <p className="text-sm text-gray-400">{pl.subtitle}</p>
                <p className="text-xs text-gray-500">{pl.songs} canciones</p>
              </div>
            ))}
          </div>
        </section>

        {/* Canciones de Spotify */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Tus canciones de Spotify</h2>

          {!spotifyToken ? (
            <a
              href="/api/spotifyLogin"
              className="inline-block bg-green-400 text-black font-bold py-2 px-4 rounded hover:bg-green-500"
            >
              Iniciar sesión con Spotify
            </a>
          ) : loadingSpotify ? (
            <p>Cargando canciones...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {spotifyTracks.map((track) => (
                <div key={track.id} className="bg-gray-800 rounded p-4 hover:bg-gray-700">
                  <h3 className="font-bold">{track.name}</h3>
                  <p className="text-sm text-gray-400">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">{track.album}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
