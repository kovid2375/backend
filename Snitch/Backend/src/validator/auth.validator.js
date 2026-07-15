import {body,validationResult} from "express-validator"



function validateRequest(req,res,next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}



export const validationRegisterUser=[
    body("email").isEmail().withMessage("Invalid email format "),
    body("contact").notEmpty().withMessage("contact is required").matches(/^\d{10}$/).withMessage("contact must be a 10-digit number"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 Characters long"),
    body("fullName").notEmpty().withMessage("Full Name is Required").isLength({min:3}).withMessage("Full Name must be at least 3 Characters long"),

    validateRequest
]