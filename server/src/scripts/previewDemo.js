// Persistent local demo database for BonAppé Find.
// Starts an isolated MongoDB instance, seeds the project's real demo data,
// starts the API, and keeps the database for subsequent launches.

import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const seedDataDir = path.resolve(__dirname, '..', 'seed', 'data');

process.env.NODE_ENV = 'development';
process.env.DEMO_MODE = 'true';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  'bonappe-find-demo-secret-key-2026-secure-preview-only';
process.env.CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173';
process.env.APP_URL =
  process.env.APP_URL || 'http://127.0.0.1:5173';
process.env.PORT = process.env.PORT || '5000';

const dbPath = path.join(projectRoot, '.local-demo-db');
await fs.mkdir(dbPath, {recursive:true});
console.log(`Demo database directory: ${dbPath}`);

let mongod;
let server;
let shuttingDown = false;

async function readSeed(name) {
  const file = path.join(seedDataDir, `${name}.json`);
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function cleanup(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error('Server shutdown warning:', error.message);
  }

  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB disconnect warning:', error.message);
  }

  try {
    if (mongod) await mongod.stop();
  } catch (error) {
    console.error('Demo MongoDB shutdown warning:', error.message);
  }

  try {
    // Keep local data for the next launch.
  } catch (error) {
    console.error('Temporary-file cleanup warning:', error.message);
  }

  process.exit(exitCode);
}

try {
  mongod = await MongoMemoryServer.create({
    binary: {
      version: process.env.MONGOMS_VERSION || '7.0.24',
    },
    instance: {
      dbPath,
      // Windows keeps its original options; isolated Linux environments use TCP only.
      ...(process.platform==='win32'?{}:{args:['--nounixsocket']}),
    },
  });

  const mongoUri = mongod.getUri();
  process.env.MONGODB_URI = mongoUri;
  process.env.MONGO_URI = mongoUri;

  console.log('Demo MongoDB started successfully.');
  console.log(`MongoDB URI: ${mongoUri}`);

  await mongoose.connect(mongoUri, { dbName: 'bonappefind_preview' });
  console.log('MongoDB connected: bonappefind_preview');

  // Use the project's actual Mongoose models so the seeded documents
  // match the fields expected by the API and frontend.
  const M = await import('../models/index.js');

  if (!await M.Setting.exists({key:'localDemoInitialized'})) {
  const seedSets = [
    ['restaurants', M.Restaurant],
    ['countries', M.Country],
    ['guides', M.Guide],
    ['faqs', M.Faq],
  ];

  for (const [name, Model] of seedSets) {
    const rows = await readSeed(name);
    await Model.deleteMany({});
    if (rows.length) {
      await Model.insertMany(rows);
    }
    console.log(`Seeded ${rows.length} ${name}.`);
  }

  const {seedSampleReviews}=await import('../seed/sampleReviews.js');
  await seedSampleReviews(await readSeed('restaurants'));

  // Restore the project's original sample accounts.
  const bcrypt = (await import('bcryptjs')).default;
  const passwordHash = await bcrypt.hash('ReviewOnly123', 8);



  const demoOwner = await M.User.create({
    name: 'Demo owner',
    email: 'owner@example.test',
    passwordHash,
    role: 'owner',
    emailVerified: true,
    ownerProfile: {
      businessName: 'Fictional demo restaurant',
      verificationStatus: 'approved',
    },
  });

  await M.User.create({
    name: 'Demo diner',
    email: 'customer@example.test',
    passwordHash,
    role: 'customer',
    emailVerified: true,
  });

  // Give the owner one of the seeded restaurants.
  await M.Restaurant.updateOne(
    { restaurant_id: 'BF-001' },
    {
      ownerId: demoOwner._id,
      createdBy: demoOwner._id,
      isClaimed: true,
    }
  );

  await M.Setting.create({key:'localDemoInitialized'});
  } else {
    console.log('Restored saved local demo data.');
  }

  // Import app only after demo environment and database are ready.
  const { app } = await import('../app.js');
  const port = Number(process.env.PORT || 5000);

  server = app.listen(port, '127.0.0.1', () => {
    console.log('');
    console.log('==============================================');
    console.log('       BonAppé Find — Demo Mode');
    console.log('==============================================');
    console.log('Demo database: READY (changes are saved locally)');
    console.log('Backend server: READY');
    console.log(`Backend API: http://127.0.0.1:${port}`);
    console.log('Frontend:    http://127.0.0.1:5173/');
    console.log('');
    console.log('Sample Accounts — For Checking');
    console.log('Customer: customer@example.test / ReviewOnly123');
    console.log('Owner:    owner@example.test / ReviewOnly123');
    console.log('');
    console.log('Keep this terminal open while using BonAppé Find.');
  });
} catch (error) {
  console.error('');
  console.error('BonAppé Find demo startup failed:');
  console.error(error);
  await cleanup(1);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => cleanup(0));
}
