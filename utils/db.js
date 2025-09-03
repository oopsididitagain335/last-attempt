import { MongoClient } from 'mongodb';

let client;
let db;

export async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(process.env.DB_NAME || 'myapp');
  }
  return db;
}
