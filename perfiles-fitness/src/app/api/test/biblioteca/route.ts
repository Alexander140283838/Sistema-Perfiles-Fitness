import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const usuarioId = url.searchParams.get("usuarioId");

    if (!usuarioId) {
      return NextResponse.json({ error: "Falta usuarioId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Convertir string a ObjectId
    const usuario = await db
      .collection("usuarios_reales")
      .findOne({ _id: new ObjectId(usuarioId) }, { projection: { listas: 1, _id: 0 } });

    const listasUsuario = usuario?.listas || [];

    return NextResponse.json({ listas: listasUsuario });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error cargando listas" }, { status: 500 });
  }
}
