import mongoose from 'mongoose';
let cachedConnection: mongoose.Mongoose | null = null;

export async function connectToDatabase() {
  cachedConnection ??= await mongoose.connect(process.env.MONGODB_URI, {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
    dbName: process.env.MONGODB_DBNAME ?? 'test',
  });

  return cachedConnection;
}

export async function disconnectFromDatabase() {
  if (cachedConnection) {
    await cachedConnection.disconnect();
    cachedConnection = null;
  }
}
