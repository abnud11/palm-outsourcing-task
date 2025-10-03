import { getTokens } from '@/lib/services/token';
import { TokensTable } from './__components/TokensTable';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tokens = await getTokens(params);
  return <TokensTable initialTokens={tokens} />;
}
