import { NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/spotifyToken";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre") || "pop";
    const minTempo = searchParams.get("minTempo") || "90";
    const maxTempo = searchParams.get("maxTempo") || "130";
    const limit = searchParams.get("limit") || "10";

    // ✅ Token
    const token = await getAppAccessToken();

    // 🎯 Ahora agregamos:
    // - seed_genres (principal)
    // - seed_artists (Adele como respaldo)
    // - seed_tracks (una canción popular)
    // - market=MX (país México)
    const url = `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_tracks=4uLU6hMCjMI75M1A2tKUQC&market=MX&limit=${limit}&min_tempo=${minTempo}&max_tempo=${maxTempo}`;

    console.log("🎧 Solicitando:", url);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = await res.text();
    console.log("📦 Respuesta bruta Spotify:", raw.slice(0, 300));

    if (!res.ok) {
      console.error("❌ Spotify respondió error:", res.status);
      return NextResponse.json([], { status: 200 });
    }

    const data = JSON.parse(raw);
    const tracks = Array.isArray(data.tracks) ? data.tracks : [];

    const canciones = tracks.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name).join(", "),
      album: track.album?.name || "Desconocido",
      image: track.album?.images?.[0]?.url || null,
      preview_url: track.preview_url,
    }));

    console.log(`✅ ${canciones.length} canciones obtenidas para ${genre}`);
    return NextResponse.json(canciones, { status: 200 });
  } catch (error: any) {
    console.error("💥 Error en recomendaciones:", error.message);
    return NextResponse.json([], { status: 200 });
  }
}
