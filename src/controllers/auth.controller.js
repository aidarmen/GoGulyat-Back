const USER = require('../models/user')
const Config = require('../config/config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


function signup(req, res, next) {

    USER.find({ email: req.body.email }, (err, users) => {
        console.log(req.body.email)
        if (err) {
            res.status(400).send({ err: err, data: null }).end();

        } else if (users && users.length > 0) {
            console.log("here")
            console.log(users)
            res.status(400).send({ err: 'User already registered', data: null }).end()
        } else {
            // create a sample user
            var newUser = new USER({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                age: req.body.age

            });
            newUser.save(function(err, user) {
                if (err) res.status(400).send({ err: 'Ошибка. Email уже используется.', data: null }).end()
                else {
                    next()
                }
            })

        }
    })

}

function signin(req, res) {
    USER.findOne({
        email: req.body.email
    }, (err, user) => {


        if (err) {
            res.status(400).send({ err: err, data: null }).end()
            console.log(1, err)
        }

        if (!user) {
            console.log(2, err)
            res.status(400).send({ err: 'Введен неверный логин или пароль', data: null }).end()
        } else if (user) {

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                console.log(3, err)
                res.status(400).send({ err: 'Введен неверный логин или пароль.', data: null }).end()
            } else {


                const payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    surname: user.surname
                }

                var token = jwt.sign(payload, Config.auth.JWT_SECRET, {
                    expiresIn: Config.auth.tokenExpiry // expires in 1 hour
                })

                res.status(200).send({ err: err, data: { user: payload, token: token } }).end()
            }

        }

    });
}


// function reset(req, res) {
//     USER.findOne({
//         email: req.body.email
//     }, (err, user) => {
    
//  });


// }

function reset(req, res) {
    USER.findOne({
        email: req.body.email
    }, (err, user) => {


        if (err)
            res.status(400).send({ err: err, data: null }).end()

        if (!user) {
            res.status(400).send({ err: 'Неправильный email', data: null }).end()
        } else if (user) {
            const payload = {
                _id: user._id,
                email: user.email
            }
            var token = jwt.sign(payload, Config.auth.JWT_SECRET, {
                expiresIn: Config.auth.tokenExpiry // expires in 1 hour
            })



            // var transporter = nodemailer.createTransport(smtpTransport({


            // }));
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                     // true for 465, false for other ports
                    auth: {
                        user: 'a87077380001@gmail.com', // generated ethereal user
                        pass: '123456Fizmat!' // generated ethereal password
                    }
                });
            
                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Fred Foo 👻" <a87077380001@gmail.com>', // sender address
                    to: 'a87077380001@gmail.com', // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world?', // plain text body
                    html: `<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
                
                            <!-- START CENTERED WHITE CONTAINER -->
                            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
                            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
                
                              <!-- START MAIN CONTENT AREA -->
                              <tr>
                                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                    <tr>
                                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi there,</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sometimes you just want to send a simple HTML email with a simple design and clear call to action. This is it.</p>
                                        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                          <tbody>
                                            <tr>
                                              <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                  <tbody>
                                                    <tr>
                                                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="https://www.google.com/search?source=hp&ei=CJ9TW4OfDMuyswGLmITQAQ&q=here+will+be+your+password+reset&oq=here+will+be+your+password+reset&gs_l=psy-ab.3...3410.13943.0.14131.37.34.0.0.0.0.488.5062.0j17j4j2j1.25.0....0...1.1.64.psy-ab..12.24.5140.6..0j35i39k1j0i203k1j0i10i203k1j0i22i30k1j0i22i10i30k1j33i21k1j33i160k1j33i22i29i30k1.218.8eAMC6cg_b4" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Call To Action</a> </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This is a really simple email template. Its sole purpose is to get the recipient to click the button with no distractions.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Good luck! Hope it works.</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                
                            <!-- END MAIN CONTENT AREA -->
                            </table>
                
                            <!-- START FOOTER -->
                            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>
                                    <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
                                  </td>
                                </tr>
                                <tr>
                                  
                                </tr>
                              </table>
                            </div>
                            <!-- END FOOTER -->
                
                          <!-- END CENTERED WHITE CONTAINER -->
                          </div>
                        </td>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                      </tr>
                    </table>` // html body
                };
            
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            });




        }

    });


}

function changepassword(req, res) {

    USER.findOne({
            email: req.user.email
        }, (err, user) => {
            USER.findByIdAndUpdate(user._id, { $set: { password: bcrypt.hashSync(req.body.password) } }, function(err, tank) {
                if (err) console.log(err)
                res.send({
                    'change': true
                });
            });
        })
        // res.send(req.user)
}




module.exports = {
    signup,
    signin,
    reset,
    changepassword

}