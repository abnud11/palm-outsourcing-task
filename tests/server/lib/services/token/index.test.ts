import dayjs from '@/lib/dayjs';
import { connectToDatabase } from '@/lib/models/db';
import { visibleDummyTokens } from '@/lib/models/seed';
import { TokenModel, TokenStatus } from '@/lib/models/token';
import { getTokens, renewToken, revokeToken } from '@/lib/services/token';
import { VisibleTokenStatus } from '@/lib/services/token/types';

describe('getTokens', () => {
  it('should return all tokens', async () => {
    const tokens = await getTokens({});
    expect(tokens).toHaveLength(3);
    expect(tokens).toMatchObject(visibleDummyTokens);
  });
  it('should filter tokens by service', async () => {
    const tokens = await getTokens({ service: 'GitHub' });
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject(
      visibleDummyTokens.find((t) => t.service === 'GitHub')!,
    );
  });

  it('should filter tokens by service with a regex not exact match', async () => {
    const tokens = await getTokens({ service: 'bI' });
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject(
      visibleDummyTokens.find((t) => t.service === 'Bitbucket')!,
    );
  });

  it('should return an empty array if no tokens match the filter', async () => {
    const tokens = await getTokens({ service: 'NonExistentService' });
    expect(tokens).toHaveLength(0);
  });

  it('should return expired tokens', async () => {
    const tokens = await getTokens({ expired: true });
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject(
      visibleDummyTokens.find((t) => dayjs(t.expiryDate).isBefore(dayjs()))!,
    );
  });
});

describe('renewToken', () => {
  it('should renew a token by updating its expiry date and status', async () => {
    await connectToDatabase();
    const expiredToken = visibleDummyTokens.find((t) =>
      dayjs(t.expiryDate).isBefore(dayjs()),
    )!;
    const expiredTokenDocument = await TokenModel.findOne(
      {
        token: expiredToken.token,
      },
      { _id: 1 },
    );
    await renewToken(expiredTokenDocument!._id.toString());
    const renewedToken = await TokenModel.findById(
      expiredTokenDocument!._id.toString(),
    );
    const service = expiredToken.service;
    expect(renewedToken).toBeDefined();
    expect(renewedToken!.service).toBe(service);
    expect(dayjs(renewedToken!.expiryDate).isAfter(dayjs())).toBe(true);
    expect(renewedToken!.status).toBe(TokenStatus.ACTIVE);
  });
  it('should renew a revoked token by updating its expiry date and status', async () => {
    await connectToDatabase();
    const revokedToken = visibleDummyTokens.find(
      (t) => t.status === VisibleTokenStatus.REVOKED,
    )!;
    const revokedTokenDocument = await TokenModel.findOne(
      {
        token: revokedToken.token,
      },
      { _id: 1 },
    );
    await renewToken(revokedTokenDocument!._id.toString());
    const renewedToken = await TokenModel.findById(
      revokedTokenDocument!._id.toString(),
    );
    const service = revokedToken.service;
    expect(renewedToken).toBeDefined();
    expect(renewedToken!.service).toBe(service);
    expect(dayjs(renewedToken!.expiryDate).isAfter(dayjs())).toBe(true);
    expect(renewedToken!.status).toBe(TokenStatus.ACTIVE);
  });
});

describe('revokeToken', () => {
  it('should revoke a token by updating its status to REVOKED', async () => {
    await connectToDatabase();
    const activeToken = visibleDummyTokens.find(
      (t) => t.status === VisibleTokenStatus.ACTIVE,
    )!;
    const activeTokenDocument = await TokenModel.findOne(
      {
        token: activeToken.token,
      },
      { _id: 1 },
    );
    await revokeToken(activeTokenDocument!._id.toString());
    const revokedToken = await TokenModel.findById(
      activeTokenDocument!._id.toString(),
    );
    const service = activeToken.service;
    expect(revokedToken).toBeDefined();
    expect(revokedToken!.service).toBe(service);
    expect(revokedToken!.status).toBe(TokenStatus.REVOKED);
  });
});
