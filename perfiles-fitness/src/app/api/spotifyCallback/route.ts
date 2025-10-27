import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Código de autorización no encontrado" }, { status: 400 });
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri:
        process.env.SPOTIFY_REDIRECT_URI ||
        "http://localhost:3000/api/spotifyCallback",
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error al obtener token:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    // Redirigir a /inicio con el token
    const redirectUrl =
      process.env.NEXT_PUBLIC_REDIRECT_SUCCESS_URL ||
      "https://sistema-perfiles-fitness.vercel.app/inicio";

    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set("spotify_access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error general en callback:", error);
    return NextResponse.json({ error: "Error obteniendo token de Spotify" }, { status: 500 });
  }
}
