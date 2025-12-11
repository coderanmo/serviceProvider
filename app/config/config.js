const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    
    user: process.env.EMAILPASS,
    pass:process.env.PASSEMAIL,
  },
});

module.exports = { transporter };
