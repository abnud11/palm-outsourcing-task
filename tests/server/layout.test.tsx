import RootLayout from '@/app/layout';
import { useQueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
function TestComponent() {
  const queryClient = useQueryClient();
  console.log(queryClient);
  return <div>Test Component</div>;
}

describe('Layout Component', () => {
  it('should render Provider which contains QueryClientProvider', () => {
    try {
      render(
        <RootLayout>
          <TestComponent />
        </RootLayout>,
      );
    } catch {
      expect.fail('Failed to render TestComponent');
    }
  });
});
