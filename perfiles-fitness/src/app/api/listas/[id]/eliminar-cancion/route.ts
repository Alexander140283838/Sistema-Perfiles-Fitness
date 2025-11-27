import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lista from "@/models/Lista";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { trackId } = await req.json();

    if (!trackId) {
      return NextResponse.json(
        { error: "Falta trackId" },
        { status: 400 }
      );
    }

    const lista = await Lista.findById(params.id);
    if (!lista) {
      return NextResponse.json(
        { error: "Lista no encontrada" },
        { status: 404 }
      );
    }

    // FILTRA LAS CANCIONES QUITANDO LA QUE COINCIDE
    lista.canciones = lista.canciones.filter(
      (c: any) => c.id !== trackId
    );

    await lista.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error eliminando canción:", error);
    return NextResponse.json(
      { error: "Error en servidor" },
      { status: 500 }
    );
  }
}
