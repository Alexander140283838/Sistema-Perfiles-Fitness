"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Devolucion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      // Aquí envías el código a tu API para intercambiarlo por access_token
      fetch("/api/spotifyToken", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: { "Content-Type": "application/json" },
      })
        .then(res => res.json())
        .then(data => console.log("Token recibido:", data))
        .catch(err => console.error(err));
    }
  }, [searchParams]);

  return <div>Redirigiendo...</div>;
}
