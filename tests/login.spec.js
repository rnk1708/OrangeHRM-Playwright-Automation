
const { test, expect } = require('../fixtures/baseFixture');

const AppConstants = require('../constants/AppConstants');


// ============================================================
// SMOKE TESTS
// ============================================================

test.describe('SmokeTests', () => {

    // L01
    test('L01 - Verify Login Page Availability', async ({ page }) => {

        await expect(page).toHaveURL(AppConstants.BASE_URL);
        await expect(page).toHaveTitle('OrangeHRM');

    });

    // L02
    test('L02 - Verify Login Page Controls and Password Masking', async ({ loginPage }) => {

        await expect(loginPage.username).toBeVisible();
        await expect(loginPage.password).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPassword).toBeVisible();

        await expect(loginPage.password).toHaveAttribute('type', 'password');

    });

    // L03
    test('L03 - Verify Login with Valid Credentials', async ({ loginPage, dashboardPage, loginData }) => {

        await loginPage.login(
            loginData.validUser.username,
            loginData.validUser.password
        );

        await expect(loginPage.page).toHaveURL(/dashboard/);
        await expect(dashboardPage.dashboardHeading).toBeVisible();

    });

    // L04
    test('L04 - Verify Forgot Password Navigation', async ({ loginPage, resetPasswordPage }) => {

        await loginPage.clickForgotPassword();

        await expect(loginPage.page).toHaveURL(/requestPasswordResetCode/);
        await expect(resetPasswordPage.resetPasswordHeading).toBeVisible();

    });

});

// ============================================================
// REGRESSION TESTS
// ============================================================

test.describe('RegressionTests', () => {

    // L05
    test('L05 - Verify Login Form Validation', async ({ loginPage, loginData }) => {

        // Scenario 1: Submit with both fields empty
        await loginPage.clickLoginButton();

        await expect(loginPage.requiredMessage).toHaveCount(2);

        // Scenario 2: Username contains leading and trailing spaces
        await loginPage.enterUsername(loginData.whitespaceUser.username);
        await loginPage.enterPassword(loginData.whitespaceUser.password);
        await loginPage.clickLoginButton();

        await expect(loginPage.invalidCredentialsMessage).toBeVisible();
        await expect(loginPage.page).toHaveURL(/auth\/login/);

        // Scenario 3: Password field accepts special characters
        await loginPage.enterUsername(loginData.validUser.username);
        await loginPage.enterPassword(loginData.specialCharacterPassword);

        await expect(loginPage.password).toHaveValue(
            loginData.specialCharacterPassword
        );

        await loginPage.clickLoginButton();

        await expect(loginPage.invalidCredentialsMessage).toBeVisible();
        await expect(loginPage.page).toHaveURL(/auth\/login/);

    });


test('L06 - Verify Invalid Credentials and Username Case Handling', async ({ loginPage, loginData }) => {

    // Scenario 1: Invalid username and password must be rejected.
    await loginPage.login(
        loginData.invalidUser.username,
        loginData.invalidUser.password
    );

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
    await expect(loginPage.page).toHaveURL(/auth\/login/);

    // Scenario 2: Reload the login page to clear previous validation messages.
    await loginPage.navigate(AppConstants.BASE_URL);
    await expect(loginPage.username).toBeVisible();

    // Check whether the application accepts a lowercase username.
    await loginPage.login(
        loginData.caseSensitiveUsername,
        loginData.validUser.password
    );

    // The previous test output showed that lowercase "admin" reaches the dashboard.
    await expect(loginPage.page).toHaveURL(/\/dashboard\/index/);
});


    // L07
    test('L07 - Verify Login Form State After Navigation and Browser Refresh', async ({ loginPage, loginData }) => {

        // Scenario 1: Navigate away from the login form and return
        await loginPage.enterUsername(loginData.validUser.username);
        await loginPage.enterPassword(loginData.validUser.password);

        await loginPage.navigate(AppConstants.BASE_URL);

        await expect(loginPage.page).toHaveURL(AppConstants.BASE_URL);
        await expect(loginPage.username).toHaveValue('');
        await expect(loginPage.password).toHaveValue('');

        // Scenario 2: Enter values and refresh the page
        await loginPage.enterUsername(loginData.validUser.username);
        await loginPage.enterPassword(loginData.validUser.password);

        await loginPage.reload();

        await expect(loginPage.page).toHaveURL(AppConstants.BASE_URL);
        await expect(loginPage.username).toHaveValue('');
        await expect(loginPage.password).toHaveValue('');

    });

});

// ============================================================
// SECURITY & ROBUSTNESS TESTS
// ============================================================

test.describe('SecurityTests', () => {

    // L08
    test('L08 - Verify SQL Injection Does Not Bypass Authentication', async ({ loginPage, loginData }) => {

        await loginPage.login(
            loginData.sqlInjection,
            loginData.sqlInjection
        );

        await expect(loginPage.invalidCredentialsMessage).toBeVisible();
        await expect(loginPage.page).toHaveURL(/auth\/login/);

        await expect(loginPage.page).not.toHaveURL(/dashboard/);

    });

    // L09
    test('L09 - Verify Username and Password Boundary Length Validation', async ({ loginPage, loginData }) => {

        const longUsername = 'A'.repeat(loginData.boundaryLength);
        const longPassword = 'A'.repeat(loginData.boundaryLength);

        // Confirm the fields accept the test values
        await loginPage.enterUsername(longUsername);
        await loginPage.enterPassword(longPassword);

        await expect(loginPage.username).toHaveValue(longUsername);
        await expect(loginPage.password).toHaveValue(longPassword);

        // Submit the long values and confirm authentication is rejected
        await loginPage.clickLoginButton();

        await expect(loginPage.invalidCredentialsMessage).toBeVisible();
        await expect(loginPage.page).toHaveURL(/auth\/login/);

    });

    // L10
    test('L10 - Verify Credentials Are Not Exposed in URL', async ({ loginPage, loginData }) => {

        await loginPage.login(
            loginData.validUser.username,
            loginData.validUser.password
        );

        await expect(loginPage.page).toHaveURL(/dashboard/);

        const currentURL = loginPage.page.url();

        // Credentials must not appear in the URL
        expect(currentURL).not.toContain(loginData.validUser.username);
        expect(currentURL).not.toContain(loginData.validUser.password);

    });

});
