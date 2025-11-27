import { NextResponse } from "next/server";
import { getSpotifyToken } from "@/lib/spotifyToken";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim() === "") {
      return NextResponse.json(
        { error: "Debes enviar un parámetro ?q=" },
        { status: 400 }
      );
    }

    // Obtener token válido
    const token = await getSpotifyToken();

    // Llamar a Spotify Search
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      q
    )}&type=track&limit=20`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await resp.json();

    if (!data.tracks) {
      return NextResponse.json(
        { error: "Spotify no devolvió resultados" },
        { status: 500 }
      );
    }

    // Limpiar datos
    const resultados = data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      image: track.album.images?.[0]?.url || "",
      preview_url: track.preview_url,
    }));

    return NextResponse.json({ resultados });
  } catch (error) {
    console.error("Error en /api/spotify/buscar:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
