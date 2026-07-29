import express from "express"
import { authenticateSeller } from "../middlewares/auth.middelware.js"
import { createProducts, getSellerProducts } from "../controllers/product.controller.js"
import multer from "multer"
import { createProductValidator } from "../validator/product.validator.js"

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fieldSize:5*1024*1024 //5 mb
    }
})



const router=express.Router()
//create product by the seller
router.post("/",authenticateSeller,upload.array("images",10),createProductValidator,createProducts)
//get products of the seller 

router.get("/seller",authenticateSeller,getSellerProducts)





export default router