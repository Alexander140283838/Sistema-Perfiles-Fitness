import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
if (!uri) throw new Error("❌ No se encontró la variable MONGO_URI en el archivo .env.local");

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Usamos variable global para evitar reconexiones en desarrollo
if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // En producción (Vercel, etc.)
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
