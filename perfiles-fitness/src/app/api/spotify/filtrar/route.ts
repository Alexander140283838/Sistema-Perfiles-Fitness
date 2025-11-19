import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/spotifyToken";

// 🎶 Rangos típicos de BPM según género
const BPM_RANGES: Record<string, [number, number]> = {
  rock: [90, 150],
  salsa: [100, 160],
  dance: [110, 180],
  reggaeton: [85, 105],
  pop: [90, 130],
  relax: [60, 100],
  default: [80, 160],
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const genre = (url.searchParams.get("genre") || "rock").toLowerCase();
    const minDur = Number(url.searchParams.get("minDur") || 180);
    const maxDur = Number(url.searchParams.get("maxDur") || 300);

    // 🔐 Obtener token de Spotify Developer (Client Credentials)
    const token = await getAppAccessToken();

    // 🎵 Buscar canciones según género
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=30`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      throw new Error(`Spotify search error: ${res.statusText}`);
    }

    const data = await res.json();
    const tracks = data.tracks?.items || [];

    // 🕒 Filtrar canciones por duración (en milisegundos)
    const durFiltered = tracks.filter(
      (t: any) =>
        t.duration_ms >= minDur * 1000 && t.duration_ms <= maxDur * 1000
    );

    if (!durFiltered.length) {
      return NextResponse.json({
        message: "No se encontraron canciones con esa duración.",
      });
    }

    // 🎚️ Asignar BPM simulado según género
    const [minBpm, maxBpm] = BPM_RANGES[genre] || BPM_RANGES.default;

    const finalTracks = durFiltered
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        artists: t.artists?.map((a: any) => a.name).join(", "),
        album: t.album?.name,
        image: t.album?.images?.[0]?.url,
        bpm: Math.floor(Math.random() * (maxBpm - minBpm + 1)) + minBpm,
        duration_ms: t.duration_ms,
      }))
      .slice(0, 20);

    if (!finalTracks.length) {
      return NextResponse.json({
        message: "No se encontraron canciones para mostrar.",
      });
    }

    return NextResponse.json(finalTracks);
  } catch (err: any) {
    console.error("Error Spotify API:", err);
    return NextResponse.json(
      { error: "Error al obtener canciones desde Spotify Developer." },
      { status: 500 }
    );
  }
}
