const { transporter } = require("../../config/config")
const { helperModel } = require("../../models/helperModel")
let validate = require('validator')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
let userOtp = new Map()
let saltRounds = 10

let sendOtp = async (req, res) => {
    let { helperName, helperEmail,helperProfile, helperPhone, helperPassword, helpercPassword } = req.body
    let obj
    if(helperProfile=='')
    {
        obj={
            status:0,
            msg:'please fill helper profile'
        }
        res.send(obj)
    }
    let checkEmail = await helperModel.findOne({ helperEmail: helperEmail })

    if (checkEmail) {
        obj = {
            status: 0,
            msg: 'this email already registerd'
        }
    }
    else {
        if (!validate.isEmail(helperEmail)) {
            obj = {
                status: 0,
                msg: "Invalid email format"
            }
            res.send(obj)
        }
        console.log(helperPassword)
        if (!validate.isStrongPassword(helperPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, })) {
            obj = {
                status: 0,
                msg: "Password must be strong (min 8 chars, include upper, lower, number, and symbol"
            }
            res.send(obj)
        }
        if (helperPassword == helpercPassword) {
            let randomOtp = Number((Math.random() * 99999).toString().split('.')[0].slice(0, 4))
            userOtp.set('myOTP', randomOtp)

            let info = await transporter.sendMail({
                from: '"MARCNOUS" <amolyadav95200@gmail.com>',
                to: `userEmail, ${helperEmail}`,
                subject: "MARCNOUS OTP",
                text: "OTP",
                html: `<b> OTP : ${randomOtp}</b>`,
            });
            obj = {
                status: 1,
                msg: 'send otp'
            }

        }
        else {
            obj = {
                status: 0,
                msg: 'password and confirm Password are not same'
            }
        }
    }
    res.send(obj)
}

let createHelperAccount = async (req, res) => {
  try {
    let { helperName, helperProfile, helperEmail, helperPhone, helperPassword, otp } = req.body;

    let myOtp = userOtp.get('myOTP');

    if (myOtp != otp) {
      return res.send({
        status: 0,
        msg: "please fill correct otp"
      });
    }

    // Hash password
    let hash = bcrypt.hashSync(helperPassword, saltRounds);

    let insertObj = {
      helperName,
      helperEmail,
      helperProfile,
      helperPhone,
      helperPassword: hash,
      otp
    };

    // Save helper
    let resApi = await helperModel.create(insertObj);

    // Send email notification
    await transporter.sendMail({
      from: '"MARCNOUS System" <amolyadav95200@gmail.com>',
      to: process.env.ADMINEMAIL,
      subject: "New Helper Registered - Please Review",
      html: `
        <div style="font-family: Arial; line-height: 1.6; padding: 10px;">
          <h2>New Helper Registration Alert</h2>
          <p>A new helper has registered on the MARCNOUS platform.</p>

          <h3>Helper Details:</h3>
          <ul>
            <li><b>Name:</b> ${helperName}</li>
            <li><b>Email:</b> ${helperEmail}</li>
            <li><b>Phone:</b> ${helperPhone}</li>
          </ul>

          <p>Please login to the Admin Panel and review the helper's profile.</p>
          <br />
          <b>– MARCNOUS System</b>
        </div>
      `
    });

    return res.send({
      status: 1,
      msg: "successfully register"
    });

  } catch (err) {
    console.log(err);
    return res.send({
      status: 0,
      msg: "Internal Server Error",
      error: err.message
    });
  }
};


let loginAccountHelper = async (req, res) => {
    let { helperEmail, helperPassword } = req.body
    let obj
    let checkEmail = await helperModel.findOne({ helperEmail })
    if (checkEmail) {
        if (checkEmail.helperStatus == false) {
            obj = {
                status: 0,
                msg: 'do not varify contact by admin'
            }
            res.send(obj)
        }
        else {
            let getPassDb = checkEmail.helperPassword
            let checkPass = bcrypt.compareSync(helperPassword, getPassDb)

            // check token 
            let token = jwt.sign({ id: checkEmail._id }, process.env.TOKENKEY);
            if (checkPass) {

                obj = {
                    status: 1,
                    msg: 'successfull login',
                    data: checkEmail,
                    token
                }
            }
            else {
                obj = {
                    status: 0,
                    msg: 'fill correct password'
                }
            }
        }

    }
    else {
        obj = {
            status: 0,
            msg: 'please fill valid email'
        }
    }
    res.send(obj)
}


let helperViewAccount =async (req, res) => {
  
    let {id}=req.body
    console.log(id)
    let obj
    await helperModel.findOne({_id:id})
    .then((resApi)=>{
        obj={
            status:1,
            data:resApi
        }
    })
    .catch((error)=>{
        obj={
                status:0,
             msg:'no data'
        }
    })
    res.send(obj)
}


module.exports = { sendOtp, createHelperAccount, loginAccountHelper,helperViewAccount }