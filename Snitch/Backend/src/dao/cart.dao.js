import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {
    let cart = (await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.product'
            }
        },
        { $unwind: { path: '$items.product' } },
        {
            $addFields: {
                matchedVariant: {
                    $first: {
                        $filter: {
                            input: '$items.product.variants',
                            as: 'variant',
                            cond: {
                                $eq: ['$$variant._id', '$items.variant']
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                itemPrice: {
                    price: {
                        $multiply: [
                            '$items.quantity',
                            {
                                $ifNull: [
                                    '$matchedVariant.price.amount',
                                    '$items.product.price.amount'
                                ]
                            }
                        ]
                    },
                    currency: {
                        $ifNull: [
                            '$matchedVariant.price.currency',
                            '$items.product.price.currency'
                        ]
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice.price' },
                currency: {
                    $first: '$itemPrice.currency'
                },
                items: { $push: '$items' }
            }
        }
    ]))[ 0 ]

    return cart
}
