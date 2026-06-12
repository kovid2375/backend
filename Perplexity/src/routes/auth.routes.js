import { Router } from 'express';
import { register, verifyEmail,login, getMe } from '../controllers/auth.controller.js';
import { registerValidation, validate,loginValidator } from '../validators/auth.validator.js';
import { authUser } from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerValidation, validate, register);

authRouter.get('/verify-email',verifyEmail)

authRouter.post('/login',loginValidator,validate,login)

authRouter.get('/get-me',authUser,getMe)

export default authRouter;