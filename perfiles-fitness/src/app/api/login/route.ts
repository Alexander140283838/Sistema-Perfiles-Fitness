import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Por favor completa todos los campos" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("perfiles_fitness"); // ✅ base unificada
    const users = db.collection("usuarios");  // ✅ colección unificada

    const user = await users.findOne({ username: username.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Inicio de sesión exitoso ✅",
      user: { username: user.username },
    });
  } catch (error) {
    console.error("❌ Error en /api/login:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
