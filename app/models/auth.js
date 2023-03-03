const MainModel = require(__path_schemas + 'users');
const SendEmail     = require(__path_utils + 'SendEmail')
const crypto 	    = require('crypto');

module.exports = {
    create: async (item) => {
        const user = await new MainModel(item).save();
        return await user.getSignedJwtToken();

    },
    login: async (item, res) => {
        const { email, password } = item;
        const result = await MainModel.findByCredentials(email, password);
        if (result.err) {
            res.status(401).json({ success: true, message: result.err })
            return false;
        }
        return await result.user.getSignedJwtToken()
    },
    forgotPassword: async (item) => {
        const user = await MainModel.findOne({ email: item.email })
        if (!user) return false;
        const resetToken = user.resetPassword();
        await user.save();

        // creat resetURL
        const resetURL = `/api/v1/auth/resetPassword/${resetToken}`;
        const message = `Truy cập vào link để đổi pass : ${resetURL}`;

        try {
            await SendEmail({
                email: user.email,
                subject: "Thay đổi PassWord",
                message
            })
            return 'Vui lòng check email của bạn';
        } catch (err) {
                user.resetPassToken = undefined,
                user.resetPassTokenExp = undefined,
                await user.save();
            return 'Không thể gửi email , vui lòng thử lại';
        }
    },
    resetPassword: async (item) => {
        const resetPassToken = crypto
            .createHash('sha256')
            .update(item.resetToken)
            .digest('hex');

        const user = await MainModel.findOne({
            resetPassToken: resetPassToken,
            resetPassTokenExp: { $gt: Date.now() }
        })


        if (!user) return false;

        user.password = item.password;
        user.resetPassToken = undefined,
            user.resetPassTokenExp = undefined,

            await user.save();
        return user;
    },
}