const { expect } = require('@playwright/test');

const CommanMethods = require('../utils/CommanMethods');
const AppConstants = require('../constants/AppConstants');

class AdminPage {

    constructor(page) {
        this.page = page;

        this.adminHeading = page.getByRole('heading', { name: 'System Users' });
        this.usernameSearch = page.locator('input.oxd-input').last();
        this.roleDropdown = page.locator('.oxd-select-text-input').nth(0);
        this.statusDropdown = page.locator('.oxd-select-text-input').nth(1);
        this.dropdownOptions = page.locator('.oxd-select-option');
        this.employeeName = page.locator('input[placeholder="Type for hints..."]');
        this.formEmployeeName = this.employeeName;
        this.employeeOptions = page.locator('.oxd-autocomplete-option:visible');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
        this.addButton = page.locator('button.oxd-button--secondary:visible').filter({ hasText: 'Add' }).first();
        this.userRows = page.locator('.oxd-table-body [role="row"]');
        this.formUsername = page.locator('input.oxd-input').nth(1);
        this.passwordFields = page.locator('input.oxd-input[type="password"]');
        this.addPassword = this.passwordFields.nth(0);
        this.addConfirmPassword = this.passwordFields.nth(1);
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
        this.validationMessages = page.locator('.oxd-input-group__message');
        this.formLoader = page.locator('.oxd-form-loader');
        this.deleteConfirmation = page.getByText('Are you Sure?', { exact: true });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete', exact: true });
    }

    async verifyUserManagementPage() {
        await expect(this.adminHeading).toBeVisible();
        await expect(this.searchButton).toBeVisible();
        await expect(this.resetButton).toBeVisible();
        await expect(this.addButton).toBeVisible();
        await expect(this.userRows.first()).toBeVisible();
    }

    async goToUserManagement() {
        await CommanMethods.navigate(this.page, AppConstants.ADMIN_USERS_URL);
        await expect(this.adminHeading).toBeVisible();
        await expect(this.searchButton).toBeVisible();
    }

    async searchByUsername(username) {
        await CommanMethods.type(this.usernameSearch, username);
        await CommanMethods.clickButton(this.searchButton);
        await expect(this.page.locator('.oxd-table')).toBeVisible();
    }

    async searchByRoleAndStatus(userRole, status) {
        await CommanMethods.selectDropdown(this.roleDropdown, this.dropdownOptions, userRole);
        await CommanMethods.selectDropdown(this.statusDropdown, this.dropdownOptions, status);
        await CommanMethods.clickButton(this.searchButton);
        await expect(this.page.locator('.oxd-table')).toBeVisible();
    }

    async resetSearch() {
        await CommanMethods.clickButton(this.resetButton);
        await expect(this.usernameSearch).toHaveValue('');
    }

    async verifySearchFieldsReset() {
        await expect(this.usernameSearch).toHaveValue('');
    }

    async clickAdd() {
        await expect(this.addButton).toBeVisible();
        await expect(this.addButton).toBeEnabled();
        await CommanMethods.clickButton(this.addButton);
        await expect(this.page.getByRole('heading', { name: 'Add User' })).toBeVisible();
    }

    async selectUserRole(userRole) {
        const formRoleDropdown = this.page.locator('.oxd-select-text-input').nth(0);
        await CommanMethods.selectDropdown(formRoleDropdown, this.dropdownOptions, userRole);
    }

    async selectFormRole(userRole) {
        await this.selectUserRole(userRole);
    }

    async selectEmployee(employeeSearch) {
        await CommanMethods.checkTextBoxEnabled(this.employeeName);

        const searchText = employeeSearch.trim().split(' ')[0];

        await CommanMethods.clear(this.employeeName);
        await CommanMethods.type(this.employeeName, searchText);

        const employeeOption = this.employeeOptions.filter({ hasText: searchText }).first();

        await expect(employeeOption).toBeVisible();

        await CommanMethods.click(employeeOption);
    }

    async selectFirstAvailableEmployee() {
        await CommanMethods.checkTextBoxEnabled(this.employeeName);

        const searchPrefixes = ['a', 'e', 'i', 'o', 'm', 's', 'r', 't', 'l'];

        for (const prefix of searchPrefixes) {
            await CommanMethods.clear(this.employeeName);
            await CommanMethods.type(this.employeeName, prefix);

            const availableOptions = this.employeeOptions
                .filter({ hasNotText: 'Searching...' })
                .filter({ hasNotText: 'No Records Found' });

            const firstOption = availableOptions.first();

            try {
                await firstOption.waitFor({ state: 'visible', timeout: 1800 });
            } catch {
                continue;
            }

            if (await firstOption.isVisible().catch(() => false)) {
                const selectedName = (await firstOption.innerText()).trim();
                await CommanMethods.click(firstOption);

                const normalizedSelectedName = selectedName.replace(/\s+/g, ' ').trim();

                await expect.poll(
                    async () => (await this.employeeName.inputValue()).replace(/\s+/g, ' ').trim(),
                    { timeout: 5000 }
                ).toBe(normalizedSelectedName);

                return selectedName;
            }
        }

        throw new Error('No employee autocomplete suggestions were returned for generic search prefixes. Check whether the shared OrangeHRM demo has employee records available.');
    }

    async enterEmployeeName(employeeName) {
        await CommanMethods.type(this.formEmployeeName, employeeName);
    }

    async selectStatus(status) {
        const formStatusDropdown = this.page.locator('.oxd-select-text-input').nth(1);
        await CommanMethods.selectDropdown(formStatusDropdown, this.dropdownOptions, status);
    }

    async selectFormStatus(status) {
        await this.selectStatus(status);
    }

    async enterUsername(username) {
        await CommanMethods.type(this.formUsername, username);
    }

    async blurUsernameField() {
        await CommanMethods.press(this.formUsername, 'Tab');
    }

    async enterPassword(password) {
        await CommanMethods.type(this.passwordFields.nth(0), password);
    }

    async enterConfirmPassword(confirmPassword) {
        await CommanMethods.type(this.passwordFields.nth(1), confirmPassword);
    }

    async fillUserForm(data, options = {}) {
        await this.selectUserRole(data.UserRole);

        if (options.useFirstAvailableEmployee) {
            await this.selectFirstAvailableEmployee();
        } else {
            const employeeValue = data.EmployeeSearch || data.EmployeeName;
            await this.selectEmployee(employeeValue);
        }

        await this.selectStatus(data.Status);
        await this.enterUsername(data.Username);
        await this.enterPassword(data.Password);
        await this.enterConfirmPassword(data.ConfirmPassword);
    }

    async createUser(data, options = {}) {
        await this.fillUserForm(data, options);
        await CommanMethods.clickButton(this.saveButton);
        await this.formLoader.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    async saveUser() {
        await CommanMethods.clickButton(this.saveButton);
        await this.formLoader.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    async getUserRowByUsername(username) {
        return this.userRows.filter({ has: this.page.getByText(username, { exact: true }) }).first();
    }

    async verifyUserRecordByUsername(username) {
        const row = await this.getUserRowByUsername(username);
        await expect(row).toBeVisible();
    }

    async verifyUserRecord(username, expectedRole, expectedStatus) {
        const row = await this.getUserRowByUsername(username);

        await expect(row).toBeVisible();

        const cells = row.locator('.oxd-table-cell');

        await expect(cells.nth(1)).toHaveText(username);
        await expect(cells.nth(2)).toHaveText(expectedRole);
        await expect(cells.nth(4)).toHaveText(expectedStatus);
    }

    async verifyUsersByRoleAndStatus(expectedRole, expectedStatus) {
        const rowCount = await this.userRows.count();

        expect(rowCount).toBeGreaterThan(0);

        for (let i = 0; i < rowCount; i++) {
            const row = this.userRows.nth(i);
            const cells = row.locator('.oxd-table-cell');

            await expect(cells.nth(2)).toHaveText(expectedRole);
            await expect(cells.nth(4)).toHaveText(expectedStatus);
        }
    }

    async verifyUserNotFound() {
        await expect(this.page.getByText('No Records Found', { exact: true })).toBeVisible();
    }

    async clickEditUser(username) {
        const row = await this.getUserRowByUsername(username);

        await expect(row).toBeVisible();

        await CommanMethods.click(row.getByRole('button').first());

        await expect(this.page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
    }

    async updateUserStatus(status) {
        const formStatusDropdown = this.page.locator('.oxd-select-text-input').nth(1);
        await CommanMethods.selectDropdown(formStatusDropdown, this.dropdownOptions, status);
    }

    async clickDeleteUser(username) {
        const row = await this.getUserRowByUsername(username);

        await expect(row).toBeVisible();

        await CommanMethods.click(row.getByRole('button').last());

        await expect(this.deleteConfirmation).toBeVisible();
    }

    async confirmDelete() {
        await CommanMethods.clickButton(this.confirmDeleteButton);
        await expect(this.deleteConfirmation).toBeHidden();
    }

    async deleteUserIfExists(username) {
        await this.goToUserManagement();
        await this.searchByUsername(username);

        const row = await this.getUserRowByUsername(username);

        if (await row.isVisible()) {
            await CommanMethods.click(row.getByRole('button').last());
            await expect(this.deleteConfirmation).toBeVisible();
            await CommanMethods.clickButton(this.confirmDeleteButton);
            await expect(this.deleteConfirmation).toBeHidden();
        }

        await this.goToUserManagement();
    }

    async verifyValidationMessage(message) {
        await expect(this.validationMessages.filter({ hasText: message }).first()).toBeVisible();
    }

    async verifyValidationMessageCount(message, expectedCount) {
        await expect(this.validationMessages.filter({ hasText: message })).toHaveCount(expectedCount);
    }

    async verifyRequiredMessage() {
        await this.verifyValidationMessage('Required');
    }

    async verifyInvalidMessage() {
        await this.verifyValidationMessage('Invalid');
    }

    async verifyUsernameLengthMessage() {
        await this.verifyValidationMessage('Should be at least 5 characters');
    }

    async verifyUsernameAlreadyExistsMessage() {
        await this.verifyValidationMessage('Already exists');
    }

    async verifyPasswordsDoNotMatchMessage() {
        await this.verifyValidationMessage('Passwords do not match');
    }
}

module.exports = AdminPage;