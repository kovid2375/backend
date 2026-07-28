import express from "express"
import { authenticateSeller } from "../middlewares/auth.middelware.js"
import { createProducts } from "../controllers/product.controller.js"
import multer from "multer"
import { createProductValidator } from "../validator/product.validator.js"

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fieldSize:5*1024*1024 //5 mb
    }
})



const router=express.Router()

router.post("/",authenticateSeller,createProductValidator,upload.array("images",10),createProducts)






export default router