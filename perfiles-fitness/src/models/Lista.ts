import mongoose, { Schema, models } from "mongoose";

const ListaSchema = new Schema(
  {
    usuario: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, default: "" },
    canciones: { type: Array, default: [] }
  },
  { timestamps: true }
);

const Lista = models.Lista || mongoose.model("Lista", ListaSchema);

export default Lista;
