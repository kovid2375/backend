import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';
import { registerValidation, validate } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/register', registerValidation, validate, register);


export default authRouter;