import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json(); // datos que envía el formulario
    const { nombre, correo, contraseña } = body;

    if (!nombre || !correo || !contraseña) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); // nombre de tu base de datos
    const collection = db.collection("usuarios_reales"); // nueva colección

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 12);

    // Inserta el usuario en la base de datos
    const result = await collection.insertOne({
      nombre,
      correo,
      contraseña: hashedPassword,
      creado: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "✅ Usuario guardado", id: result.insertedId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
