import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No se recibió el código de Spotify" }, { status: 400 });
    }

    // Intercambio del code por el access_token
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error de token:", data);
      return NextResponse.json({ error: data.error_description }, { status: 400 });
    }

    // Guardamos el token en la URL para probarlo o usarlo en cliente
    const redirectUrl = new URL("https://sistema-perfiles-fitness.vercel.app/mi-biblioteca");
    redirectUrl.searchParams.set("access_token", data.access_token);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error general en Callback:", error);
    return NextResponse.json({ error: "Error obteniendo token de Spotify" }, { status: 500 });
  }
}
