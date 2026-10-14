const { expect } = require('@playwright/test');

class CommanMethods {
    static async checkButtonEnabled(locator, timeout = 10000) {
        await expect(locator).toBeVisible({ timeout });
        await expect(locator).toBeEnabled({ timeout });
    }

    static async checkTextBoxEnabled(locator, timeout = 10000) {
        await expect(locator).toBeVisible({ timeout });
        await expect(locator).toBeEnabled({ timeout });
    }

    static async clickButton(locator, timeout = 10000) {
        await CommanMethods.checkButtonEnabled(locator, timeout);
        await locator.click();
    }

    static async click(locator, timeout = 20000) {
        await expect(locator).toBeVisible({ timeout });
        await locator.click();
    }

    static async type(locator, value, timeout = 10000) {
        await CommanMethods.checkTextBoxEnabled(locator, timeout);
        await locator.fill(value === null || value === undefined ? '' : String(value));
    }

    static async clear(locator, timeout = 10000) {
        await CommanMethods.checkTextBoxEnabled(locator, timeout);
        await locator.fill('');
    }

    static async clearWithKeyboard(locator, timeout = 10000) {
        await CommanMethods.checkTextBoxEnabled(locator, timeout);
        await locator.click();
        await locator.press('Control+A');
        await locator.press('Backspace');
    }

    static async press(locator, key, timeout = 10000) {
        await CommanMethods.checkTextBoxEnabled(locator, timeout);
        await locator.press(key);
    }

    static async pressSequentially(locator, value, timeout = 10000) {
        await CommanMethods.checkTextBoxEnabled(locator, timeout);
        await locator.pressSequentially(value === null || value === undefined ? '' : String(value));
    }

    static async selectDropdown(locator, optionLocator, value) {
        await CommanMethods.click(locator);

        const escapedValue = String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const option = optionLocator.filter({ hasText: new RegExp(`^\\s*${escapedValue}\\s*$`) });

        await expect(option).toHaveCount(1, { timeout: 10000 });
        await CommanMethods.click(option);
    }

    static async getText(locator) {
        await expect(locator).toBeVisible();
        return (await locator.innerText()).trim();
    }

    static async navigate(page, url, options = {}) {
        await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded', ...options });
    }

    static async reload(page, options = {}) {
        await page.reload({ timeout: 60000, waitUntil: 'domcontentloaded', ...options });
    }

    static async setInputFiles(locator, filePath) {
        await expect(locator).toBeAttached();
        await locator.setInputFiles(filePath);
    }
}

module.exports = CommanMethods;
