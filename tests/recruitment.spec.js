const { test } = require('../fixtures/baseFixture');
const ExcelReader = require('../utils/ExcelReader');

const recruitmentSearchData = ExcelReader.readExcel('testdata/RecruitmentData.xlsx', 'RecruitmentSearchData');
const recruitmentFormData = ExcelReader.readExcel('testdata/RecruitmentData.xlsx', 'RecruitmentFormData');
const recruitmentValidationData = ExcelReader.readExcel('testdata/RecruitmentData.xlsx', 'RecruitmentValidationData');

test.describe('Recruitment Module Tests', () => {

    test('R01 - Verify Recruitment Candidate Management Page and Candidate List Availability @Recruitment @Smoke', async ({ login, dashboardPage, recruitmentPage }) => {
        await login();
        await dashboardPage.clickRecruitment();
        await recruitmentPage.verifyCandidatesPage();
    });

    test('R02 - Verify Candidate Search, Filtering and Reset Functionality @Recruitment @Regression', async ({ login, dashboardPage, recruitmentPage }) => {
        const searchData = recruitmentSearchData[0];

        await login();
        await dashboardPage.clickRecruitment();

        await recruitmentPage.fillSearchKeywords(searchData.CandidateSearch);
        await recruitmentPage.searchCandidates();
        await recruitmentPage.verifySearchKeywords(searchData.CandidateSearch);

        await recruitmentPage.resetSearch();
        await recruitmentPage.verifySearchFieldsReset();
    });

    test('R03 - Verify Candidate Form Required and Field Validations @Recruitment @Negative', async ({ login, dashboardPage, recruitmentPage }) => {
        const validationData = recruitmentValidationData[0];
        const emailData = recruitmentValidationData[1];
        const contactData = recruitmentValidationData[2];

        await login();
        await dashboardPage.clickRecruitment();

        await recruitmentPage.clickAdd();
        await recruitmentPage.submitCandidateForm();
        await recruitmentPage.verifyRequiredValidationCount(Number(validationData.ExpectedRequiredCount));

        await recruitmentPage.goToCandidates();
        await recruitmentPage.clickAdd();
        await recruitmentPage.fillFirstName(emailData.FirstName);
        await recruitmentPage.fillLastName(emailData.LastName);
        await recruitmentPage.fillEmail(emailData.Email);
        await recruitmentPage.submitCandidateForm();
        await recruitmentPage.verifyValidationMessage(emailData.ExpectedMessage);

        await recruitmentPage.goToCandidates();
        await recruitmentPage.clickAdd();
        await recruitmentPage.fillFirstName(contactData.FirstName);
        await recruitmentPage.fillLastName(contactData.LastName);
        await recruitmentPage.fillEmail(contactData.Email);
        await recruitmentPage.fillInvalidContactNumber(contactData.ContactNumber);
        await recruitmentPage.verifyContactValidationMessage();
    });

    test('R04 - Verify Candidate Form Controls and Input Data @Recruitment @Regression', async ({ login, dashboardPage, recruitmentPage }) => {
        const formData = recruitmentFormData[0];

        await login();
        await dashboardPage.clickRecruitment();
        await recruitmentPage.clickAdd();

        await recruitmentPage.fillFirstName(formData.FirstName);
        await recruitmentPage.fillMiddleName(formData.MiddleName);
        await recruitmentPage.fillLastName(formData.LastName);
        await recruitmentPage.selectFormVacancy(formData.Vacancy);
        await recruitmentPage.fillEmail(formData.Email);
        await recruitmentPage.fillContactNumber(formData.ContactNumber);
        await recruitmentPage.fillKeywords(formData.Keywords);
        await recruitmentPage.selectTodayDate();
        await recruitmentPage.fillNotes(formData.Notes);
        await recruitmentPage.checkConsent();
        await recruitmentPage.verifyFormData(formData);
    });

    test('R05 - Verify Candidate Resume Upload Functionality @Recruitment @Regression', async ({ login, dashboardPage, recruitmentPage }) => {
        const formData = recruitmentFormData[0];

        await login();
        await dashboardPage.clickRecruitment();
        await recruitmentPage.clickAdd();
        await recruitmentPage.uploadResume(formData.ResumePath);
    });

    test('R06 - Verify Complete Candidate Creation and Retrieval Workflow @Recruitment @Smoke', async ({ login, dashboardPage, recruitmentPage }) => {
        const baseFormData = recruitmentFormData[1];
        const uniqueSuffix = Date.now().toString(36);
        const uniqueFirstName = `${baseFormData.FirstName}${uniqueSuffix}`;
        const formData = {
            ...baseFormData,
            FirstName: uniqueFirstName,
            FullName: `${uniqueFirstName} ${baseFormData.MiddleName} ${baseFormData.LastName}`,
            Email: `playwright.${uniqueSuffix}@example.com`,
            SearchText: uniqueFirstName
        };

        await login();
        await dashboardPage.clickRecruitment();

        await recruitmentPage.clickAdd();
        await recruitmentPage.createCandidate(formData);
        await recruitmentPage.verifyCandidateDetail(formData.FullName, formData.Vacancy, formData.Status);

        await recruitmentPage.goToCandidates();
        await recruitmentPage.searchByCandidateName(formData.SearchText);
        await recruitmentPage.searchCandidates();
        await recruitmentPage.verifyCandidateRow(formData.FullName, formData.Vacancy, formData.Status);
    });
});