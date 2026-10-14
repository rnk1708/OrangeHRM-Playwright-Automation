class ResetPasswordPage {

    constructor(page) {

        this.page = page;

        this.resetPasswordHeading =
            page.getByRole('heading', {
                name: 'Reset Password'
            });
    }

}

module.exports = ResetPasswordPage;