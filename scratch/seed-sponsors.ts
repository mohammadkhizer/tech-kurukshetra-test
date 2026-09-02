import fs from 'fs';
import mongoose from 'mongoose';

const envText = fs.readFileSync('.env', 'utf-8');
const match = envText.match(/MONGODB_URI=(.+)/);
const MONGODB_URI = match ? match[1].trim() : null;

if (!MONGODB_URI) {
  console.error('No MONGODB_URI');
  process.exit(1);
}

const SPONSORS_DATA = [
  {
    name: 'SVGU',
    category: 'Title Partner',
    logoUrl: '/images/sponsors/svgu.svg',
    websiteUrl: 'https://www.svgu.ac.in',
    order: 1,
  },
  {
    name: 'GitHub',
    category: 'Technology Partner',
    logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png',
    websiteUrl: 'https://github.com',
    order: 2,
  },
  {
    name: 'Vercel',
    category: 'Deployment Partner',
    logoUrl: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
    websiteUrl: 'https://vercel.com',
    order: 3,
  },
  {
    name: 'Supabase',
    category: 'Database Partner',
    logoUrl: 'https://supabase.com/gks/supabase-logo-icon.png',
    websiteUrl: 'https://supabase.com',
    order: 4,
  },
  {
    name: 'Postman',
    category: 'API Partner',
    logoUrl: 'https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg',
    websiteUrl: 'https://postman.com',
    order: 5,
  },
  {
    name: 'Google Cloud',
    category: 'Cloud Partner',
    logoUrl: 'https://www.gstatic.com/images/branding/product/2x/google_cloud_64dp.png',
    websiteUrl: 'https://cloud.google.com',
    order: 6,
  },
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('sponsors');

    await collection.deleteMany({});
    console.log('Cleared old dummy sponsors from DB');

    const docs = SPONSORS_DATA.map((s) => ({
      ...s,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const res = await collection.insertMany(docs);
    console.log(`Successfully inserted ${res.insertedCount} clean sponsor records!`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
