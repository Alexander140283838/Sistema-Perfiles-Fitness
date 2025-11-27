import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lista from "@/models/Lista";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { track } = body; // id, name, image, bpm, artists, duration

    const lista = await Lista.findById(params.id);

    if (!lista) {
      return NextResponse.json(
        { error: "Lista no encontrada" },
        { status: 404 }
      );
    }

    // Agregar canción al array
    lista.canciones.push(track);

    await lista.save();

    return NextResponse.json({
      message: "Canción agregada correctamente",
      lista,
    });
  } catch (error) {
    console.error("Error POST agregar canción:", error);
    return NextResponse.json(
      { error: "Error al agregar canción a la lista" },
      { status: 500 }
    );
  }
}
