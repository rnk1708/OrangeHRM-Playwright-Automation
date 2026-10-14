const { test, expect } = require('../fixtures/baseFixture');

test.describe('My Info Module', () => {

    // MI01 - My Info access and page integrity
    test('MI01 - Verify My Info Access and Page Integrity @MyInfo @Smoke', async ({ login, dashboardPage, myInfoPage, page }) => {
        await login();

        await expect(dashboardPage.dashboardHeading).toBeVisible();

        await myInfoPage.openMyInfo();

        await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
        await expect(myInfoPage.personalDetailsHeading).toBeVisible();
        await expect(myInfoPage.employeeFullNameLabel).toBeVisible();
    });

    // MI02 - Personal Details controls and field behavior
    test('MI02 - Verify Personal Details Form Controls and Field Behavior @MyInfo @Regression', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();

        await myInfoPage.verifyPersonalDetailsControls();

        await expect(myInfoPage.formInputs.first()).toBeVisible();
        await expect(myInfoPage.dropdownControls).toHaveCount(2);
        await expect(myInfoPage.radioInputs).toHaveCount(2);
        await expect(myInfoPage.saveButtons.first()).toBeEnabled();
    });

    // MI03 - Personal Details required-field validation
    test('MI03 - Verify Personal Details Required-Field Validation @MyInfo @Negative', async ({ login, myInfoPage, myInfoData }) => {
        await login();
        await myInfoPage.openMyInfo();

        const originalFirstName = await myInfoPage.getPersonalNameValue('firstName');
        const originalLastName = await myInfoPage.getPersonalNameValue('lastName');

        try {
            // Use test data, then clear and blur each field to trigger UI validation.
            // Do not click Save: this is a shared public demo employee record.
            await myInfoPage.fillPersonalNameField('firstName', myInfoData.personalDetails.firstName);
            await myInfoPage.fillPersonalNameField('lastName', myInfoData.personalDetails.lastName);

            await myInfoPage.clearPersonalNameField('firstName');
            await myInfoPage.blurPersonalNameField('firstName');
            await expect(myInfoPage.getPersonalNameError('firstName')).toHaveText('Required', { timeout: 10000 });

            await myInfoPage.clearPersonalNameField('lastName');
            await myInfoPage.blurPersonalNameField('lastName');
            await expect(myInfoPage.getPersonalNameError('lastName')).toHaveText('Required', { timeout: 10000 });
        } finally {
            // Reload without submitting to discard all unsaved values.
            await myInfoPage.reloadCurrentPage();
            await expect(myInfoPage.personalDetailsHeading).toBeVisible({ timeout: 10000 });
        }

        await expect(myInfoPage.getPersonalNameInput('firstName')).toHaveValue(originalFirstName);
        await expect(myInfoPage.getPersonalNameInput('lastName')).toHaveValue(originalLastName);
    });

    // MI04 - Contact Details validation
    test('MI04 - Verify Contact Details Fields and Input Validation @MyInfo @Negative', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();
        await myInfoPage.openSection('Contact Details');

        await expect(myInfoPage.contactDetailsHeading).toBeVisible();
        await expect(myInfoPage.saveButtons.first()).toBeVisible();

        const originalEmail = await myInfoPage.getFieldValueByLabel('Work Email');
        await expect(myInfoPage.getFieldInput('Work Email')).toBeVisible();

        try {
            await myInfoPage.fillWorkEmail('not-an-email');
            await myInfoPage.clickSave();

            await expect(myInfoPage.getFieldErrorByLabel('Work Email')).toBeVisible();
        } finally {
            // Restore the original value and discard unsaved changes.
            await myInfoPage.fillWorkEmail(originalEmail);
            await myInfoPage.reloadCurrentPage();

            await expect(myInfoPage.contactDetailsHeading).toBeVisible({ timeout: 10000 });
        }
    });

    // MI05 - Navigation between My Info sections
    test('MI05 - Verify Navigation Between My Info Sections @MyInfo @Regression', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();

        const sections = [
            { name: 'Contact Details', heading: 'Contact Details' },
            { name: 'Emergency Contacts', heading: 'Assigned Emergency Contacts' },
            { name: 'Dependents', heading: 'Assigned Dependents' },
            { name: 'Immigration', heading: 'Assigned Immigration Records' },
            { name: 'Job', heading: 'Job Details' },
            { name: 'Qualifications', heading: 'Work Experience' },
            { name: 'Personal Details', heading: 'Personal Details' }
        ];

        for (const section of sections) {
            await myInfoPage.openSection(section.name);
            await expect(myInfoPage.getSectionHeading(section.heading)).toBeVisible({ timeout: 10000 });
        }
    });

    // MI06 - Verify unsaved changes are discarded
    test('MI06 - Verify Cancel or Reload Discards Unsaved Changes @MyInfo @Regression', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();

        const firstNameInput = myInfoPage.getPersonalNameInput('firstName');
        const originalValue = await myInfoPage.getPersonalNameValue('firstName');
        const temporaryValue = `${originalValue}Test`;

        await myInfoPage.updateFirstNameWithoutSaving(temporaryValue);

        await expect(firstNameInput).toHaveValue(temporaryValue);

        // Reload without saving; the shared demo record should remain unchanged.
        await myInfoPage.reloadAndVerifyPersonalDetails();

        await expect(myInfoPage.getPersonalNameInput('firstName')).toHaveValue(originalValue);
    });

    // MI07 - URL and visible-field checks
    test('MI07 - Verify My Info URL Exposure and Field Access Behavior @MyInfo @Security', async ({ login, myInfoPage, page }) => {
        await login();
        await myInfoPage.openMyInfo();

        const currentURL = page.url();

        expect(currentURL).not.toContain('?');
        expect(currentURL).not.toContain('#');

        await expect(myInfoPage.passwordFields).toHaveCount(0);
        await expect(myInfoPage.personalDetailsHeading).toBeVisible();

        // UI checks alone do not prove server-side authorization.
    });

 
    // MI08 - Emergency Contacts section and Add form
    test('MI08 - Verify Emergency Contacts Section and Add Form @MyInfo @Regression', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();
        await myInfoPage.openSection('Emergency Contacts');

        await expect(myInfoPage.emergencyContactsHeading).toBeVisible();
        await expect(myInfoPage.sectionTable).toBeVisible();

        const columns = [
            'Name',
            'Relationship',
            'Home Telephone',
            'Mobile',
            'Work Telephone',
            'Actions'
        ];

        for (const column of columns) {
            await expect(myInfoPage.sectionTable.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
        }

        await myInfoPage.clickSectionAdd('Assigned Emergency Contacts');

        await expect(myInfoPage.addForm).toBeVisible();
        await expect(myInfoPage.emergencyContactAddHeading).toBeVisible();
        await expect(myInfoPage.addForm.getByText('Name', { exact: true })).toBeVisible();
        await expect(myInfoPage.addForm.getByText('Relationship', { exact: true })).toBeVisible();
        await expect(myInfoPage.addForm.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
        await expect(myInfoPage.addForm.getByRole('button', { name: 'Cancel', exact: true })).toBeEnabled();

        // Cancel without creating a record in the shared demo account.
        await myInfoPage.cancelAddForm();
        await expect(myInfoPage.emergencyContactsHeading).toBeVisible();
    });

    // MI09 - Dependents section and Add form
    test('MI09 - Verify Dependents Section and Add Form @MyInfo @Regression', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();
        await myInfoPage.openSection('Dependents');

        await expect(myInfoPage.dependentsHeading).toBeVisible();
        await expect(myInfoPage.sectionTable).toBeVisible();

        const columns = [
            'Name',
            'Relationship',
            'Date of Birth',
            'Actions'
        ];

        for (const column of columns) {
            await expect(myInfoPage.sectionTable.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
        }

        await myInfoPage.clickSectionAdd('Assigned Dependents');

        await expect(myInfoPage.addForm).toBeVisible();
        await expect(myInfoPage.dependentAddHeading).toBeVisible();
        await expect(myInfoPage.addForm.getByText('Name', { exact: true })).toBeVisible();
        await expect(myInfoPage.addForm.getByText('Relationship', { exact: true })).toBeVisible();
        await expect(myInfoPage.addForm.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
        await expect(myInfoPage.addForm.getByRole('button', { name: 'Cancel', exact: true })).toBeEnabled();

        // Cancel without creating a dependent record.
        await myInfoPage.cancelAddForm();
        await expect(myInfoPage.dependentsHeading).toBeVisible();
    });

    // MI10 - Immigration section and Add form
    test('MI10 - Verify Immigration Records Section and Add Form @MyInfo @Regression', async ({ login, myInfoPage }) => {
        await login();
        await myInfoPage.openMyInfo();
        await myInfoPage.openSection('Immigration');

        await expect(myInfoPage.immigrationHeading).toBeVisible();
        await expect(myInfoPage.sectionTable).toBeVisible();

        const columns = [
            'Document',
            'Number',
            'Issued By',
            'Issued Date',
            'Expiry Date',
            'Actions'
        ];

        for (const column of columns) {
            await expect(myInfoPage.sectionTable.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
        }

        await myInfoPage.clickSectionAdd('Assigned Immigration Records');

        await expect(myInfoPage.addForm).toBeVisible();
        await expect(myInfoPage.immigrationAddHeading).toBeVisible();
        await expect(myInfoPage.addForm.getByText('Number', { exact: true })).toBeVisible();
        await expect(myInfoPage.addForm.getByText('Issued By', { exact: true })).toBeVisible();
        await expect(myInfoPage.addForm.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
        await expect(myInfoPage.addForm.getByRole('button', { name: 'Cancel', exact: true })).toBeEnabled();

        // Cancel without creating an immigration record.
        await myInfoPage.cancelAddForm();
        await expect(myInfoPage.immigrationHeading).toBeVisible();

    });
});