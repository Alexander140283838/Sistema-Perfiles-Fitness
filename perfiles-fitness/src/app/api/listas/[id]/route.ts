import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lista from "@/models/Lista";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const lista = await Lista.findById(params.id);

    if (!lista) {
      return NextResponse.json(
        { error: "Lista no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(lista);
  } catch (error) {
    console.error("Error GET lista:", error);
    return NextResponse.json(
      { error: "Error obteniendo la lista" },
      { status: 500 }
    );
  }
}
