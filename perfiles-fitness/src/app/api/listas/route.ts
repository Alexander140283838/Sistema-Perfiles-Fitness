import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lista from "@/models/Lista";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const usuario = searchParams.get("usuario");

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no enviado" },
        { status: 400 }
      );
    }

    await connectDB();

    const listas = await Lista.find({ usuario });

    return NextResponse.json(listas);
  } catch (error) {
    console.error("❌ Error en GET /api/listas:", error);
    return NextResponse.json(
      { error: "Error al obtener listas" },
      { status: 500 }
    );
  }
}
