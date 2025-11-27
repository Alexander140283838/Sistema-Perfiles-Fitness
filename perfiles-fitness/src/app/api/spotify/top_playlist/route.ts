// src/app/api/spotify/top_playlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAppAccessToken } from "@/lib/spotifyToken";

export async function GET(req: NextRequest) {
  try {
    const token = await getAppAccessToken();
    const playlistId = "37i9dQZEVXbMDoHDwVN2tF"; // Top 50 Global de ejemplo

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Spotify top playlist error");

    const data = await res.json();
    const tracks = data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a: any) => ({ name: a.name })),
      album: item.track.album.name,
      image: item.track.album.images?.[0]?.url,
      duration_ms: item.track.duration_ms,
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error obteniendo top playlist:", error);
    return NextResponse.json({ error: "Error obteniendo canciones" }, { status: 500 });
  }
}
