
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { expressjwt } = require("express-jwt");
const _ = require('lodash')
const elasticEmail = require('@elasticemail/elasticemail-client');
const { OAuth2Client } = require('google-auth-library')

exports.signup = (req, res) => {
    //console.log(req.body)
    const { name, email, password } = req.body
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })

        const client = elasticEmail.ApiClient.instance;
        const apikey = client.authentications['apikey'];
        apikey.apiKey = process.env.ELASTICMAIL_API_KEY;

        let api = new elasticEmail.EmailsApi()

        const emailData = {
            Recipients: {
                To: [email]
            },
            Content: {
                Body: [
                    {
                        ContentType: "HTML",
                        Charset: "utf-8",
                        Content: `
                        <h1>Please use the following link to activate your account</h1>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    `
                    },
                    {
                        ContentType: "plainText",
                        Charset: "utf-8",
                        Content: "Activate your Account"
                    }
                ],
                From: process.env.EMAIL_FROM,
                subject: "Account Activation Link",
            },
        }
        const callback = (err, data, response) => {
            if (err) {
                console.error(err)
                res.status(200).json({ success: err })
            }
            else {
                console.log('API called successfully')
                console.log('Email sent')
                console.log(req.body)
                res.status(200).json({
                    success: "done",
                    message: `Email is successfully sent to ${email}`
                })
            }
        }
        api.emailsTransactionalPost(emailData, callback)
    })
}

exports.accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            if (err) {
                // console.log('JWT VERIFY IN ACTIVATION ERROR', err)
                return res.status(401).json({
                    error: 'Expired link! SignUp again'
                })
            }
            const { name, email, password } = jwt.decode(token)
            const newUser = new User({ name, email, password })
            // console.log(newUser)
            newUser.save((err, user) => {
                if (err) {
                    // console.log('SAVE USER IN ACTIVATION ACCOUNT ERROR', err)
                    return res.status(400).json({
                        error: 'Error saving user in database, Try signup again'
                    })
                }
                return res.json({
                    message: 'SignUp success, please signin'
                })
            })
        })
    }
    else {
        return res.json({
            message: 'Something went wrong! Try again'
        })
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email doesn't exist, please SignUp!"
            })
        }
        //authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Incorrect password"
            })
        }

        //generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const { _id, name, email, role } = user

        return res.json({
            token: token,
            user: { _id, name, email, role }
        })
    })
}

exports.requireSignin = expressjwt({ //Middleware -  so that only authorized/logged in user can see the profile
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], //makes data available in req.user
})

exports.adminMiddleware = (req, res, next) => {
    // console.log(req.auth)
    User.findById({ _id: req.auth._id }).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        if (user.role !== "admin") {
            return res.status(400).json({
                error: "Admin resource access denied"
            })
        }
        req.profile = user
        next()
    })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email doesn't exist"
            })
        }
        const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' })

        const client = elasticEmail.ApiClient.instance;
        const apikey = client.authentications['apikey'];
        apikey.apiKey = process.env.ELASTICMAIL_API_KEY;

        let api = new elasticEmail.EmailsApi()

        const emailData = {
            Recipients: {
                To: [email]
            },
            Content: {
                Body: [
                    {
                        ContentType: "HTML",
                        Charset: "utf-8",
                        Content: `
                        <h1>Please use the following link to reset your password</h1>
                        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                    `
                    },
                    {
                        ContentType: "plainText",
                        Charset: "utf-8",
                        Content: "Reset your password"
                    }
                ],
                From: process.env.EMAIL_FROM,
                subject: "Password Reset Link",
            },
        }

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.status(400).json({
                    err: 'Database Connection error on user forgot password request'
                })
            }
            const callback = (err, data, response) => {
                if (err) {
                    console.error(err)
                    res.status(200).json({ success: err })
                }
                else {
                    console.log('API called successfully')
                    console.log('Email sent')
                    console.log(req.body)
                    res.status(200).json({
                        success: "done",
                        message: `Reset password link is successfully sent to ${email}`
                    })
                }
            }
            api.emailsTransactionalPost(emailData, callback)
        })
    })
}

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    err: 'Expired link, try again!'
                })
            }
            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        err: 'Something went wrong, try later!'
                    })
                }
                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }
                user = _.extend(user, updatedFields)
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            err: 'Error resetting user password'
                        })
                    }
                    res.json({
                        message: `Great! Now, you can signin with your new password`
                    })
                })
            })
        })
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin = (req, res) => {
    const { idToken } = req.body
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        const { email_verified, name, email } = response.payload
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
                    const { _id, email, name, role } = user
                    return res.json({
                        token, user: { _id, email, name, role }
                    })
                }
                else {
                    let password = email + process.env.JWT_SECRET
                    user = new User({ name, email, password })
                    user.save((err, data) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'User signup failed with google'
                            })
                        }
                        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
                        const { _id, email, name, role } = data
                        return res.json({
                            token, user: { _id, email, name, role }
                        })
                    })
                }
            })
        }else{
            return res.status(400).json({
                error: 'Google login failed, try again!'
            })
        }
    })
}