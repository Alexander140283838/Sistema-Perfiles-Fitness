"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ListaPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listaId = params.id as string;

  const [lista, setLista] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos de la lista por ID
  useEffect(() => {
    if (!listaId) return; // por seguridad

    async function fetchLista() {
      try {
        const res = await fetch(`/api/listas/${listaId}`);
        const data = await res.json();

        setLista(data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando lista", error);
        setLoading(false);
      }
    }

    fetchLista();
  }, [listaId]);

  // Eliminar canción
  async function eliminarCancion(trackId: string) {
    const res = await fetch(`/api/listas/${listaId}/eliminar-cancion`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId }),
    });

    const data = await res.json();

    if (data.ok) {
      setLista((prev: any) => ({
        ...prev,
        canciones: prev.canciones.filter((c: any) => c.id !== trackId),
      }));
    }
  }

  if (loading || !lista) {
    return <p className="text-white p-10">Cargando lista...</p>;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold mb-2">{lista.nombre}</h1>
      <p className="text-gray-300 mb-5">{lista.descripcion}</p>

      {/* Enviamos el ID de la lista a /buscar */}
      <button
        onClick={() => router.push(`/buscar?id=${listaId}`)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-black font-semibold"
      >
        + Agregar canciones
      </button>

      <div className="mt-10">
        {lista.canciones.length === 0 ? (
          <p className="mt-10 text-gray-400">
            Esta lista no tiene canciones todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lista.canciones.map((song: any) => (
              <div
                key={song.id}
                className="bg-[#1E1E1E] p-4 rounded-lg shadow-lg"
              >
                <img
                  src={song.image}
                  className="w-full h-48 object-cover rounded"
                  alt={song.name}
                />

                <h2 className="text-xl font-semibold mt-2">{song.name}</h2>
                <p className="text-gray-400 text-sm">{song.artists}</p>
                <p className="text-gray-500 text-sm">{song.album}</p>

                <div className="flex justify-between mt-4">
                  <span className="text-green-400">{song.bpm} BPM</span>

                  <button
                    onClick={() => eliminarCancion(song.id)}
                    className="text-red-400 hover:text-red-600 font-bold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
