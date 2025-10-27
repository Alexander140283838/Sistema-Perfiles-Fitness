import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
  const REDIRECT_URI =
    process.env.SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/api/spotifyCallback";

  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json({ error: "Variables de entorno faltantes" }, { status: 500 });
  }

  const SCOPES = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "streaming",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
