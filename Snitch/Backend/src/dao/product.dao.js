import productModel from "../models/product.model.js";


export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    const stock = product.variants.find(variant => variant._id.toString() === variantId).stock

    return stock
}

export const getProductStockContext = async (productId, variantId) => {
    const product = await productModel.findById(productId)

    if (!product) {
        return { product: null, stock: null, hasVariants: false }
    }

    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0

    if (!variantId) {
        return {
            product,
            stock: hasVariants ? null : Number.POSITIVE_INFINITY,
            hasVariants
        }
    }

    const variant = product.variants.find(
        (item) => item._id.toString() === variantId
    )

    return {
        product,
        stock: variant ? variant.stock : null,
        hasVariants
    }
}
