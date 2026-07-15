import { Router } from "express";
import {validationRegisterUser} from "../validator/auth.validator.js"

const router = Router();



router.post("/register",validationRegisterUser,)

export default router;
