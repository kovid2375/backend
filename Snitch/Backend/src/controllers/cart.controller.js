import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import { getProductStockContext } from "../dao/product.dao.js";
import { getCartDetails } from "../dao/cart.dao.js";

const sameVariant = (itemVariant, variantId) => String(itemVariant || "") === String(variantId || "")

export const addToCart=async (req,res)=>{
    const {productId,variantId}=req.params
    const {quantity=1}=req.body
    const { product, stock, hasVariants } = await getProductStockContext(productId, variantId)
    
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }

    if (hasVariants && !variantId) {
        return res.status(400).json({
            success: false,
            message: "Please select a product variant"
        })
    }

    if (variantId && stock === null) {
        return res.status(404).json({
            success: false,
            message: "Product variant not found"
        })
    }

    const cart =(await cartModel.findOne({
        user:req.user._id
    }))|| (await cartModel.create({user:req.user._id}))

    const isProductAlreadyInCart=cart.items.some(
        item=>item.product.toString()=== productId && sameVariant(item.variant, variantId)
    )
    if(isProductAlreadyInCart){
        const quantityInCart=cart.items.find(
            item=>item.product.toString()=== productId && sameVariant(item.variant, variantId)
        ).quantity
        if(Number.isFinite(stock) && quantityInCart + quantity > stock){
            return res.status(400).json({
                message:`Only ${stock} items left in stock . and you already have ${quantityInCart} items in your cart`,
                success:false
            })
        }
        await cartModel.findOneAndUpdate(
            {user:req.user._id,"items.product":productId,"items.variant":variantId},
            {$inc:{"items.$.quantity":quantity}},
            {new:true}
        )
        return res.status(200).json({
            message:"Cart updated Successfully",
            success:true
        })
    }
    if (Number.isFinite(stock) && quantity>stock){
        return res.status(400).json({
            message:`Only ${stock} items lest in stock`,
            success:false
        })
    }
    cart.items.push({
        product:productId,
        variant:variantId,
        quantity,
        price:product.price
    })
    await cart.save()

    return res.status(200).json({
        message:"Product added to cart SuccessFully",
        success:true

    })
}
export const getCart=async(req,res)=>{
    const user =req.user
    let cart = await getCartDetails(user._id)
    if(!cart){
        cart=await cartModel.create({user:user._id})
    }
    return res.status(200).json({
        message:"cart fetched sucessfully",
        success:true,
        cart
    })
}
export const incrementCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params

    const { product, stock, hasVariants } = await getProductStockContext(productId, variantId)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    if (hasVariants && !variantId) {
        return res.status(400).json({
            message: "Please select a product variant",
            success: false
        })
    }

    if (variantId && stock === null) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const itemQuantityInCart = cart.items.find(
        item => item.product.toString() === productId && sameVariant(item.variant, variantId)
    )?.quantity || 0

    if (Number.isFinite(stock) && itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": 1 } },
        { new: true }
    )

    return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true
    })
}


