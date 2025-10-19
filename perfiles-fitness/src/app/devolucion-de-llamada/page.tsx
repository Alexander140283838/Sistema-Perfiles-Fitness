"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function DevolucionInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      fetch("/api/spotifyToken", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: { "Content-Type": "application/json" },
      })
        .then(res => res.json())
        .then(data => console.log("✅ Token recibido:", data))
        .catch(err => console.error("❌ Error obteniendo token:", err));
    }
  }, [searchParams]);

  return <div>Redirigiendo...</div>;
}

export default function Devolucion() {
  return (
    <Suspense fallback={<div>Cargando devolución...</div>}>
      <DevolucionInner />
    </Suspense>
  );
}
