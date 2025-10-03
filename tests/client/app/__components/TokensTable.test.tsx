import { Provider } from '@/app/__components/Provider';
import { TokensTable } from '@/app/__components/TokensTable';
import { visibleDummyTokensWithId } from '@/lib/models/seed';
import { render, screen, within } from '@testing-library/react';
import dayjs from '@/lib/dayjs';
import { VisibleTokenStatus } from '@/lib/services/token/types';
import userEvent from '@testing-library/user-event';
import { Mock } from 'vitest';
describe('TokensTable', () => {
  beforeAll(() => {
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(visibleDummyTokensWithId),
    });
  });
  it('renders a table with correct columns, along with filters', () => {
    render(
      <Provider>
        <TokensTable initialTokens={[]} />
      </Provider>,
    );
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const headers = [
      'Service Name',
      'Token',
      'Expiry Date',
      'Status',
      'Actions',
    ];
    for (const header of headers) {
      const headerElement = within(table).getByText(header);
      expect(headerElement).toBeInTheDocument();
      expect(headerElement.tagName).toBe('TH');
    }
    const searchInput = screen.getByRole('searchbox', { name: /service/i });
    expect(searchInput).toBeInTheDocument();

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('renders initial tokens in the table', () => {
    render(
      <Provider>
        <TokensTable initialTokens={visibleDummyTokensWithId} />
      </Provider>,
    );
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(visibleDummyTokensWithId.length + 1);
    for (const token of visibleDummyTokensWithId) {
      const serviceName = screen.getByText(token.service);
      expect(serviceName).toBeInTheDocument();
      const tokenValue = screen.getByText(token.token);
      expect(tokenValue).toBeInTheDocument();
      const expiryDate = screen.getByText(
        dayjs(token.expiryDate).utc().format('YYYY-MM-DD hh:mm:ss') + ' UTC',
      );
      expect(expiryDate).toBeInTheDocument();
      const status = screen.getByText(token.status);
      expect(status).toBeInTheDocument();
      const actionButton = screen.getByTestId(token._id);
      expect(actionButton).toBeInTheDocument();
      if (token.status === VisibleTokenStatus.ACTIVE) {
        expect(actionButton).toHaveTextContent('Revoke');
        expect(actionButton).toHaveClass('bg-red-500');
      } else {
        expect(actionButton).toHaveTextContent('Renew');
        expect(actionButton).toHaveClass('bg-blue-500');
      }
    }
  });

  it('filters tokens based on search input', async () => {
    render(
      <Provider>
        <TokensTable initialTokens={visibleDummyTokensWithId} />
      </Provider>,
    );
    const searchInput = screen.getByRole('searchbox', { name: /service/i });
    await userEvent.type(searchInput, 'GitHub');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/tokens?service=GitHub&expired=false',
    );
  });

  it('filters expired on toggle', async () => {
    render(
      <Provider>
        <TokensTable initialTokens={visibleDummyTokensWithId} />
      </Provider>,
    );

    const toggle = screen.getByRole('switch');
    await userEvent.click(toggle);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/tokens?service=&expired=true',
    );
  });

  it('renews and revokes tokens', async () => {
    render(
      <Provider>
        <TokensTable initialTokens={visibleDummyTokensWithId} />
      </Provider>,
    );

    const activeToken = visibleDummyTokensWithId.find(
      (t) => t.status === VisibleTokenStatus.ACTIVE,
    )!;
    const revokedToken = visibleDummyTokensWithId.find(
      (t) => t.status === VisibleTokenStatus.REVOKED,
    )!;

    const expiredToken = visibleDummyTokensWithId.find((t) =>
      dayjs(t.expiryDate).isBefore(dayjs()),
    )!;

    const revokeButton = screen.getByTestId(activeToken._id);
    await userEvent.click(revokeButton);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `/api/tokens/${activeToken._id}/revoke`,
      { method: 'POST' },
    );

    const renewButton = screen.getByTestId(revokedToken._id);
    await userEvent.click(renewButton);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `/api/tokens/${revokedToken._id}/renew`,
      { method: 'POST' },
    );

    const expiredTokenRenewButton = screen.getByTestId(expiredToken._id);
    await userEvent.click(expiredTokenRenewButton);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `/api/tokens/${expiredToken._id}/renew`,
      { method: 'POST' },
    );
  });
});
