const { expect } = require('@playwright/test');
const CommanMethods = require('../utils/CommanMethods');

class MyInfoPage {
    constructor(page) {
        this.page = page;

        // My Info navigation
        this.myInfoMenu = page.getByRole('link', { name: 'My Info', exact: true });
        this.personalDetailsTab = page.getByText('Personal Details', { exact: true }).first();
        this.contactDetailsTab = page.getByText('Contact Details', { exact: true }).first();
        this.emergencyContactsTab = page.getByText('Emergency Contacts', { exact: true }).first();
        this.dependentsTab = page.getByText('Dependents', { exact: true }).first();
        this.immigrationTab = page.getByText('Immigration', { exact: true }).first();
        this.jobTab = page.getByText('Job', { exact: true }).first();
        this.salaryTab = page.getByText('Salary', { exact: true }).first();
        this.reportToTab = page.getByText('Report-to', { exact: true }).first();
        this.qualificationsTab = page.getByText('Qualifications', { exact: true }).first();
        this.membershipsTab = page.getByText('Memberships', { exact: true }).first();

        // Section headings
        this.personalDetailsHeading = page.getByText('Personal Details', { exact: true }).last();
        this.contactDetailsHeading = page.getByText('Contact Details', { exact: true }).last();
        this.emergencyContactsHeading = page.getByText('Assigned Emergency Contacts', { exact: true });
        this.dependentsHeading = page.getByText('Assigned Dependents', { exact: true });
        this.immigrationHeading = page.getByText('Assigned Immigration Records', { exact: true });
        this.emergencyContactAddHeading = page.getByRole('heading', { name: 'Save Emergency Contact', exact: true });
        this.employeeFullNameLabel = page.getByText('Employee Full Name', { exact: true });
        this.passwordFields = page.locator('input[type="password"]');

        // Main records table; Attachments has a separate table
        this.sectionTable = page.locator('.orangehrm-container .oxd-table').first();

        // Add forms are rendered inline, not inside a modal
        this.addForm = page.locator('.orangehrm-edit-employee-content form.oxd-form').first();
        this.dependentAddHeading = page.getByRole('heading', { name: 'Add Dependent', exact: true });
        this.immigrationAddHeading = page.getByRole('heading', { name: 'Add Immigration', exact: true });

        // Common form elements
        this.saveButtons = page.getByRole('button', { name: 'Save', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
        this.requiredMessages = page.locator('.oxd-input-field-error-message');
        this.inputGroups = page.locator('.oxd-input-group');
        this.formInputs = page.locator('.oxd-form input');
        this.dropdownControls = page.locator('.oxd-select-text');
        this.radioInputs = page.locator('input[type="radio"]');
        this.dateInputs = page.locator('input[placeholder*="yyyy"], input[placeholder*="yyyy-mm-dd"]');
        this.toastMessages = page.locator('.oxd-toast');
    }

    async openMyInfo() {
        await expect(this.myInfoMenu).toBeVisible();
        await CommanMethods.click(this.myInfoMenu);
        await expect(this.personalDetailsHeading).toBeVisible();
    }

    async openSection(sectionName) {
        const sectionMap = {
            'Personal Details': this.personalDetailsTab,
            'Contact Details': this.contactDetailsTab,
            'Emergency Contacts': this.emergencyContactsTab,
            'Dependents': this.dependentsTab,
            'Immigration': this.immigrationTab,
            'Job': this.jobTab,
            'Salary': this.salaryTab,
            'Report-to': this.reportToTab,
            'Qualifications': this.qualificationsTab,
            'Memberships': this.membershipsTab
        };

        const section = sectionMap[sectionName];

        if (!section) {
            throw new Error(`Unknown My Info section: ${sectionName}`);
        }

        await CommanMethods.click(section);
    }

    async verifyPersonalDetailsControls() {
        await expect(this.personalDetailsHeading).toBeVisible();
        await expect(this.saveButtons.first()).toBeVisible();
        await expect(this.dropdownControls.first()).toBeVisible();
        await expect(this.radioInputs.first()).toBeAttached();
    }

    getSectionHeading(headingText) {
        return this.page.getByText(headingText, { exact: true }).last();
    }

    getFieldGroup(labelText) {
        return this.inputGroups.filter({ hasText: labelText }).first();
    }

    getFieldInput(labelText) {
        return this.getFieldGroup(labelText).locator('input').first();
    }

    getFieldErrorByLabel(labelText) {
        return this.getFieldGroup(labelText).locator('.oxd-input-field-error-message');
    }

    getPersonalNameInput(fieldName) {
        if (!['firstName', 'middleName', 'lastName'].includes(fieldName)) {
            throw new Error(`Unsupported Personal Details field: ${fieldName}`);
        }

        return this.page.locator(`input[name="${fieldName}"]`);
    }

    getPersonalNameGroup(fieldName) {
        return this.inputGroups.filter({ has: this.getPersonalNameInput(fieldName) }).last();
    }

    getPersonalNameError(fieldName) {
        return this.getPersonalNameGroup(fieldName).locator('.oxd-input-field-error-message');
    }

    async getPersonalNameValue(fieldName) {
        return await this.getPersonalNameInput(fieldName).inputValue();
    }

    async fillPersonalNameField(fieldName, value) {
        await CommanMethods.type(this.getPersonalNameInput(fieldName), value);
    }

    async clearPersonalNameField(fieldName) {
        await CommanMethods.clearWithKeyboard(this.getPersonalNameInput(fieldName));
    }

    async blurPersonalNameField(fieldName) {
        await CommanMethods.press(this.getPersonalNameInput(fieldName), 'Tab');
    }

    async fillFieldByLabel(labelText, value) {
        await CommanMethods.type(this.getFieldInput(labelText), value);
    }

    async getFieldValueByLabel(labelText) {
        return await this.getFieldInput(labelText).inputValue();
    }

    async fillWorkEmail(value) {
        await this.fillFieldByLabel('Work Email', value);
    }

    async updateFirstNameWithoutSaving(value) {
        await this.fillPersonalNameField('firstName', value);
    }

    async reloadCurrentPage() {
        await CommanMethods.reload(this.page);
    }

    async clickSectionAdd(sectionHeadingText) {
        const sectionHeading = this.page.getByRole('heading', { name: sectionHeadingText, exact: true });
        await expect(sectionHeading).toBeVisible();

        // The section heading and its Add button share this header.
        const sectionHeader = this.page.locator('.orangehrm-action-header').filter({ has: sectionHeading });
        await expect(sectionHeader).toHaveCount(1);

        // Use the button class because its accessible name includes an icon.
        const addButton = sectionHeader.locator('button.oxd-button--text');
        await expect(addButton).toBeVisible();
        await expect(addButton).toBeEnabled();
        await CommanMethods.clickButton(addButton);

        // OrangeHRM replaces the table content with an inline form.
        await expect(this.addForm).toBeVisible();
    }

    async cancelAddForm() {
        await CommanMethods.clickButton(this.addForm.getByRole('button', { name: 'Cancel', exact: true }));
        await expect(this.addForm).toBeHidden();
    }

    async clickSave() {
        await CommanMethods.clickButton(this.saveButtons.first());
    }

    async reloadAndVerifyPersonalDetails() {
        await CommanMethods.reload(this.page);
        await expect(this.personalDetailsHeading).toBeVisible();
    }

    async verifySectionsAvailable() {
        const sections = [
            this.personalDetailsTab,
            this.contactDetailsTab,
            this.emergencyContactsTab,
            this.dependentsTab,
            this.immigrationTab,
            this.jobTab,
            this.salaryTab,
            this.reportToTab,
            this.qualificationsTab,
            this.membershipsTab
        ];

        for (const section of sections) {
            await expect(section).toBeVisible();
        }
    }
}

module.exports = MyInfoPage;