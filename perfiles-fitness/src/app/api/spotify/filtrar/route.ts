import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/spotifyToken"; // <-- CORRECTO

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
    const genreParam = (url.searchParams.get("genre") || "rock").toLowerCase();
    const minDur = Number(url.searchParams.get("minDur") || 180);
    const maxDur = Number(url.searchParams.get("maxDur") || 300);

    const token = await getAppAccessToken(); // <-- usar el export real

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(
        genreParam
      )}&type=track&limit=30`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Spotify search error:", text);
      throw new Error(`Spotify search error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    const tracks = data.tracks?.items || [];

    const durFiltered = tracks.filter(
      (t: any) => t.duration_ms >= minDur * 1000 && t.duration_ms <= maxDur * 1000
    );

    if (!durFiltered.length) {
      return NextResponse.json({
        message: "No se encontraron canciones con esa duración.",
      });
    }

    const [minBpm, maxBpm] = BPM_RANGES[genreParam] || BPM_RANGES.default;

    const finalTracks = durFiltered.map((t: any) => ({
      id: t.id,
      name: t.name,
      artists: t.artists?.map((a: any) => a.name).join(", "),
      album: t.album?.name,
      image: t.album?.images?.[0]?.url || "",
      bpm: Math.floor(Math.random() * (maxBpm - minBpm + 1)) + minBpm,
      duration_ms: t.duration_ms,
      preview_url: t.preview_url,
    }));

    return NextResponse.json(finalTracks.slice(0, 20));
  } catch (err: any) {
    console.error("Error Spotify API:", err);
    return NextResponse.json(
      { error: "Error al obtener canciones desde Spotify Developer." },
      { status: 500 }
    );
  }
}
