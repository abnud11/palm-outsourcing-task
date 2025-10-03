'use server';

import { Document, FilterQuery, FlattenMaps } from 'mongoose';
import { Token, TokenModel, TokenStatus } from '@/lib/models/token';
import dayjs from '@/lib/dayjs';
import { connectToDatabase } from '@/lib/models/db';
import { VisibleToken } from './types';
interface GetTokensParams {
  service?: string;
  expired?: boolean;
}

export async function getTokens(params: GetTokensParams) {
  await connectToDatabase();
  const query: FilterQuery<Token> = {};
  if (params.service) {
    query.service = { $regex: params.service || '' };
  }
  if (params.expired) {
    const now = dayjs().utc().toDate();
    query.expiryDate = { $lte: now };
  }
  // eslint-disable-next-line unicorn/no-array-method-this-argument
  const docs = (await TokenModel.find(query, {
    service: 1,
    token: 1,
    expiryDate: 1,
    // @ts-expect-error mongoose typing is wrong here, it doesn't understand $switch within projection
    status: {
      $switch: {
        branches: [
          {
            case: { $lt: ['$expiryDate', dayjs().utc().toDate()] },
            // eslint-disable-next-line unicorn/no-thenable
            then: 'Expired',
          },
          {
            case: { $eq: ['$status', 'active'] },
            // eslint-disable-next-line unicorn/no-thenable
            then: 'Active',
          },
        ],
        default: 'Revoked',
      },
    },
  })) as unknown as Document<VisibleToken>[];

  return docs.map(
    (doc) =>
      doc.toJSON({ flattenObjectIds: true }) as FlattenMaps<VisibleToken>,
  );
}

export async function renewToken(id: string) {
  await connectToDatabase();
  await TokenModel.updateOne(
    { _id: id },
    {
      $set: {
        expiryDate: dayjs().add(30, 'day').utc().toDate(),
        status: TokenStatus.ACTIVE,
      },
    },
  );
}

export async function revokeToken(id: string) {
  await connectToDatabase();
  await TokenModel.updateOne(
    { _id: id },
    {
      $set: {
        status: TokenStatus.REVOKED,
      },
    },
  );
}
