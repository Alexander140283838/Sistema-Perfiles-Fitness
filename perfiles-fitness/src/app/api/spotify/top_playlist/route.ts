import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getAccessToken();
    const playlistId = "37i9dQZEVXbMDoHDwVN2tF"; // Top 50 Global de ejemplo

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const tracks = data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a: any) => ({ name: a.name })),
      album: item.track.album.name,
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error obteniendo canciones" }, { status: 500 });
  }
}
