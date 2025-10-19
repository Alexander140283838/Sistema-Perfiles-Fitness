import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("perfiles_fitness");

    const status = await db.command({ ping: 1 });
    return NextResponse.json({
      message: "✅ Conexión exitosa con MongoDB",
      status,
    });
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    return NextResponse.json(
      { error: "Error al conectar con MongoDB" },
      { status: 500 }
    );
  }
}
