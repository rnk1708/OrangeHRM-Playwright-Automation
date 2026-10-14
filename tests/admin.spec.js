const { test } = require('../fixtures/baseFixture');
const ExcelReader = require('../utils/ExcelReader');

const adminSearchData = ExcelReader.readExcel('testdata/OrangeHRMData.xlsx', 'AdminSearchData');
const adminCreateData = ExcelReader.readExcel('testdata/OrangeHRMData.xlsx', 'AdminCreateData');
const adminValidationData = ExcelReader.readExcel('testdata/OrangeHRMData.xlsx', 'AdminValidationData');
const adminEditData = ExcelReader.readExcel('testdata/OrangeHRMData.xlsx', 'AdminEditData');

test.describe('Admin Module Tests', () => {

    test('A01 - Verify Admin User Management Module and Users List Availability @Admin @Smoke', async ({ login, dashboardPage, adminPage }) => {
        await login();
        await dashboardPage.clickAdmin();
        await adminPage.verifyUserManagementPage();
    });

    test.fixme('A02 - Verify User Search, Multi-Criteria Filtering and Reset Functionality @Admin @Regression', async ({ login, dashboardPage, adminPage }) => {

        const searchData = adminSearchData[0];

        await login();
        await dashboardPage.clickAdmin();

        await adminPage.searchByUsername(searchData.Username);
        await adminPage.verifyUserRecordByUsername(searchData.Username);

        await adminPage.resetSearch();
        await adminPage.verifySearchFieldsReset();

        await adminPage.searchByRoleAndStatus(searchData.UserRole, searchData.Status);
        await adminPage.verifyUsersByRoleAndStatus(searchData.UserRole, searchData.Status);

        await adminPage.resetSearch();
        await adminPage.verifySearchFieldsReset();
    });

    test.fixme('A03 - Verify New System User Creation and Retrieval @Admin @Smoke', async ({ login, dashboardPage, adminPage }) => {

        const createData = adminCreateData[0];

        await login();
        await dashboardPage.clickAdmin();

        await adminPage.deleteUserIfExists(createData.Username);
        await adminPage.clickAdd();
        await adminPage.createUser(createData);

        await adminPage.goToUserManagement();
        await adminPage.searchByUsername(createData.Username);
        await adminPage.verifyUserRecord(createData.Username, createData.UserRole, createData.Status);

        await adminPage.clickDeleteUser(createData.Username);
        await adminPage.confirmDelete();
        await adminPage.goToUserManagement();
    });

    test('A04 - Verify System User Creation Field Validations @Admin @Negative', async ({ login, dashboardPage, adminPage }) => {
        const requiredData = adminValidationData[0];
        const boundaryData = adminValidationData[1];
        const invalidEmployeeData = adminValidationData[2];

        await login();
        await dashboardPage.clickAdmin();

        // Required fields
        await adminPage.clickAdd();
        await adminPage.selectFormRole(requiredData.UserRole);
        await adminPage.selectFormStatus(requiredData.Status);
        await adminPage.enterPassword(requiredData.Password);
        await adminPage.enterConfirmPassword(requiredData.ConfirmPassword);
        await adminPage.saveUser();
        await adminPage.verifyValidationMessageCount(requiredData.ExpectedMessage, Number(requiredData.ExpectedCount));

        // Username minimum length
        await adminPage.goToUserManagement();
        await adminPage.clickAdd();
        await adminPage.selectFormRole(boundaryData.UserRole);
        await adminPage.selectFirstAvailableEmployee();
        await adminPage.selectFormStatus(boundaryData.Status);
        await adminPage.enterUsername(boundaryData.Username);
        await adminPage.saveUser();
        await adminPage.verifyValidationMessage(boundaryData.ExpectedMessage);

        // Invalid employee
        await adminPage.goToUserManagement();
        await adminPage.clickAdd();
        await adminPage.selectFormRole(invalidEmployeeData.UserRole);
        await adminPage.selectFormStatus(invalidEmployeeData.Status);
        await adminPage.enterEmployeeName(invalidEmployeeData.EmployeeName);
        await adminPage.enterUsername(invalidEmployeeData.Username);
        await adminPage.enterPassword(invalidEmployeeData.Password);
        await adminPage.enterConfirmPassword(invalidEmployeeData.ConfirmPassword);
        await adminPage.saveUser();
        await adminPage.verifyValidationMessage(invalidEmployeeData.ExpectedMessage);
    });

    test('A05 - Verify Duplicate Username and Password Confirmation Validation During User Creation @Admin @Negative', async ({ login, dashboardPage, adminPage }) => {
        const duplicateData = adminValidationData[3];
        const mismatchData = adminValidationData[4];

        await login();
        await dashboardPage.clickAdmin();

        // Duplicate username validation
        await adminPage.clickAdd();
        await adminPage.selectFormRole(duplicateData.UserRole);
        await adminPage.selectFirstAvailableEmployee();
        await adminPage.selectFormStatus(duplicateData.Status);
        await adminPage.enterUsername(duplicateData.Username);
        await adminPage.blurUsernameField();
        await adminPage.verifyValidationMessage(duplicateData.ExpectedMessage);

        // Password confirmation validation
        await adminPage.goToUserManagement();
        await adminPage.clickAdd();
        await adminPage.createUser(mismatchData, { useFirstAvailableEmployee: true });
        await adminPage.verifyValidationMessage(mismatchData.ExpectedMessage);
    });

    test.fixme('A06 - Verify Existing User Can Be Edited and Updated Data Persists @Admin @Regression', async ({ login, dashboardPage, adminPage }) => {

        const createData = adminCreateData[1];
        const editData = adminEditData[0];

        await login();
        await dashboardPage.clickAdmin();

        await adminPage.deleteUserIfExists(createData.Username);
        await adminPage.clickAdd();
        await adminPage.createUser(createData);

        await adminPage.goToUserManagement();
        await adminPage.searchByUsername(createData.Username);
        await adminPage.verifyUserRecord(createData.Username, createData.UserRole, createData.Status);

        await adminPage.clickEditUser(createData.Username);
        await adminPage.updateUserStatus(editData.UpdatedStatus);
        await adminPage.saveUser();

        await adminPage.goToUserManagement();
        await adminPage.searchByUsername(createData.Username);
        await adminPage.verifyUserRecord(createData.Username, editData.OriginalRole, editData.UpdatedStatus);

        await adminPage.clickEditUser(createData.Username);
        await adminPage.updateUserStatus(editData.OriginalStatus);
        await adminPage.saveUser();

        await adminPage.goToUserManagement();
        await adminPage.searchByUsername(createData.Username);
        await adminPage.verifyUserRecord(createData.Username, editData.OriginalRole, editData.OriginalStatus);

        await adminPage.clickDeleteUser(createData.Username);
        await adminPage.confirmDelete();
        await adminPage.goToUserManagement();
    });

    test.fixme('A07 - Verify User Deletion and Record Removal @Admin @Regression', async ({ login, dashboardPage, adminPage }) => {

        const deleteData = adminCreateData[2];

        await login();
        await dashboardPage.clickAdmin();

        await adminPage.deleteUserIfExists(deleteData.Username);
        await adminPage.clickAdd();
        await adminPage.createUser(deleteData);

        await adminPage.goToUserManagement();
        await adminPage.searchByUsername(deleteData.Username);
        await adminPage.verifyUserRecord(deleteData.Username, deleteData.UserRole, deleteData.Status);

        await adminPage.clickDeleteUser(deleteData.Username);
        await adminPage.confirmDelete();

        await adminPage.goToUserManagement();
        await adminPage.searchByUsername(deleteData.Username);
        await adminPage.verifyUserNotFound();
    });

});