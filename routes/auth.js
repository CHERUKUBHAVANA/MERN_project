const express = require('express')
const { signup, accountActivation, signin, forgotPassword, resetPassword, googleLogin } = require('../controllers/auth')

const {userSignupvalidator, userSigninValidator, resetPasswordValidator, forgotPasswordValidator} = require('../validators/auth')
const {runValidation} = require('../validators/index')

const router = express.Router()

// router.get('/signup', signup)
router.post('/signup',userSignupvalidator, runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/signin', userSigninValidator, runValidation, signin)
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)

//google and facebook
router.post('/google-login', googleLogin)

module.exports = router // {}