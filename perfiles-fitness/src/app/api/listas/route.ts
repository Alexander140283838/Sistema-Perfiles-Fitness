import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("perfiles_fitness"); // 👈 cambia por el nombre exacto de tu base de datos
    const url = new URL(req.url);
    const user = url.searchParams.get("user");

    if (!user) {
      return NextResponse.json({ error: "Usuario no especificado" }, { status: 400 });
    }

    const listas = await db.collection("listas").find({ username: user }).toArray();

    return NextResponse.json(listas);
  } catch (error) {
    console.error("❌ Error al obtener listas:", error);
    return NextResponse.json({ error: "Error al conectar con la base de datos" }, { status: 500 });
  }
}
