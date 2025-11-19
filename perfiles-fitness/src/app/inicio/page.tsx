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

  const [songs, setSongs] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const perfiles = [
    {
      nombre: "🔥 Cardio Intenso",
      genre: "dance",
      minTempo: 120,
      maxTempo: 150,
      color: "from-pink-500 to-red-600",
      descripcion: "Energía alta para correr o spinning",
    },
    {
      nombre: "💪 Fuerza y Potencia",
      genre: "rock",
      minTempo: 90,
      maxTempo: 120,
      color: "from-yellow-500 to-orange-600",
      descripcion: "Rock motivador para levantar pesas",
    },
    {
      nombre: "🧘 Relajación y Estiramiento",
      genre: "chill",
      minTempo: 60,
      maxTempo: 90,
      color: "from-blue-500 to-green-500",
      descripcion: "Sonidos suaves para yoga o descanso",
    },
    {
      nombre: "⚡ HIIT Explosivo",
      genre: "edm",
      minTempo: 130,
      maxTempo: 160,
      color: "from-purple-600 to-indigo-600",
      descripcion: "Beats rápidos para intervalos intensos",
    },
    {
      nombre: "🎶 Flow Urbano",
      genre: "hip-hop",
      minTempo: 85,
      maxTempo: 115,
      color: "from-gray-700 to-gray-900",
      descripcion: "Estilo urbano con ritmos fuertes y flow",
    },
  ];

  const obtenerRecomendaciones = async (perfil: any) => {
    setLoadingRecs(true);
    setSongs([]);

    try {
      const res = await fetch(
        `/api/spotify/recomendaciones?genre=${perfil.genre}&minTempo=${perfil.minTempo}&maxTempo=${perfil.maxTempo}&limit=10`
      );
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      setSongs([]);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    const checkSession = () => {
      const loggedInLocal = localStorage.getItem("loggedIn");
      const loggedInCookie = document.cookie.includes("loggedIn=true");
      const storedUser = localStorage.getItem("username");

      if ((loggedInLocal === "true" || loggedInCookie) && storedUser) {
        setUsername(storedUser);
      } else {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        document.cookie =
          "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        router.replace("/login");
        return;
      }

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

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("spotify_access_token");
    document.cookie =
      "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    router.push("/login");
    window.location.reload();
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Verificando sesión...
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Redirigiendo al inicio de sesión...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-green-400">
            Sistema Perfiles Fitness
          </h2>
          <p className="text-gray-400 mt-1 mb-3 text-sm">Hola, {username} 👋</p>

          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/inicio" className="hover:text-green-400">
              Inicio
            </Link>
            <Link href="/buscar" className="hover:text-green-400">
              Buscar
            </Link>
            <Link href="/mi-biblioteca" className="hover:text-green-400">
              Mi biblioteca
            </Link>
            <hr className="border-gray-700 my-2" />
            <Link href="/crear-lista" className="hover:text-green-400">
              Crear lista
            </Link>
            <Link href="/canciones-te-gustan" className="hover:text-green-400">
              Canciones que te gustan
            </Link>
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
        <section className="mb-10 p-8 rounded-lg bg-gradient-to-r from-purple-700 via-purple-900 to-pink-700">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a{" "}
            <span className="text-green-400">Sistema Perfiles Fitness</span>
          </h1>
          <p className="mb-6">
            Música, rutinas y playlists creadas para motivar tus entrenamientos.
            Descubre nuevas formas de mantener la energía al máximo.
          </p>
        </section>

        {/* Listas destacadas */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Listas de reproducción destacadas
          </h2>
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

        {/* Generador de playlists */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎶 Generador de Playlists Dinámicas
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
            {perfiles.map((perfil) => (
              <button
                key={perfil.nombre}
                onClick={() => obtenerRecomendaciones(perfil)}
                className={`p-6 rounded-2xl text-white bg-gradient-to-r ${perfil.color} hover:scale-105 hover:shadow-lg transition-transform duration-300`}
              >
                <h2 className="text-xl font-bold mb-2">{perfil.nombre}</h2>
                <p className="text-sm text-gray-100 mb-3">{perfil.descripcion}</p>
                <p className="text-xs opacity-90">
                  🎧 Género: {perfil.genre.toUpperCase()} <br />
                  ⚡ BPM: {perfil.minTempo} – {perfil.maxTempo}
                </p>
              </button>
            ))}
          </div>

          {loadingRecs && (
            <div className="flex justify-center mt-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-400"></div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {songs.map((song) => (
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
          </div>

          {!loadingRecs && songs.length === 0 && (
            <p className="text-center text-gray-400 mt-6">
              Selecciona un perfil arriba para generar tu playlist 🎧
            </p>
          )}
        </section>

        {/* Canciones de Spotify */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4"></h2>

          {loadingSpotify ? (
            <p className="text-gray-400">Cargando canciones...</p>
          ) : spotifyTracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {spotifyTracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-gray-800 rounded p-4 hover:bg-gray-700 transition-all duration-200"
                >
                  <h3 className="font-bold text-white">{track.name}</h3>
                  <p className="text-sm text-gray-400">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">{track.album}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-4">
              
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
