const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAILPASS,
    pass: process.env.PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});
