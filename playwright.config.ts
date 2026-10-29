import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

/**
 * Locally this starts the Vite dev server; on CI it serves the production build
 * (run `npm run build` first). See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'github' : 'html',
  use: {
    baseURL: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Uncomment for cross-browser runs (`npx playwright install` first):
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: isCI ? 'npm run preview' : 'npm run dev',
    port: isCI ? 4173 : 5173,
    reuseExistingServer: !isCI,
  },
})
