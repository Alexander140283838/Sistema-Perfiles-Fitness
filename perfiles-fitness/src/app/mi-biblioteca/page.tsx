"use client";

import { useEffect, useState } from "react";

export default function MiBiblioteca() {
  const [username, setUsername] = useState<string | null>(null);
  const [listas, setListas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Obtener username desde localStorage
  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user);
  }, []);

  // Cargar listas del usuario
  useEffect(() => {
    if (!username) return;

    const fetchListas = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listas?usuario=${username}`);
        const data = await res.json();
        setListas(data);
      } catch (error) {
        console.error("Error al cargar listas", error);
      }
      setLoading(false);
    };

    fetchListas();
  }, [username]);

  // Enviar nueva lista
  const crearLista = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const res = await fetch("/api/listas/nueva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        usuario: username,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Lista creada correctamente 🎉");
      setShowModal(false);
      setNombre("");
      setDescripcion("");

      // Agregar la nueva lista al estado sin recargar
      setListas((prev) => [...prev, data]);
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">

      <h1 className="text-4xl font-bold mb-6">
        Mi biblioteca <span className="text-green-400">{username}</span>
      </h1>

      {/* BOTÓN CREAR LISTA */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded mb-6"
      >
        + Crear lista
      </button>

      {/* LISTADOS */}
      {loading ? (
        <p>Cargando listas...</p>
      ) : listas.length === 0 ? (
        <p>No tienes listas guardadas aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {listas.map((lst) => (
            <div
              key={lst._id}
              onClick={() => (window.location.href = `/lista/${lst._id}`)}
              className="relative cursor-pointer group rounded-xl p-5
                        bg-gradient-to-br from-gray-800 to-gray-900
                        border border-gray-700 shadow-md
                        transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* ICONO */}
              <div className="text-3xl mb-3 opacity-70 group-hover:opacity-100 transition">
                🎵
              </div>

              {/* NOMBRE */}
              <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition">
                {lst.nombre}
              </h3>

              {/* DESCRIPCIÓN */}
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {lst.descripcion}
              </p>

              {/* BOTÓN FLOTANTE */}
              <span
                className="absolute right-4 bottom-4 text-green-400 opacity-0 
                           group-hover:opacity-100 transition text-sm"
              >
                Ver lista →
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">

            <h2 className="text-2xl font-bold mb-4">Crear nueva lista</h2>

            <label className="block mb-2">Nombre de la lista</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 mb-4"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label className="block mb-2">Descripción</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 mb-4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>

              <button
                onClick={crearLista}
                className="py-2 px-4 bg-green-500 text-black font-bold rounded hover:bg-green-600"
              >
                Crear
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
