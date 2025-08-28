let client;
let clientPromise;

if (!global._mongoClientPromise) {
  const { MongoClient } = require('mongodb');
  client = new MongoClient(process.env.MONGO_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db('thebiolink');
}

export default clientPromise;
