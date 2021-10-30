const nodemailer = require("nodemailer");

const { EmailTypes, INVITE_ARTICLE, ROLES } = require("../constants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = async (to, type, data = undefined) => {
  return new Promise(async (resolve, reject) => {
    let subject, htmlBody;
    switch (type) {
      case EmailTypes.REGISTER:
        subject = "Register success";
        htmlBody = `<b>Your account is registered in my web app.<a href='${process.env.FRONTEND_URI}/auth/login'>you can login now</a></b>`;
        break;

      case EmailTypes.FORGOT_PASSWORD:
        subject = "Forgot password";
        htmlBody = `<b><div>New password: ${data.password}</div><a href='${process.env.FRONTEND_URI}/auth/login'>you can login now</a></b>`;
        break;

      case INVITE_ARTICLE.INVITE_EDITOR:
        subject = data?.subject;
        htmlBody = `<b>You are invited to review article.<a href='${process.env.FRONTEND_URI}/articles/${ROLES.EDITOR}/management'>View</a></b><div>${data?.content}</div>`;
        break;

      case EmailTypes.REVIEWER_RESULT:
        subject = "Result from reviewer";
        htmlBody = `Review article success`;
        break;

      case INVITE_ARTICLE.SEND_RESULT_TO_CHIEF:
        subject = "Editor send result to Editor-in-Chief";
        htmlBody = `Editor send result to Editor-in-Chief`;
        break;

      case INVITE_ARTICLE.SEND_TO_PUBLISHER:
        subject = "Editor-in-Chief send Publisher";
        htmlBody = `Editor-in-Chief send Publisher`;
        break;

      default:
        break;
    }

    const emailContent = {
      to,
      subject,
      html: htmlBody,
    };

    try {
      await transporter.sendMail(emailContent);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
