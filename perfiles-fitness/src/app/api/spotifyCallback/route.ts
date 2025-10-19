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
      redirect_uri: process.env.REDIRECT_URI!,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error de token:", data);
      return NextResponse.json({ error: data.error_description }, { status: 400 });
    }

    const redirectUrl = new URL(process.env.NEXT_PUBLIC_REDIRECT_SUCCESS_URL!);
    redirectUrl.searchParams.set("access_token", data.access_token);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error general en Callback:", error);
    return NextResponse.json({ error: "Error obteniendo token de Spotify" }, { status: 500 });
  }
}
