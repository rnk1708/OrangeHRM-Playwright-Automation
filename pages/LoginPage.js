const CommanMethods = require('../utils/CommanMethods');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
        this.forgotPassword = page.getByText('Forgot your password?', { exact: true });
        this.invalidCredentialsMessage = page.getByText('Invalid credentials');
        this.requiredMessage = page.getByText('Required', { exact: true });
    }

    async navigate(url) {
        await CommanMethods.navigate(this.page, url);
        await CommanMethods.checkTextBoxEnabled(this.username, 20000);
    }

    async reload() {
        await CommanMethods.reload(this.page);
        await CommanMethods.checkTextBoxEnabled(this.username, 20000);
    }

    async enterUsername(username) {
        await CommanMethods.type(this.username, username);
    }

    async enterPassword(password) {
        await CommanMethods.type(this.password, password);
    }

    async fillCredentials(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
    }

    async clearCredentials() {
        await CommanMethods.clear(this.username);
        await CommanMethods.clear(this.password);
    }

    async login(username, password) {
        await this.fillCredentials(username, password);
        await this.clickLoginButton();
    }

    async clickLoginButton() {
        await CommanMethods.clickButton(this.loginButton);
    }

    async clickForgotPassword() {
        await CommanMethods.click(this.forgotPassword);
    }
}

module.exports = LoginPage;
