import mongoose from 'mongoose';
let cachedConnection: mongoose.Mongoose;

export async function connectToDatabase() {
  if (!cachedConnection) {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DBNAME ?? 'test',
    });
  }

  return cachedConnection;
}
