import { GET } from '@/app/api/tokens/route';
import dayjs from '@/lib/dayjs';
import { visibleDummyTokens } from '@/lib/models/seed';
import { VisibleToken } from '@/lib/services/token/types';
import { NextRequest } from 'next/server';
const visibleDummyTokensWithStringExpiryDate = visibleDummyTokens.map((t) => ({
  ...t,
  expiryDate: dayjs(t.expiryDate).toISOString(),
}));
describe('GET /api/tokens', () => {
  it('should return all tokens', async () => {
    const request = new NextRequest('http://localhost/api/tokens');
    const response = await GET(request);
    const tokens = (await response.json()) as VisibleToken[];
    expect(tokens).toHaveLength(3);
    expect(tokens).toMatchObject(visibleDummyTokensWithStringExpiryDate);
  });
  it('should filter tokens by service', async () => {
    const request = new NextRequest(
      'http://localhost/api/tokens?service=GitHub',
    );
    const response = await GET(request);
    const tokens = (await response.json()) as VisibleToken[];
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject(
      visibleDummyTokensWithStringExpiryDate.find(
        (t) => t.service === 'GitHub',
      )!,
    );
  });

  it('should filter tokens by service with a regex not exact match', async () => {
    const request = new NextRequest('http://localhost/api/tokens?service=bI');
    const response = await GET(request);
    const tokens = (await response.json()) as VisibleToken[];
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject(
      visibleDummyTokensWithStringExpiryDate.find(
        (t) => t.service === 'Bitbucket',
      )!,
    );
  });

  it('should return an empty array if no tokens match the filter', async () => {
    const request = new NextRequest(
      'http://localhost/api/tokens?service=NonExistentService',
    );
    const response = await GET(request);
    const tokens = (await response.json()) as VisibleToken[];
    expect(tokens).toHaveLength(0);
  });

  it('should return expired tokens', async () => {
    const request = new NextRequest('http://localhost/api/tokens?expired=true');
    const response = await GET(request);
    const tokens = (await response.json()) as VisibleToken[];
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject(
      visibleDummyTokensWithStringExpiryDate.find((t) =>
        dayjs(t.expiryDate).isBefore(dayjs()),
      )!,
    );
  });
});
