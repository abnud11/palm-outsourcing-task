import { POST } from '@/app/api/tokens/[id]/revoke/route';
import { connectToDatabase } from '@/lib/models/db';
import { visibleDummyTokens } from '@/lib/models/seed';
import { TokenModel, TokenStatus } from '@/lib/models/token';
import { VisibleTokenStatus } from '@/lib/services/token/types';
import { NextRequest } from 'next/server';

describe('POST /api/tokens/[id]/revoke', () => {
  it('should revoke a token successfully', async () => {
    await connectToDatabase();
    const activeToken = visibleDummyTokens.find(
      (t) => t.status === VisibleTokenStatus.ACTIVE,
    )!;
    const activeTokenDocument = (await TokenModel.findOne(
      {
        token: activeToken.token,
      },
      { _id: 1 },
    ))!;
    const request = new NextRequest(
      `http://localhost/api/tokens/${activeTokenDocument.id as string}/revoke`,
      {
        method: 'POST',
      },
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: activeTokenDocument.id as string }),
    });
    expect(response.status).toBe(204);
    const revokedToken = await TokenModel.findById(
      activeTokenDocument.id as string,
    );
    expect(revokedToken).toBeDefined();
    expect(revokedToken!.status).toBe(TokenStatus.REVOKED);
  });
});
