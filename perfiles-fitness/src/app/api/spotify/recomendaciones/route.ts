// src/app/api/spotify/recomendaciones/route.ts
import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/spotifyToken";

type PerfilKey = "cardio" | "fuerza" | "hiit" | "relax" | "flow_urbano";

type PerfilConfig = {
  nombre: string;
  generos: string[];
};

const PERFIL_CONFIG: Record<PerfilKey, PerfilConfig> = {
  cardio: { nombre: "Cardio intenso", generos: ["pop", "dance-pop"] },
  fuerza: { nombre: "Fuerza y Potencia", generos: ["rock", "metal"] },
  hiit: { nombre: "HIIT explosivo", generos: ["pop", "rock"] },
  relax: { nombre: "Relajación", generos: ["acoustic", "classical"] },
  flow_urbano: { nombre: "Flow Urbano", generos: ["hiphop", "reggaeton"] },
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const perfilParam = (url.searchParams.get("perfil") || "cardio").toLowerCase();
    const perfil = perfilParam as PerfilKey;
    const config = PERFIL_CONFIG[perfil];

    if (!config) {
      return NextResponse.json(
        { error: "Perfil no válido", perfilesDisponibles: Object.keys(PERFIL_CONFIG) },
        { status: 400 }
      );
    }

    const token = await getAppAccessToken();

    const params = new URLSearchParams({
      seed_genres: config.generos.join(","),
      limit: "20",
    });
    const spotifyUrl = `https://api.spotify.com/v1/recommendations?${params.toString()}`;
    console.log("🔗 URL Spotify:", spotifyUrl);

    const res = await fetch(spotifyUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Spotify respondió:", text);
      return NextResponse.json({ error: "Error al consultar Spotify", detalle: text }, { status: 500 });
    }

    const data = await res.json();
    const tracks = data.tracks || [];

    const resultados = tracks.map((t: any) => ({
      id: t.id,
      name: t.name,
      artists: (t.artists || []).map((a: any) => a.name).join(", "),
      album: t.album?.name,
      image: t.album?.images?.[0]?.url || "",
      duration_ms: t.duration_ms,
      preview_url: t.preview_url,
    }));

    return NextResponse.json({ perfil, nombrePerfil: config.nombre, resultados });
  } catch (err) {
    console.error("❌ Error interno en /api/spotify/recomendaciones:", err);
    return NextResponse.json({ error: "Error interno en recomendaciones" }, { status: 500 });
  }
}
