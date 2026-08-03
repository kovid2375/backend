import express from "express"
import { authenticateSeller, authenticateUser } from "../middlewares/auth.middelware.js"
import { addProductVariant, createProducts, getAllProducts, getProductDetails, getSellerProducts } from "../controllers/product.controller.js"
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

// get products for the buyer
router.get("/buyer",getAllProducts)

//get product detail
router.get("/detail/:id",getProductDetails)

//post products variants

router.post("/:productId/variants",authenticateSeller,upload.array('images',5),addProductVariant)





export default router