'use client';
import {
  type VisibleToken,
  VisibleTokenStatus,
} from '@/lib/services/token/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import { clsx } from 'clsx';
import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
interface TokensTableProps {
  initialTokens: VisibleToken[];
}

export function TokensTable({ initialTokens }: TokensTableProps) {
  const [search, setSearch] = useState('');
  const [expiredOnly, setExpiredOnly] = useState(false);
  const { data: tokens } = useQuery({
    queryKey: ['tokens', search, expiredOnly],
    queryFn: async () => {
      const response = await fetch(
        `/api/tokens?service=${search}&expired=${expiredOnly}`,
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as Promise<VisibleToken[]>;
    },
    // Only provide initialData for the very first key you have on the server
    initialData: () => {
      // Only seed when the key matches what the server rendered
      return search === '' && expiredOnly === false ? initialTokens : undefined;
    },
    placeholderData: (prev) => {
      // If prev exists and is non-empty, keep it; otherwise, return undefined to show empty
      if (prev && Array.isArray(prev) && prev.length > 0) return prev;
      return undefined;
    },
  });
  const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center mt-2">
        <label htmlFor="token-search">Search by Service Name:</label>
        <input
          id="token-search"
          type="search"
          value={search}
          onChange={handleSearchChange}
          className="border-2 border-gray-400 rounded-md p-1"
        />
        <label htmlFor="expired-only">Show Expired Only</label>
        <Switch.Root
          id="expired-only"
          checked={expiredOnly}
          className='w-16 h-6 bg-gray-300 rounded-full relative data-[state="checked"]:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          onCheckedChange={setExpiredOnly}
        >
          <Switch.Thumb className='w-4 h-4 block rounded-2xl bg-white shadow transition-transform translate-x-1 will-change-transform data-[state="checked"]:translate-x-11' />
        </Switch.Root>
      </div>
      <table className="w-[50%]">
        <thead className="text-center border-2 border-gray-400">
          <tr>
            <th className="border-r-2 border-gray-400">Service Name</th>
            <th className="border-r-2 border-gray-400">Token</th>
            <th className="border-r-2 border-gray-400">Expiry Date</th>
            <th className="border-r-2 border-gray-400">Status</th>
          </tr>
        </thead>
        <tbody className="border-2 border-gray-400 text-center">
          {tokens?.map((token) => (
            <tr
              key={token._id}
              className={clsx('border-b-2 border-gray-400', {
                'bg-red-200':
                  token.status === VisibleTokenStatus.EXPIRED ||
                  token.status === VisibleTokenStatus.REVOKED,
                'bg-green-200': token.status === VisibleTokenStatus.ACTIVE,
              })}
            >
              <td className="border-r-2 border-gray-400">{token.service}</td>
              <td className="border-r-2 border-gray-400">{token.token}</td>
              <td className="border-r-2 border-gray-400">
                {dayjs(token.expiryDate).utc().format('YYYY-MM-DD hh:mm:ss')}{' '}
                UTC
              </td>
              <td className="border-r-2 border-gray-400">{token.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
