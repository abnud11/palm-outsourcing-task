import { POST } from '@/app/api/tokens/[id]/renew/route';
import dayjs from '@/lib/dayjs';
import { connectToDatabase } from '@/lib/models/db';
import { visibleDummyTokens } from '@/lib/models/seed';
import { TokenModel, TokenStatus } from '@/lib/models/token';
import { VisibleTokenStatus } from '@/lib/services/token/types';
import { NextRequest } from 'next/server';

describe('POST /api/tokens/[id]/renew', () => {
  it('should renew an expired token', async () => {
    await connectToDatabase();
    const expiredToken = visibleDummyTokens.find((t) =>
      dayjs(t.expiryDate).isBefore(dayjs()),
    )!;
    const expiredTokenDocument = (await TokenModel.findOne(
      {
        token: expiredToken.token,
      },
      { _id: 1 },
    ))!;
    const request = new NextRequest(
      `http://localhost/api/tokens/${expiredTokenDocument.id as string}/renew`,
      {
        method: 'POST',
      },
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: expiredTokenDocument.id as string }),
    });
    expect(response.status).toBe(204);
    const renewedToken = await TokenModel.findById(
      expiredTokenDocument.id as string,
    );
    expect(renewedToken).toBeDefined();
    expect(renewedToken!.status).toBe(TokenStatus.ACTIVE);
    expect(dayjs(renewedToken!.expiryDate).isAfter(dayjs())).toBe(true);
  });

  it('should renew a revoked token', async () => {
    await connectToDatabase();
    const revokedToken = visibleDummyTokens.find(
      (t) => t.status === VisibleTokenStatus.REVOKED,
    )!;
    const revokedTokenDocument = (await TokenModel.findOne(
      {
        token: revokedToken.token,
      },
      { _id: 1 },
    ))!;
    const request = new NextRequest(
      `http://localhost/api/tokens/${revokedTokenDocument.id as string}/renew`,
      {
        method: 'POST',
      },
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: revokedTokenDocument.id as string }),
    });
    expect(response.status).toBe(204);
    const renewedToken = await TokenModel.findById(
      revokedTokenDocument.id as string,
    );
    expect(renewedToken).toBeDefined();
    expect(renewedToken!.status).toBe(TokenStatus.ACTIVE);
    expect(dayjs(renewedToken!.expiryDate).isAfter(dayjs())).toBe(true);
  });
});
