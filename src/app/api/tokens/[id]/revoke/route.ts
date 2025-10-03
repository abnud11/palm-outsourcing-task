import { revokeToken } from '@/lib/services/token';
import { NextRequest } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await revokeToken(id);
  return new Response(null, { status: 204 });
}
