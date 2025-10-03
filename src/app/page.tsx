import { getTokens } from '@/lib/services/token';
import { TokensTable } from './__components/TokensTable';

export default async function Home() {
  const tokens = await getTokens({});
  return <TokensTable initialTokens={tokens} />;
}
