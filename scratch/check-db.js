const fs = require('fs');
const mongoose = require('mongoose');

const envText = fs.readFileSync('.env', 'utf-8');
const match = envText.match(/MONGODB_URI=(.+)/);
const MONGODB_URI = match ? match[1].trim() : null;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`Collection ${col.name}: ${count} documents`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
