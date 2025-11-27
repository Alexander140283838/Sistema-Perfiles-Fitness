import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lista from "@/models/Lista";

export async function POST(req: Request) {
  try {
    const { usuario, nombre, descripcion } = await req.json();

    if (!usuario || !nombre) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    await connectDB();

    const nuevaLista = await Lista.create({
      usuario,
      nombre,
      descripcion,
      canciones: [],
    });

    return NextResponse.json(nuevaLista);
  } catch (error) {
    console.error("❌ Error creando lista:", error);
    return NextResponse.json(
      { error: "Error interno al crear la lista" },
      { status: 500 }
    );
  }
}
