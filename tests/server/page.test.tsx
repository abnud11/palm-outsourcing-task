import { Provider } from '@/app/__components/Provider';
import Home from '@/app/page';
import * as tokenServices from '@/lib/services/token';
import { render, screen } from '@testing-library/react';
describe('HomePage', () => {
  it('calls getTokens and renders table', async () => {
    const spy = vi.spyOn(tokenServices, 'getTokens');
    const page = await Home();
    render(<Provider>{page}</Provider>);
    expect(spy).toHaveBeenCalled();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
