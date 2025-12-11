const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: 'anmolyadav95200@gmail.com',
    pass: process.env.PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});
