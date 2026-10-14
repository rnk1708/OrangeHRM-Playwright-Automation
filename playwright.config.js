
 // @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Folder containing our actual test files.
    testDir: './tests',

    // Folder for screenshots, traces, videos, and other test artifacts.
    outputDir: './test-results',

    // Maximum duration allowed for one test.
    timeout: 60000,

    // Default timeout for auto-retrying Playwright assertions.
    expect: {
        timeout: 10000
    },

    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,

    // Generate Playwright HTML and Allure results.
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['allure-playwright', { resultsDir: 'allure-results' }]
    ],

    // Retain artifacts from failed tests only.
    preserveOutput: 'failures-only',

    use: {
        // Maximum wait for an individual action such as click or fill.
        actionTimeout: 15000,

        // Maximum wait for navigation operations.
        navigationTimeout: 45000,

        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox']
            }
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari']
            }
        }
    ]
});
