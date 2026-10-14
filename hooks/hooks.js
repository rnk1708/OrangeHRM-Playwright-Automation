const { expect } = require('@playwright/test');
const AppConstants = require('../constants/AppConstants');
const CommanMethods = require('../utils/CommanMethods');
const ScreenshotHelpers = require('../utils/ScreenshotHelper');

const addHooks = (test) => {
    test.beforeAll(async () => {
        console.log('||||||| OrangeHRM test execution started..... |||||||||');
    });

    test.beforeEach(async ({ page }) => {
        console.log('Opening Application ....');
        await CommanMethods.navigate(page, AppConstants.BASE_URL);
        await expect(page.getByPlaceholder('Username')).toBeVisible({ timeout: 20000 });
    });

    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Completed: ${testInfo.title} | status: ${testInfo.status}`);

        if (testInfo.status !== testInfo.expectedStatus) {
            try {
                const screenshotPath = await ScreenshotHelpers.capture(page, testInfo.title);
                await testInfo.attach('failure-screenshot', {
                    path: screenshotPath,
                    contentType: 'image/png'
                });
            } catch (error) {
                console.log(`Additional failure screenshot could not be captured: ${error.message}`);
            }
        }
    });

    test.afterAll(async () => {
        console.log('||||||| OrangeHRM test execution ended..... |||||||||');
    });
};

module.exports = addHooks;