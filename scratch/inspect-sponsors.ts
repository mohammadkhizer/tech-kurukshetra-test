import fs from 'fs';
import mongoose from 'mongoose';

const envText = fs.readFileSync('.env', 'utf-8');
const match = envText.match(/MONGODB_URI=(.+)/);
const MONGODB_URI = match ? match[1].trim() : null;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI!);
    const db = mongoose.connection.db;
    if (!db) {
      console.error('Database connection not initialized');
      return;
    }
    const items = await db.collection('sponsors').find({}).toArray();
    console.log(`=== LIVE SPONSORS IN DB (${items.length}) ===`);
    console.log(JSON.stringify(items, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
