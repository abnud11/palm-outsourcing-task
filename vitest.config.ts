import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    projects: [
      {
        test: {
          environment: 'jsdom',
          setupFiles: ['./vitest-setup.mts'],
          include: ['tests/**/*.test.tsx', 'tests/**/*.client.test.ts'],
        },
      },
      {
        test: {
          environment: 'node',
          include: ['tests/**/*.server.test.ts'],
        },
      },
    ],
    coverage: {
      enabled: true,
      exclude: ['*.ts', '*.mjs'],
      thresholds: {
        perFile: true,
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
