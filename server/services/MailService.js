const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MailService {
  static async send(to, subject, text) {
    try {
      const data = {
        from: "someone@gmail.com", //TODO: change to wanted email
        to,
        subject,
        text,
      };
      return await sgMail.send(data);
    } catch (e) {
      if (e.response) console.log(e.response);
      throw e;
    }
  }
}

module.exports = MailService;
