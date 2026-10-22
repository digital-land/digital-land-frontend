import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    // builds package/digital-land-frontend once before the tests run, so they never test a stale build
    globalSetup: ['tests/integration/javascript/helpers/buildPackage.js'],
    // the integration tests run real copyfiles and sass commands
    testTimeout: 60000
  }
})
