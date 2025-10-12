import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = "https://36db260922ed.ngrok-free.app/devolucion-de-llamada";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
].join(" ");

export async function GET(req: NextRequest) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
