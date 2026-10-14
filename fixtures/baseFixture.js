const { test: base, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const ResetPasswordPage = require('../pages/ResetPasswordPage');
const AdminPage = require('../pages/AdminPage');
const RecruitmentPage = require('../pages/RecruitmentPage');
const MyInfoPage = require('../pages/MyInfoPage');

const JsonReader = require('../utils/JsonReader');
const addHooks = require('../hooks/hooks');

const test = base.extend({
    loginData: async ({}, use) => {
        await use(JsonReader.login());
    },

    myInfoData: async ({}, use) => {
        await use(JsonReader.myInfo());
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    login: async ({ loginPage, loginData, dashboardPage }, use) => {
        const login = async () => {
            await loginPage.login(loginData.validUser.username, loginData.validUser.password);
            await expect(loginPage.page).toHaveURL(/\/dashboard\/index/);
            await expect(dashboardPage.dashboardHeading).toBeVisible();
        };

        await use(login);
    },

    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },

    resetPasswordPage: async ({ page }, use) => {
        const resetPasswordPage = new ResetPasswordPage(page);
        await use(resetPasswordPage);
    },

    adminPage: async ({ page }, use) => {
        const adminPage = new AdminPage(page);
        await use(adminPage);
    },

    recruitmentPage: async ({ page }, use) => {
        const recruitmentPage = new RecruitmentPage(page);
        await use(recruitmentPage);
    },

    myInfoPage: async ({ page }, use) => {
        const myInfoPage = new MyInfoPage(page);
        await use(myInfoPage);
    }
});

addHooks(test);

exports.test = test;
exports.expect = expect;