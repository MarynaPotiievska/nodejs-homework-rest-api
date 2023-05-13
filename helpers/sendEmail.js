require("dotenv").config();

const nodemailer = require("nodemailer");

const sendEmail = (email) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  return transport.sendMail({ ...email, from: "marynochka93@gmail.com" });
};

module.exports = sendEmail;
