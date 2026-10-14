const { expect } = require('@playwright/test');

const CommanMethods = require('../utils/CommanMethods');
const AppConstants = require('../constants/AppConstants');

class RecruitmentPage {
    constructor(page) {
        this.page = page;

        this.candidatesHeading = page.getByRole('heading', { name: 'Candidates' });
        this.candidatesTab = page.getByText('Candidates', { exact: true }).first();
        this.vacanciesTab = page.getByText('Vacancies', { exact: true }).first();

        this.searchDropdowns = page.locator('.oxd-select-text');
        this.jobTitleDropdown = this.searchDropdowns.nth(0);
        this.vacancySearchDropdown = this.searchDropdowns.nth(1);
        this.hiringManagerDropdown = this.searchDropdowns.nth(2);
        this.statusDropdown = this.searchDropdowns.nth(3);
        this.methodDropdown = this.searchDropdowns.nth(4);
        this.dropdownOptions = page.locator('.oxd-select-option');

        this.candidateSearch = page.locator('input[placeholder="Type for hints..."]').first();
        this.searchKeywords = page.locator('input[placeholder="Enter comma seperated words..."]').first();
        this.fromDate = page.locator('input[placeholder="From"]');
        this.toDate = page.locator('input[placeholder="To"]');

        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
        this.addButton = page.locator('button.oxd-button--secondary:visible').filter({ hasText: 'Add' }).first();

        this.candidateRows = page.locator('.oxd-table-body [role="row"]');

        this.firstName = page.locator('input[placeholder="First Name"]');
        this.middleName = page.locator('input[placeholder="Middle Name"]');
        this.lastName = page.locator('input[placeholder="Last Name"]');

        this.formDropdowns = page.locator('.oxd-select-text-input');
        this.formVacancyDropdown = this.formDropdowns.nth(0);
        this.formVacancyDisplay = page.locator('.oxd-select-text').first();

        this.formTypeHereInputs = page.locator('input[placeholder="Type here"]');
        this.formEmail = this.formTypeHereInputs.nth(0);
        this.formContactNumber = this.formTypeHereInputs.nth(1);
        this.contactValidationMessage = this.formContactNumber.locator('xpath=../following-sibling::span[contains(@class,"oxd-input-group__message")]');

        this.resumeInput = page.locator('input[type="file"]');
        this.formKeywords = page.locator('input[placeholder="Enter comma seperated words..."]');
        this.applicationDate = page.locator('.oxd-input-group')
            .filter({ hasText: 'Date of Application' })
            .locator('input')
            .first();

        this.notes = page.locator('textarea[placeholder="Type here"]');

        this.consentCheckbox = page.locator('.oxd-checkbox-wrapper input[type="checkbox"]').last();
        this.consentControl = page.locator('.oxd-checkbox-wrapper .oxd-checkbox-input').last();

        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });

        this.validationMessages = page.locator('span.oxd-input-field-error-message');
        this.employeeOptions = page.locator('.oxd-autocomplete-option:visible');
        this.todayButton = page.getByText('Today', { exact: true });
        this.applicationStageHeading = page.getByText('Application Stage', { exact: true });
    }

    async verifyCandidatesPage() {
        await expect(this.candidatesHeading).toBeVisible();
        await expect(this.candidatesTab).toBeVisible();
        await expect(this.vacanciesTab).toBeVisible();
        await expect(this.searchButton).toBeVisible();
        await expect(this.resetButton).toBeVisible();
        await expect(this.addButton).toBeVisible();
        await expect(this.page.locator('.oxd-table')).toBeVisible();
    }

    async goToCandidates() {
        await CommanMethods.navigate(this.page, AppConstants.RECRUITMENT_CANDIDATES_URL);
        await expect(this.candidatesHeading).toBeVisible();
        await expect(this.searchButton).toBeVisible();
    }

    async selectSearchJobTitle(value) {
        await CommanMethods.selectDropdown(this.jobTitleDropdown, this.dropdownOptions, value);
    }

    async selectSearchVacancy(value) {
        await CommanMethods.selectDropdown(this.vacancySearchDropdown, this.dropdownOptions, value);
    }

    async selectSearchHiringManager(value) {
        await CommanMethods.selectDropdown(this.hiringManagerDropdown, this.dropdownOptions, value);
    }

    async selectSearchStatus(value) {
        await CommanMethods.selectDropdown(this.statusDropdown, this.dropdownOptions, value);
    }

    async selectMethodOfApplication(value) {
        await CommanMethods.selectDropdown(this.methodDropdown, this.dropdownOptions, value);
    }

    async fillSearchKeywords(value) {
        await CommanMethods.type(this.searchKeywords, value);
    }

    async verifySearchKeywords(value) {
        await expect(this.searchKeywords).toHaveValue(value);
    }

    async selectCandidateSuggestion(searchText) {
        await CommanMethods.checkTextBoxEnabled(this.candidateSearch);
        await CommanMethods.clear(this.candidateSearch);
        await CommanMethods.type(this.candidateSearch, searchText);

        const candidateOption = this.employeeOptions
            .filter({ hasText: searchText })
            .filter({ hasNotText: 'Searching....' })
            .first();

        await expect(candidateOption).toBeVisible();

        const selectedCandidate = (await candidateOption.innerText()).trim();
        await CommanMethods.click(candidateOption);
        await expect(this.candidateSearch).toHaveValue(selectedCandidate, { timeout: 5000 });

        return selectedCandidate;
    }

    async searchByCandidateName(searchText) {
        return await this.selectCandidateSuggestion(searchText);
    }

    async searchCandidates() {
        await CommanMethods.clickButton(this.searchButton);
        await expect(this.page.locator('.oxd-table')).toBeVisible();
    }

    async resetSearch() {
        await CommanMethods.clickButton(this.resetButton);
    }

    async verifySearchFieldsReset() {
        await expect(this.candidateSearch).toHaveValue('');
        await expect(this.searchKeywords).toHaveValue('');
        await expect(this.fromDate).toHaveValue('');
        await expect(this.toDate).toHaveValue('');
        await expect(this.statusDropdown).toHaveText('-- Select --');
        await expect(this.methodDropdown).toHaveText('-- Select --');
    }

    async verifySearchStatusSelected(status) {
        await expect(this.statusDropdown).toHaveText(status);
    }

    async clickAdd() {
        await expect(this.addButton).toBeVisible();
        await expect(this.addButton).toBeEnabled();
        await CommanMethods.clickButton(this.addButton);
        await expect(this.page.getByRole('heading', { name: 'Add Candidate' })).toBeVisible();
    }

    async fillFirstName(value) {
        await CommanMethods.type(this.firstName, value);
    }

    async fillMiddleName(value) {
        await CommanMethods.type(this.middleName, value);
    }

    async fillLastName(value) {
        await CommanMethods.type(this.lastName, value);
    }

    async selectFormVacancy(value) {
        await CommanMethods.selectDropdown(this.formVacancyDropdown, this.dropdownOptions, value);
    }

    async fillEmail(value) {
        await CommanMethods.type(this.formEmail, value);
    }

    async fillContactNumber(value) {
        await CommanMethods.checkTextBoxEnabled(this.formContactNumber);
        await CommanMethods.click(this.formContactNumber);
        await CommanMethods.pressSequentially(this.formContactNumber, value);
        await CommanMethods.press(this.formContactNumber, 'Tab');
    }

    async fillInvalidContactNumber(value) {
        await CommanMethods.checkTextBoxEnabled(this.formContactNumber);
        await CommanMethods.click(this.formContactNumber);

        const contactNumber = String(value);
        await CommanMethods.press(this.formContactNumber, contactNumber.charAt(0));
        await expect(this.formContactNumber).toHaveClass(/oxd-input--error/, { timeout: 5000 });

        if (contactNumber.length > 1) {
            await CommanMethods.pressSequentially(this.formContactNumber, contactNumber.slice(1));
        }

        await CommanMethods.press(this.formContactNumber, 'Tab');
    }

    async uploadResume(filePath) {
        await CommanMethods.setInputFiles(this.resumeInput, filePath);
        const fileName = filePath.split(/[\\/]/).pop();
        await expect(this.page.getByText(fileName, { exact: true })).toBeVisible();
    }

    async fillKeywords(value) {
        await CommanMethods.type(this.formKeywords, value);
    }

    async selectTodayDate() {
        await CommanMethods.click(this.applicationDate);
        await expect(this.todayButton).toBeVisible({ timeout: 5000 });
        await CommanMethods.click(this.todayButton);
        await expect(this.applicationDate).not.toHaveValue('', { timeout: 5000 });
    }

    async fillNotes(value) {
        await CommanMethods.type(this.notes, value);
    }

    async checkConsent() {
        await expect(this.consentControl).toBeVisible({ timeout: 5000 });

        if (!(await this.consentCheckbox.isChecked())) {
            await CommanMethods.click(this.consentControl);
        }

        await expect(this.consentCheckbox).toBeChecked();
    }

    async fillCandidateForm(data) {
        await this.fillFirstName(data.FirstName);
        await this.fillMiddleName(data.MiddleName);
        await this.fillLastName(data.LastName);

        if (data.Vacancy) await this.selectFormVacancy(data.Vacancy);
        await this.fillEmail(data.Email);

        if (data.ContactNumber) await this.fillContactNumber(data.ContactNumber);
        if (data.ResumePath) await this.uploadResume(data.ResumePath);
        if (data.Keywords) await this.fillKeywords(data.Keywords);
        if (data.ApplicationDate) await this.selectTodayDate();
        if (data.Notes) await this.fillNotes(data.Notes);

        if (String(data.Consent).toLowerCase() === 'true') {
            await this.checkConsent();
        }
    }

    async verifyFormData(data) {
        await expect(this.firstName).toHaveValue(data.FirstName);
        await expect(this.middleName).toHaveValue(data.MiddleName);
        await expect(this.lastName).toHaveValue(data.LastName);
        await expect(this.formVacancyDisplay).toHaveText(data.Vacancy);
        await expect(this.formEmail).toHaveValue(data.Email);
        await expect(this.formContactNumber).toHaveValue(data.ContactNumber);
        await expect(this.formKeywords).toHaveValue(data.Keywords);
        await expect(this.applicationDate).not.toHaveValue('');
        await expect(this.notes).toHaveValue(data.Notes);
        await expect(this.consentCheckbox).toBeChecked();
    }

    async submitCandidateForm() {
        await CommanMethods.clickButton(this.saveButton);
    }

    async saveCandidate() {
        await this.submitCandidateForm();
        await expect(this.applicationStageHeading).toBeVisible();
    }

    async createCandidate(data) {
        await this.fillCandidateForm(data);
        await this.saveCandidate();
    }

    async verifyRequiredValidationCount(expectedCount) {
        await expect(this.validationMessages.filter({ hasText: 'Required' })).toHaveCount(expectedCount);
    }

    async verifyValidationMessage(message) {
        const validationMessage = this.page.getByText(message, { exact: true }).last();
        await expect(validationMessage).toBeVisible();
    }

    async verifyContactValidationMessage() {
        await expect(this.contactValidationMessage).toBeVisible();
        await expect(this.contactValidationMessage).toHaveText('Allows numbers and only + - / ( )');
    }

    async verifyCandidateDetail(candidateName, vacancy, status) {
        await expect(this.applicationStageHeading).toBeVisible();
        await expect(this.page.getByText(candidateName, { exact: true }).first()).toBeVisible();

        if (vacancy) {
            await expect(this.page.getByText(vacancy, { exact: true }).first()).toBeVisible();
        }

        if (status) {
            await expect(this.page.getByText(`Status: ${status}`, { exact: true })).toBeVisible();
        }
    }

    async getCandidateRowByName(candidateName) {
        return this.candidateRows.filter({ has: this.page.getByText(candidateName, { exact: true }) }).first();
    }

    async verifyCandidateRow(candidateName, vacancy, status) {
        const row = await this.getCandidateRowByName(candidateName);

        await expect(row).toBeVisible();

        const cells = row.locator('.oxd-table-cell');
        await expect(cells.nth(1)).toHaveText(vacancy);
        await expect(cells.nth(2)).toHaveText(candidateName);
        await expect(cells.nth(5)).toHaveText(status);
    }
}

module.exports = RecruitmentPage;