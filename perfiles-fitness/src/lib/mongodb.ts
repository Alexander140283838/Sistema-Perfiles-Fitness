import { MongoClient, MongoClientOptions } from "mongodb";

const uri: string = process.env.MONGO_URI!;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGO_URI) {
  throw new Error("Debes definir MONGO_URI en tu .env");
}

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // @ts-ignore
    (global as any)._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
