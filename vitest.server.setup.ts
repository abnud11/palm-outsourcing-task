import '@testing-library/jest-dom/vitest';
import { inject } from 'vitest';
import { seed } from '@/lib/models/seed';
vi.stubEnv('MONGODB_URI', inject('MONGODB_URI'));
beforeAll(() => seed());
afterEach(() => seed());
