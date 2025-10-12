import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { searchParams } = new URL(req.url);
    const correo = searchParams.get("correo");

    const usuario = await db.collection("usuarios_reales").findOne({ correo });

    return new Response(JSON.stringify({ usuario }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { correo, nombre } = body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection("usuarios_reales")
      .findOneAndUpdate(
        { correo },
        { $set: { nombre } },
        { returnDocument: "after" }
      );

    return new Response(
      JSON.stringify({ message: "Perfil actualizado ✅", usuario: result.value }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
