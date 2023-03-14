const SparkPost = require('sparkpost');
const sparky = new SparkPost('bff6ebefcf127e11e3f36f4596e7a1f549af1a9b');
const SendEmail = async (options) => {
  const msg = {
    recipients: [{ address: options.email }],
    content: {
      from: {
        email: "thienmail314@gmail.com"
      },
      subject: options.subject,
      text: options.message
    }
  }

  sparky.transmissions.send(msg);
};

module.exports = SendEmail;