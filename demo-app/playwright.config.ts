import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8000';

export default defineConfig({
    testDir: 'tests/e2e',
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    use: { baseURL, trace: 'retain-on-failure' },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: process.env.E2E_BASE_URL ? undefined : { command: 'php artisan serve --port=8000', url: baseURL, reuseExistingServer: true },
});
