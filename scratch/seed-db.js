const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const envText = fs.readFileSync('.env', 'utf-8');
const match = envText.match(/MONGODB_URI=(.+)/);
const MONGODB_URI = match ? match[1].trim() : null;

if (!MONGODB_URI) {
  console.error('No MONGODB_URI');
  process.exit(1);
}

// Import EVENTS_DATA by reading TS file or constructing directly
// Let's read events.ts or require compiled module
const eventsFile = fs.readFileSync('src/data/events.ts', 'utf-8');
// Parse EVENTS_DATA from events.ts using regex or ts execution
const tsx = require('d:/Webcraftingexperts/GIT/tech-kurukshetra-test/node_modules/tsx/cjs/api');
const { EVENTS_DATA } = require('./src/data/events.ts');

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('events');
    
    // Clear old if any and insert fresh
    await collection.deleteMany({});
    console.log('Cleared existing events collection');

    const formattedEvents = EVENTS_DATA.map(e => ({
      slug: e.slug || e.id,
      name: e.name,
      hook: e.hook || '',
      description: e.description,
      longDescription: e.description,
      iconName: e.iconName || 'Code2',
      prize: e.prizePool || 'TBA',
      prizePool: e.prizePool || 'TBA',
      difficulty: e.difficulty || 'Intermediate',
      category: e.category || 'TECH',
      isTechnical: e.category === 'TECH',
      type: e.type || 'team',
      teamSize: e.teamSize || { min: 1, max: 1 },
      rules: e.rules || [],
      eligibility: 'Open to all students',
      duration: e.duration || '24h',
      venue: e.venue || '',
      location: e.venue || '',
      date: e.date || '',
      time: e.time || '',
      registrationDeadline: e.registrationDeadline || '',
      entryFee: e.entryFee || 'Free',
      registrationFee: String(e.entryFee || 'Free'),
      coordinatorContact: e.coordinatorContact || { name: '', phone: '', email: '' },
      bannerImage: e.bannerImage || '',
      imageUrl: e.bannerImage || '',
      eventHead: e.coordinatorContact?.name || '',
      organiserContact: `${e.coordinatorContact?.phone || ''} | ${e.coordinatorContact?.email || ''}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await collection.insertMany(formattedEvents);
    console.log(`Successfully inserted ${result.insertedCount} arena events into MongoDB!`);
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
