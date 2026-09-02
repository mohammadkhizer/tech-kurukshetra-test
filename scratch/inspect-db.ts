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
    const items = await db.collection('events').find({}).toArray();
    
    const summary = items.map(item => ({
      id: item.slug || item._id.toString(),
      name: item.name,
      category: item.category,
      type: item.type,
      teamSize: `${item.teamSize?.min}-${item.teamSize?.max}`,
      venue: item.venue || item.location,
      date: item.date,
      time: item.time || item.startTime,
      duration: item.duration,
      entryFee: item.entryFee,
      prizePool: item.prizePool || item.prize,
      coordinatorContact: item.coordinatorContact,
      bannerImage: item.bannerImage || item.imageUrl,
      registrationDeadline: item.registrationDeadline,
    }));

    console.log(JSON.stringify(summary, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
