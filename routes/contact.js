const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('../config/mail');

const router=express.Router();

router.get("/contact",(req,res)=>{
        msg="";
        res.render("contact",{msg});
})

//Post Email Request
router.post('/contact', (req, res) => {

    //Email Template
    const output = `
        <p>You have a message</p>
        <h3>Contact Details</h3>
        <p>Name: ${req.body.name}</p>
        <p>Email: ${req.body.email}</p>
        <h3>Message:</h3>
        <p>${req.body.message}</p>
    `;

    //Alert if success sending email
    const successAlert = `Message has been sent`;

    //Alert if fail sending email
    const failAlert = `Failed to send message. Please refresh this page.`;


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                    user: config.user,
                    pass: config.pass
            },
            tls:{
                rejectUnauthorized:false
            }
    });

    // setup email data with unicode symbols
    let mailOptions = {
            from: config.from,
            to: config.to,
            subject: config.subject,
            html: output
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.render("contact", {msg: failAlert});
            }

            res.render("contact", {msg: successAlert});
    });
});


module.exports=router;