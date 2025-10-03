import { setup, teardown } from 'vitest-mongodb';
import type { TestProject } from 'vitest/node';

declare global {
  var __MONGO_URI__: string;
}

declare module 'vitest' {
  export interface ProvidedContext {
    MONGODB_URI: string;
  }
}
let teardownHappened = false;
export default async function globalSetup(project: TestProject) {
  await setup({
    type: 'replSet',
    serverOptions: { replSet: { count: 1 } },
  });
  project.provide('MONGODB_URI', globalThis.__MONGO_URI__);

  return async () => {
    if (teardownHappened) {
      throw new Error('teardown called twice');
    }
    teardownHappened = true;
    await teardown();
  };
}
