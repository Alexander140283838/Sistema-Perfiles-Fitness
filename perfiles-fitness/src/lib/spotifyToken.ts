// ✅ src/lib/spotifyToken.ts
// Genera un token de acceso con el flujo Client Credentials

export async function getAppAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("❌ Faltan SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET en el .env");
    throw new Error("Variables de entorno faltantes");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error al obtener token de Spotify:", text);
    throw new Error("Error al obtener token Spotify");
  }

  const data = await res.json();

  console.log("✅ Token de Spotify generado correctamente");
  return data.access_token;
}
