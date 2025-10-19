import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Por favor completa todos los campos" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("usuarios_Reales");
    const users = db.collection("usuarios_Reales");

    const existingUser = await users.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Usuario registrado exitosamente ✅" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
