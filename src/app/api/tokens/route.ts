import { getTokens } from '@/lib/services/token';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const queryParams = new URL(request.url).searchParams;

  const tokens = await getTokens({
    service: queryParams.get('service') ?? undefined,
    expired: queryParams.get('expired') === 'true',
  });
  return NextResponse.json(tokens);
}
