import dayjs from 'dayjs';
import { connectToDatabase } from './db';
import { TokenModel, TokenStatus } from './token';
import { config } from 'dotenv';
import mongoose from 'mongoose';
config();

async function seed() {
  await connectToDatabase();
  await TokenModel.deleteMany();
  await TokenModel.insertMany([
    {
      service: 'GitHub',
      token: 'ghp_1234567890abcdef',
      expiryDate: dayjs().add(30, 'day').toDate(),
      status: TokenStatus.ACTIVE,
    },
    {
      service: 'GitLab',
      token: 'glpat-abcdef1234567890',
      expiryDate: dayjs().subtract(1, 'day').toDate(),
      status: TokenStatus.ACTIVE,
    },
    {
      service: 'Bitbucket',
      token: 'bbt-0987654321fedcba',
      expiryDate: dayjs().add(2, 'day').toDate(),
      status: TokenStatus.REVOKED,
    },
  ]);
  console.log('Database seeded!');
  await mongoose.disconnect();
}

void seed();
