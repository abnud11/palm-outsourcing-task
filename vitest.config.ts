import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [tsconfigPaths(), react()],
        test: {
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./vitest.client.setup.ts'],
          include: ['tests/client/**/*.test.tsx', 'tests/client/**/*.test.ts'],
        },
      },
      {
        plugins: [react(), tsconfigPaths()],
        test: {
          globals: true,
          environment: 'jsdom',
          include: ['tests/server/**/*.test.ts', 'tests/server/**/*.test.tsx'],
          globalSetup: ['vitest.server.global-setup.ts'],
          setupFiles: ['./vitest.server.setup.ts'],
          poolOptions: {
            forks: {
              singleFork: true,
            },
          },
        },
      },
    ],
    coverage: {
      enabled: true,
      exclude: [...coverageConfigDefaults.exclude, '*.ts', '*.mjs'],
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
