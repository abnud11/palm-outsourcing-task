import dayjs from 'dayjs';
import { connectToDatabase, disconnectFromDatabase } from './db';
import { Token, TokenModel, TokenStatus } from './token';
import { config } from 'dotenv';
import { VisibleTokenStatus } from '@/lib/services/token/types';
config();

export const dummyTokens: Token[] = [
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
];

export const visibleDummyTokens = [
  { ...dummyTokens[0], status: VisibleTokenStatus.ACTIVE },
  { ...dummyTokens[1], status: VisibleTokenStatus.EXPIRED },
  { ...dummyTokens[2], status: VisibleTokenStatus.REVOKED },
];

export const visibleDummyTokensWithId = [
  { ...dummyTokens[0], status: VisibleTokenStatus.ACTIVE, _id: '1' },
  { ...dummyTokens[1], status: VisibleTokenStatus.EXPIRED, _id: '2' },
  { ...dummyTokens[2], status: VisibleTokenStatus.REVOKED, _id: '3' },
];
export async function seed() {
  await connectToDatabase();
  await TokenModel.deleteMany();
  await TokenModel.insertMany(dummyTokens);
  console.log('Database seeded!');
  await disconnectFromDatabase();
}

if (process.env.NODE_ENV !== 'test') {
  void seed();
}
