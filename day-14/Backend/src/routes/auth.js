const express = require('express');
const authController=require('../controllers/auth.controller')
const identifyuser=require('../middlewares/auth.middleware')

const authRouter=express.Router();


// Post /auth/register
authRouter.post('/register',authController.register)

authRouter.post('/login',authController.login)

/**
 * @route Get /auth/get-me
 * @desc Get the currently logged in user
 * @access Private
 */
authRouter.get('/get-me',identifyuser,authController.getMe)

module.exports=authRouter;