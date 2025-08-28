import { MongoClient } from 'mongodb';

let client;
let clientPromise;

const uri = process.env.MONGO_URI; // e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname
const options = {};

if (!uri) throw new Error('Please define MONGO_URI in .env');

if (process.env.NODE_ENV === 'development') {
  // In dev, use a global variable so it doesn't create multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(); // use default DB from URI
}
