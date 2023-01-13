const nodemailer = require("nodemailer");
const systemConf = require(__path_configs + 'system')

const SendEmail = async (options) => {

  let transporter = nodemailer.createTransport({
    host: systemConf.SMTP_HOST,
    port: systemConf.SMTP_PORT,
    auth: {
      user: systemConf.SMTP_EMAIL,
      pass: systemConf.SMTP_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `${systemConf.FORM_NAME} <${systemConf.FORM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = SendEmail;