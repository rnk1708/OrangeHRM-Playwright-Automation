const fs = require('fs');
const path = require('path');

class ScreenshotHelpers {
    static async capture(page, name) {
        const safeName = String(name)
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, '_')
            .slice(0, 150);
        const directory = path.resolve('test-results', 'custom-screenshots');
        const filePath = path.join(directory, `${safeName || 'failed-test'}.png`);

        fs.mkdirSync(directory, { recursive: true });
        await page.screenshot({ path: filePath, fullPage: true, timeout: 10000 });
        return filePath;
    }
}

module.exports = ScreenshotHelpers;
