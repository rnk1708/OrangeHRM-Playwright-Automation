const CommanMethods = require('../utils/CommanMethods');

class DashboardPage {
    constructor(page) {
        this.page = page;
        this.dashboardHeading = page.getByRole('heading', {name: 'Dashboard'});
        this.adminMenu = page.getByRole('link', {name: 'Admin', exact: true});
        this.recruitmentMenu = page.getByRole('link', {name: 'Recruitment', exact: true});
    }

    async clickAdmin() {
        await CommanMethods.click(this.adminMenu);
    }

    async clickRecruitment() {
        await CommanMethods.click(this.recruitmentMenu);
    }
}

module.exports = DashboardPage;