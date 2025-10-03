import '@testing-library/jest-dom/vitest';

vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    }),
  ),
);
